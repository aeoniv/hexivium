
'use client';

import React, { useRef, useEffect } from 'react';
import type p5 from 'p5';

let p5Instance: p5 | null = null;

const sketch = (p: p5) => {
  p5Instance = p;

  class Star {
    x: number;
    y: number;
    z: number;
    pz: number;
  
    constructor() {
      this.x = p.random(-p.width, p.width);
      this.y = p.random(-p.height, p.height);
      this.z = p.random(p.width);
      this.pz = this.z;
    }
  
    update(speed: number) {
      this.z = this.z - speed;
      if (this.z < 1) {
        this.z = p.width;
        this.x = p.random(-p.width, p.width);
        this.y = p.random(-p.height, p.height);
        this.pz = this.z;
      }
    }
  
    show() {
      const trailColor = getThemeColor('--trail');
      p.fill(trailColor);
      p.noStroke();
  
      p.drawingContext.shadowBlur = 8;
      p.drawingContext.shadowColor = trailColor.toString();
  
      const sx = p.map(this.x / this.z, 0, 1, 0, p.width);
      const sy = p.map(this.y / this.z, 0, 1, 0, p.height);
  
      const r = p.map(this.z, 0, p.width, 8, 0);
      p.ellipse(sx, sy, r, r);
  
      const px = p.map(this.x / this.pz, 0, 1, 0, p.width);
      const py = p.map(this.y / this.pz, 0, 1, 0, p.height);
  
      this.pz = this.z;
  
      p.stroke(trailColor);
      p.line(px, py, sx, py);
  
      p.drawingContext.shadowBlur = 0;
    }
  }

  let stars: Star[] = [];

  const getThemeColor = (variable: string) => {
    if (typeof window === 'undefined') return p.color(0);
    const colorValue = getComputedStyle(document.body).getPropertyValue(variable).trim();
    if (colorValue.startsWith('hsl')) {
      return p.color(colorValue);
    }
    const [h, s, l] = colorValue.split(' ').map(val => parseFloat(val.replace('%', '')));
    return p.color(`hsl(${h}, ${s}%, ${l}%)`);
  };

  const drawStarShape = (points: number, radius: number, step: number, rotation = 0) => {
      const angle = p.TWO_PI / points;
      p.beginShape();
      for (let a = 0; a < p.TWO_PI; a += angle) {
          const sx = p.cos(a + rotation) * radius;
          const sy = p.sin(a + rotation) * radius;
          p.vertex(sx, sy);
          const nextIndex = (Math.round(a / angle) + step) % points;
          const nextAngle = nextIndex * angle;
          const sx2 = p.cos(nextAngle + rotation) * radius;
          const sy2 = p.sin(nextAngle + rotation) * radius;
          p.vertex(sx2, sy2);
      }
      p.endShape(p.CLOSE);
  }

  const drawOctagon = (radius: number, rotation = 0) => {
      const angle = p.TWO_PI / 8;
      p.beginShape();
      for (let a = 0; a < p.TWO_PI; a += angle) {
          const sx = p.cos(a + rotation) * radius;
          const sy = p.sin(a + rotation) * radius;
          p.vertex(sx, sy);
      }
      p.endShape(p.CLOSE);
  }
  
  let innerAngle = 0;
  let outerAngle = 0;
  const rotationSpeed = 0.002;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSL);

    for (let i = 0; i < 800; i++) {
        stars.push(new Star());
    }
  };

  p.draw = () => {
    p.background(getThemeColor('--background'));
    p.translate(p.width / 2, p.height / 2);

    let speed = 5;
    for (let i = 0; i < stars.length; i++) {
        stars[i].update(speed);
        stars[i].show();
    }
    
    innerAngle += rotationSpeed;
    outerAngle -= rotationSpeed;

    const outerRadius = p.min(p.width, p.height) * 0.3;
    const trailColor = getThemeColor('--trail');
    
    p.noFill();

    // Draw the main star octahedron (trail color)
    p.strokeWeight(1);
    p.drawingContext.shadowBlur = 20;
    p.drawingContext.shadowColor = trailColor.toString();
    p.stroke(trailColor);
    drawStarShape(8, outerRadius, 3, outerAngle);
    p.circle(0, 0, outerRadius * 2);

    
    // Draw the secondary star outline (trail color)
    const innerRadius = outerRadius * 0.378;
    p.drawingContext.shadowColor = trailColor.toString();
    p.stroke(trailColor);
    drawStarShape(8, innerRadius, 3, innerAngle);
    p.circle(0, 0, innerRadius * 2);


    // Draw the pentagram
    p.strokeJoin(p.ROUND);
    p.strokeWeight(4);
    p.drawingContext.shadowColor = getThemeColor('--primary').toString();
    p.stroke(getThemeColor('--primary'));
    drawStarShape(5, outerRadius, 2, -p.PI / 2);

    // Draw circles at pentagram vertices
    const pentagramPoints = 5;
    const pentagramAngle = p.TWO_PI / pentagramPoints;
    const pentagramRotation = -p.PI / 2;
    p.noStroke();
    p.fill(getThemeColor('--primary'));
    for (let i = 0; i < pentagramPoints; i++) {
      const a = i * pentagramAngle + pentagramRotation;
      const x = p.cos(a) * outerRadius;
      const y = p.sin(a) * outerRadius;
      p.circle(x, y, 20);
    }


    // Draw the octagon that connects the points
    p.noFill();
    p.strokeWeight(1);
    p.drawingContext.shadowColor = trailColor.toString();
    p.stroke(trailColor);
    drawOctagon(outerRadius, outerAngle);
    
    p.drawingContext.shadowBlur = 0;
    
    // Central 9 circles - also wired
    p.stroke(getThemeColor('--border'));
    p.noFill();
    p.circle(0, 0, 9);
    const centralRadius = outerRadius * 0.2;
    for (let i = 0; i < 8; i++) {
      const angle = p.TWO_PI / 8 * i;
      const x = p.cos(angle) * centralRadius;
      const y = p.sin(angle) * centralRadius;
      p.circle(x, y, 9);
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

export const HomeCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('p5').then((p5Module) => {
      const P5 = p5Module.default;
      if (canvasRef.current && !p5Instance) {
        new P5(sketch, canvasRef.current);
      }
    });

    return () => {
      p5Instance?.remove();
      p5Instance = null;
    };
  }, []);

  return <div ref={canvasRef} className="w-full h-full" />;
};
