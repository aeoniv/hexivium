
export type Organ = {
  id: string;
  fullName: string;
  polarity: "+" | "-";
  svgPosition: { x: number; y: number };
  connections: string[];
  group: "celestial" | "terrestrial";
};

export const initialOrgans: Organ[] = [
  // Celestial Group
  { id: "SI", fullName: "Small Intestine", polarity: "+", svgPosition: { x: 50, y: 125 }, connections: ["HT"], group: "celestial" },
  { id: "HT", fullName: "Heart", polarity: "-", svgPosition: { x: 125, y: 160 }, connections: ["SI", "PC"], group: "celestial" },
  { id: "PC", fullName: "Pericardium", polarity: "-", svgPosition: { x: 200, y: 125 }, connections: ["TB", "HT", "SP"], group: "celestial" },
  { id: "TB", fullName: "Triple Burner", polarity: "+", svgPosition: { x: 200, y: 50 }, connections: ["PC"], group: "celestial" },
  { id: "SP", fullName: "Spleen", polarity: "-", svgPosition: { x: 275, y: 160 }, connections: ["ST", "PC"], group: "celestial" },
  { id: "ST", fullName: "Stomach", polarity: "+", svgPosition: { x: 350, y: 125 }, connections: ["SP"], group: "celestial" },
  
  // Terrestrial Group
  { id: "GB", fullName: "Gallbladder", polarity: "+", svgPosition: { x: 50, y: 275 }, connections: ["LV"], group: "terrestrial" },
  { id: "LV", fullName: "Liver", polarity: "-", svgPosition: { x: 125, y: 240 }, connections: ["GB", "KD"], group: "terrestrial" },
  { id: "KD", fullName: "Kidney", polarity: "-", svgPosition: { x: 200, y: 275 }, connections: ["BL", "LV", "LU"], group: "terrestrial" },
  { id: "BL", fullName: "Bladder", polarity: "+", svgPosition: { x: 200, y: 350 }, connections: ["KD"], group: "terrestrial" },
  { id: "LU", fullName: "Lung", polarity: "-", svgPosition: { x: 275, y: 240 }, connections: ["LI", "KD"], group: "terrestrial" },
  { id: "LI", fullName: "Large Intestine", polarity: "+", svgPosition: { x: 350, y: 275 }, connections: ["LU"], group: "terrestrial" },
];
