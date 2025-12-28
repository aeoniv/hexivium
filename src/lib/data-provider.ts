import colorTonesBases from '../../data_in/color_tones_bases.json';
import hdAuthorities from '../../data_in/hd_authorities.json';
import hdCenters from '../../data_in/hd_centers.json';
import hdProfiles from '../../data_in/hd_profiles.json';
import hdProperties from '../../data_in/hd_properties.json';
import hdTypes from '../../data_in/hd_types.json';
import hdVariables from '../../data_in/hd_variables.json';
import hexagramsData from '../../data_in/hexagrams.json';
import incarnationCrosses from '../../data_in/incarnation_cross.json';
import linesData from '../../data_in/lines.json';
import theBookOfLines from '../../data_in/the_book_of_lines.json';
import { hexagrams, trigrams } from './i-ching-data';

// Export all raw data for direct use where needed
export {
  colorTonesBases,
  hdAuthorities,
  hdCenters,
  hdProfiles,
  hdProperties,
  hdTypes,
  hdVariables,
  hexagramsData,
  incarnationCrosses,
  linesData,
  theBookOfLines,
  hexagrams,
  trigrams,
};

// Create convenient maps for quick lookups
export const hexagramMap = new Map(hexagrams.map(h => [h.id, h]));
export const binaryHexagramMap = new Map(hexagrams.map(h => [h.binary, h]));
export const trigramMap = new Map(trigrams.map(t => [t.name, t]));
