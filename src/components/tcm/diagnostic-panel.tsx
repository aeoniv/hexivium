
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Organ } from "@/lib/organs";

interface DiagnosticPanelProps {
  organs: Organ[];
  onPolarityChange: (id: string, polarity: '+' | '-') => void;
}

const pulseSigns: {yang: string, yin: string}[] = [
  { yang: "Strong", yin: "Weak" },
  { yang: "Surface", yin: "Deep" },
  { yang: "Swollen", yin: "Flat" },
  { yang: "Quick", yin: "Slow" },
  { yang: "Energetic", yin: "Flabby" },
  { yang: "Full", yin: "Empty" },
];

const DiagnosticPanel = ({ organs, onPolarityChange }: DiagnosticPanelProps) => {
  const celestialOrgans = organs.filter((o) => o.group === "celestial");
  const terrestrialOrgans = organs.filter((o) => o.group === "terrestrial");

  const renderOrganTable = (organList: Organ[], groupName: string) => (
    <div>
      <h3 className="font-semibold mb-2 text-primary">{groupName}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Organ</TableHead>
            <TableHead className="text-right">Pulse Diagnosis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organList.map((organ, index) => (
            <TableRow key={organ.id}>
              <TableCell className="font-medium">{organ.fullName}</TableCell>
              <TableCell className="text-right">
                <ToggleGroup 
                  type="single" 
                  size="sm"
                  value={organ.polarity} 
                  onValueChange={(value: '+' | '-') => {
                    if (value) onPolarityChange(organ.id, value)
                  }}
                  aria-label={`Polarity for ${organ.fullName}`}
                >
                  <ToggleGroupItem value="+" aria-label={pulseSigns[index % 6].yang}>
                    {pulseSigns[index % 6].yang}
                  </ToggleGroupItem>
                  <ToggleGroupItem value="-" aria-label={pulseSigns[index % 6].yin}>
                    {pulseSigns[index % 6].yin}
                  </ToggleGroupItem>
                </ToggleGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organ Pulse Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderOrganTable(celestialOrgans, "Celestial Organs")}
        {renderOrganTable(terrestrialOrgans, "Terrestrial Organs")}
      </CardContent>
    </Card>
  );
};

export default DiagnosticPanel;
