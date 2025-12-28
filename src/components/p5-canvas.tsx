
'use client';

import React, { useRef, useEffect } from 'react';
import type p5 from 'p5';
import { useAgentStore } from '@/hooks/use-agent-store';
import { createHexGrid, cubeToPixel, pixelToCube, Cube, cubeAdd, cubeDirections } from '@/lib/grid-utils';
import { environments, type Environment } from '@/lib/environments';
import { objects, type ObjectData } from '@/lib/objects';
import { trainingTools, type TrainingToolData } from '@/lib/training-tools';
import { furniture, type FurnitureData } from '@/lib/furniture';
import { structures, type StructureData } from '@/lib/structures';
import { kungFuWeapons, type KungFuWeaponData } from '@/lib/kung-fu-weapons';
import { renderToString } from 'react-dom/server';

let p5Instance: p5 | null = null;

const sketch = (p: p5) => {
  p5Instance = p;
  const hexSize = 40;
  const gridRadius = 5;
  
  let hexGrid: Cube[] = [];
  
  const iconGraphics: { [key: string]: p5.Image } = {};

  const getThemeColor = (variable: string) => {
    if (typeof window === 'undefined') return p.color(0);
    const colorValue = getComputedStyle(document.body).getPropertyValue(variable).trim();
    if (colorValue.startsWith('hsl')) {
      return p.color(colorValue);
    }
    const [h, s, l] = colorValue.split(' ').map(val => parseFloat(val.replace('%', '')));
    return p.color(`hsl(${h}, ${s}%, ${l}%)`);
  }

  const drawHex = (center: p5.Vector, strokeColor: p5.Color, fillColor?: p5.Color, hexSymbol?: string, strokeWeight = 1, indexText?: string, symbolColor?: p5.Color) => {
    if(fillColor) {
        p.fill(fillColor);
    } else {
        p.noFill();
    }
    p.stroke(strokeColor);
    p.strokeWeight(strokeWeight);
    
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      const angle = p.TWO_PI / 6 * i;
      const sx = center.x + hexSize * p.cos(angle);
      const sy = center.y + hexSize * p.sin(angle);
      p.vertex(sx, sy);
    }
    p.endShape(p.CLOSE);

    if (hexSymbol) {
      p.fill(symbolColor || getThemeColor('--primary-foreground'));
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.textStyle(p.BOLD);
      if (indexText !== undefined) {
         p.text(hexSymbol, center.x, center.y - 8);
         p.textSize(10);
         p.textStyle(p.NORMAL);
         p.fill(getThemeColor('--muted-foreground'));
         p.text(`(${indexText})`, center.x, center.y + 8);

      } else {
          p.text(hexSymbol, center.x, center.y);
      }
    } else if (indexText !== undefined) {
      p.fill(getThemeColor('--muted-foreground'));
      p.noStroke();
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(12);
      p.textStyle(p.NORMAL);
      p.text(indexText, center.x, center.y);
    }
  };

  const drawIcon = (center: p5.Vector, iconImage: p5.Image, size: number) => {
    if (iconImage) {
      p.imageMode(p.CENTER);
      p.image(iconImage, center.x, center.y, size, size);
    }
  };

  const createIconGraphic = (iconComponent: any): p5.Image | null => {
      if (!iconComponent) return null;
      const IconElement = React.createElement(iconComponent, {
        color: 'currentColor',
        size: 48,
        strokeWidth: 2,
      });

      try {
        const svgString = renderToString(IconElement);
        const color = getThemeColor('--primary').toString('#rrggbb');
        const coloredSvgString = svgString.replace(/stroke="currentColor"/g, `stroke="${color}"`);
        const fullSvg = `data:image/svg+xml;base64,${btoa(coloredSvgString)}`;
        return p.loadImage(fullSvg);
      } catch (e) {
        console.error("Could not render icon to string", e);
        return null;
      }
  };
  
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSL);
    hexGrid = createHexGrid(gridRadius);

    const allItems = [...environments, ...objects, ...trainingTools, ...furniture, ...structures, ...kungFuWeapons];
    
    allItems.forEach(item => {
        const iconComponent = item.icon as any;
        if(iconComponent) {
            const graphic = createIconGraphic(iconComponent);
            if (graphic) {
              iconGraphics[item.name] = graphic;
            }
        }
    });
  };

  p.draw = () => {
    const { actorHex, highlightedHexes, isCasting, currentHexagram, trigramHexes, placedEnvironments, placedObjects, placedFurniture, placedStructures, spiralMapData } = useAgentStore.getState();

    p.background(getThemeColor('--background'));
    p.translate(p.width / 2, p.height / 2);
    
    const gridColor = getThemeColor('--border');
    const changingLineHighlightColor = getThemeColor('--primary'); 
    const trigramColor = getThemeColor('--secondary');
    trigramColor.setAlpha(0.5);
    const aspectColor = getThemeColor('--accent');
    const intermediateColor = getThemeColor('--muted');
    
    const isHighlighting = highlightedHexes.length > 0;

    hexGrid.forEach(hex => {
        const center = cubeToPixel(hex, hexSize, p);
        const isHighlighted = highlightedHexes.some(h => h.q === hex.q && h.r === hex.r);
        const trigramOnHex = trigramHexes.find(th => th.hex.q === hex.q && th.hex.r === hex.r);
        const placedKey = `${hex.q},${hex.r}`;
        const placedEnv = placedEnvironments[placedKey];
        const placedObj = placedObjects[placedKey];
        const placedFurn = placedFurniture[placedKey];
        const placedStruct = placedStructures[placedKey];
        const spiralData = hex.index !== undefined ? spiralMapData[hex.index] : undefined;

        let currentStrokeColor = gridColor;
        let currentFillColor;
        let hexSymbol = spiralData?.gate ? String(spiralData.gate) : undefined;
        let currentStrokeWeight = 1;
        let symbolColor;
        
        if (spiralData?.source === 'aspect') {
          symbolColor = aspectColor;
        } else if (spiralData?.source === 'intermediate') {
          symbolColor = intermediateColor;
        }

        if (trigramOnHex && !hexSymbol) {
          currentStrokeColor = getThemeColor('--secondary');
          currentStrokeColor.setAlpha(0.8);
          currentFillColor = trigramColor;
          hexSymbol = trigramOnHex.trigram.chineseName;
        }

        if(isHighlighting) {
            if(isHighlighted) {
                currentStrokeColor = changingLineHighlightColor;
                const fillHighlight = getThemeColor('--primary');
                fillHighlight.setAlpha(0.2);
                currentFillColor = fillHighlight; 
                currentStrokeWeight = 3;
            }
        }
        
        drawHex(center, currentStrokeColor, currentFillColor, hexSymbol, currentStrokeWeight, String(hex.index), symbolColor);

        if (placedEnv && iconGraphics[placedEnv.name]) {
          drawIcon(center, iconGraphics[placedEnv.name], hexSize);
        }
        if (placedObj && iconGraphics[placedObj.name]) {
          drawIcon(center, iconGraphics[placedObj.name], hexSize * 0.6);
        }
        if(placedFurn && iconGraphics[placedFurn.name]) {
            drawIcon(center, iconGraphics[placedFurn.name], hexSize * 0.4)
        }
        if(placedStruct && iconGraphics[placedStruct.name]) {
            drawIcon(center, iconGraphics[placedStruct.name], hexSize * 0.5)
        }
    });

    const actorCube = new Cube(actorHex.q, actorHex.r, -actorHex.q - actorHex.r);
    const actorColor = getThemeColor('--primary');
    const actorCenter = cubeToPixel(actorCube, hexSize, p);
    const actorHexSymbol = currentHexagram ? currentHexagram.symbol : undefined;
    drawHex(actorCenter, actorColor, actorColor, actorHexSymbol, 3);
  };

  p.mousePressed = (event: MouseEvent) => {
    const { setSelectedHex } = useAgentStore.getState();
    
    // Check if the click is on the canvas
    if (event.target instanceof HTMLCanvasElement) {
        const bounds = event.target.getBoundingClientRect();
        const x = p.mouseX - p.width / 2;
        const y = p.mouseY - p.height / 2;
        
        const clickedCube = pixelToCube(x, y, hexSize);
        
        // Find the closest hex in our grid to the click location
        let closestHex: Cube | null = null;
        let minDistance = Infinity;

        hexGrid.forEach(hex => {
            const hexCenter = cubeToPixel(hex, hexSize, p);
            const distance = p.dist(x, y, hexCenter.x, hexCenter.y);
            if (distance < minDistance) {
                minDistance = distance;
                closestHex = hex;
            }
        });

    if (closestHex && minDistance < hexSize * 0.866) { // 0.866 is approx sqrt(3)/2
      const { q, r } = closestHex as Cube;
      setSelectedHex({ q, r });
        } else {
            setSelectedHex(null); // Click was outside any hex
        }
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export const P5Canvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('p5').then((p5Module) => {
      const P5 = p5Module.default;
      if (canvasRef.current && !p5Instance) {
        new P5(sketch, canvasRef.current);
      }
    });

    const unsubscribe = useAgentStore.subscribe((state) => {
      if (p5Instance) {
        p5Instance.redraw();
      }
    });

    return () => {
      p5Instance?.remove();
      p5Instance = null;
      unsubscribe();
    };
  }, []);

  return <div ref={canvasRef} className="w-full h-full" />;
};
