

"use client";

import { HexagramIcon } from "@/components/hexagram-icon";
import { TrigramIcon } from "@/components/trigram-icon";

type Line = "yin" | "yang" | null;

interface HexagramDisplayProps {
  lines: Line[];
  onLineClick?: (index: number) => void;
  isTrigram?: boolean;
}

const HexagramDisplay = ({ lines, onLineClick, isTrigram = false }: HexagramDisplayProps) => {
  const lineCount = isTrigram ? 3 : 6;
  
  // The binary string should be built from line 1 (bottom) to line 6 (top)
  const reversedLines = [...lines].reverse();
  const binaryString = reversedLines.slice(0, lineCount).map(line => {
    if (line === 'yang') return '1';
    if (line === 'yin') return '0';
    return '0'; // Default for null/placeholder
  }).join('');
  
  const handleHexClick = (isTrigram: boolean, onLineClick: ((index: number) => void) | undefined) => {
      if (!onLineClick) return;

      if(isTrigram) {
        onLineClick(-1) // Special value for trigram click
      }
  }

  if (isTrigram) {
    return (
        <div onClick={() => handleHexClick(true, onLineClick)} className={onLineClick ? 'cursor-pointer' : ''}>
             <TrigramIcon binary={binaryString} />
        </div>
    );
  }

  return (
    <div className="relative group">
        <HexagramIcon 
            binary={binaryString} 
            lineClassName="h-3"
        />
        {onLineClick && (
            <div className="absolute inset-0 flex flex-col-reverse">
                {[...Array(6)].map((_, i) => (
                    // The visual lines are top to bottom, but our line logic is bottom to top (1 to 6)
                    // So we reverse the click handlers. Clicking the bottom visual element triggers line 1 (index 0).
                    <div key={i} className="h-1/6 w-full cursor-pointer" onClick={() => onLineClick(i)} />
                ))}
            </div>
        )}
    </div>
  );
};

export default HexagramDisplay;
