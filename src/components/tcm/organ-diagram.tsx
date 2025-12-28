
"use client";

import { Organ } from "@/lib/organs";
import { cn } from "@/lib/utils";

interface OrganDiagramProps {
  organs: Organ[];
  onOrganClick: (id: string) => void;
  lastClickedId: string | null;
}

const OrganDiagram = ({ organs, onOrganClick, lastClickedId }: OrganDiagramProps) => {
  const organMap = new Map(organs.map((o) => [o.id, o]));

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Connections */}
        <g stroke="hsl(var(--border))" strokeWidth="1">
          {organs.map((organ) =>
            organ.connections.map((connId) => {
              const connectedOrgan = organMap.get(connId);
              if (connectedOrgan) {
                return (
                  <line
                    key={`${organ.id}-${connId}`}
                    x1={organ.svgPosition.x}
                    y1={organ.svgPosition.y}
                    x2={connectedOrgan.svgPosition.x}
                    y2={connectedOrgan.svgPosition.y}
                  />
                );
              }
              return null;
            })
          )}
        </g>
        {/* Organs */}
        {organs.map((organ) => {
          const isYin = organ.polarity === "-";
          const isLastClicked = organ.id === lastClickedId;
          return (
            <g
              key={organ.id}
              transform={`translate(${organ.svgPosition.x}, ${organ.svgPosition.y})`}
              onClick={() => onOrganClick(organ.id)}
              className="cursor-pointer group"
            >
              <circle
                cx="0"
                cy="0"
                r="20"
                className={cn(
                    "transition-all",
                    isYin ? "fill-primary/20 stroke-primary" : "fill-destructive/20 stroke-destructive",
                    "stroke-2 group-hover:stroke-width-4",
                    isLastClicked ? "animate-pulse" : ""
                )}
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                className={cn(
                    "font-bold text-sm",
                    isYin ? "fill-primary-foreground" : "fill-destructive-foreground"
                )}
                style={{
                  fill: isYin ? 'hsl(var(--primary-foreground))' : 'hsl(var(--destructive-foreground))'
                }}
              >
                {organ.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default OrganDiagram;
