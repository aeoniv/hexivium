
'use client';

import * as React from 'react';
import {Check, ChevronsUpDown} from 'lucide-react';

import {cn} from '@/lib/utils';
import {Button} from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import tzLookup from 'tz-lookup';

export interface City {
  id: string; // Using place_id from Google as the unique ID
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

interface CityComboboxProps {
  value: City | null;
  onChange: (city: City | null) => void;
  disabled?: boolean;
}

export function CityCombobox({value, onChange, disabled}: CityComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [suggestions, setSuggestions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    if (debouncedSearch.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        // We'll use a server action to proxy the request to Google, keeping the API key secure.
        // Let's create `getPlaceAutocomplete` action for this.
        const response = await fetch(`/api/google/places-autocomplete?input=${encodeURIComponent(debouncedSearch)}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }
        
        setSuggestions(data.predictions || []);

      } catch (error: any) {
        console.error('Failed to fetch city suggestions:', error);
        toast({
            variant: "destructive",
            title: "Could not fetch cities",
            description: error.message
        })
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, toast]);
  
  const handleSelect = async (placeId: string, description: string) => {
    setIsLoading(true);
    try {
        const response = await fetch(`/api/google/place-details?place_id=${placeId}`);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error);
        }

        const location = data.result?.geometry?.location;
        if (!location) {
            throw new Error("Could not retrieve location details for the selected city.");
        }

        const lat = location.lat;
        const lng = location.lng;
        
        const countryComponent = data.result.address_components.find((c: any) => c.types.includes('country'));
        const admin1Component = data.result.address_components.find((c: any) => c.types.includes('administrative_area_level_1'));
        const cityComponent = data.result.address_components.find((c: any) => c.types.includes('locality') || c.types.includes('postal_town'));


        const city: City = {
            id: placeId,
            name: cityComponent?.long_name || description.split(',')[0],
            latitude: lat,
            longitude: lng,
            country: countryComponent?.long_name || '',
            admin1: admin1Component?.long_name || '',
            timezone: tzLookup(lat, lng),
        };
        
        onChange(city);
        setOpen(false);
        setSearch(getDisplayValue(city));

    } catch (error: any) {
         toast({
            variant: "destructive",
            title: "Could not fetch city details",
            description: error.message
        });
        onChange(null);
    } finally {
        setIsLoading(false);
    }
  };

  const getDisplayValue = (city: City | null) => {
    if (!city) return "Select city...";
    let displayName = city.name;
    if (city.admin1 && city.admin1 !== city.name) displayName += `, ${city.admin1}`;
    if (city.country) displayName += `, ${city.country}`;
    return displayName;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          <span className="truncate">{getDisplayValue(value)}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Search for a city..."
            onValueChange={setSearch}
            value={search}
          />
          <CommandList>
             {isLoading && (
                <div className="p-4 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </div>
            )}
            {!isLoading && suggestions.length === 0 && debouncedSearch.length > 2 && (
                <CommandEmpty>No city found.</CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.description}
                  onSelect={() => handleSelect(suggestion.place_id, suggestion.description)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value && value.id === suggestion.place_id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {suggestion.description}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
