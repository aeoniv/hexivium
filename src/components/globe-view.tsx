
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import { getSunEclipticLongitude, getHexagramAndLineForLongitude } from '@/lib/rave-wheel-utils';
import { raveWheelHexagramIds, hexagrams as allHexagrams, trigrams as allTrigrams } from '@/lib/i-ching-data';
import { ninePalacesData } from '@/lib/nine-palaces-data';
import type { Hexagram, Trigram } from '@/lib/types';

interface GlobePoint {
    lat: number;
    lng: number;
    size: number;
    color: string;
    label?: string;
}

interface GlobeViewProps {
    pointsData: GlobePoint[];
    showLuopan?: boolean;
}

const hexagramMap = new Map<number, Hexagram>(allHexagrams.map(h => [h.id, h]));
const earlyHeavenTrigrams: Trigram[] = [allTrigrams.find(t => t.name === 'Heaven')!,allTrigrams.find(t => t.name === 'Wind')!,allTrigrams.find(t => t.name === 'Water')!,allTrigrams.find(t => t.name === 'Mountain')!,allTrigrams.find(t => t.name === 'Earth')!,allTrigrams.find(t => t.name === 'Thunder')!,allTrigrams.find(t => t.name === 'Fire')!,allTrigrams.find(t => t.name === 'Lake')!].filter(Boolean);
const laterHeavenTrigrams: Trigram[] = [allTrigrams.find(t => t.name === 'Fire')!,allTrigrams.find(t => t.name === 'Earth')!,allTrigrams.find(t => t.name === 'Lake')!,allTrigrams.find(t => t.name === 'Heaven')!,allTrigrams.find(t => t.name === 'Water')!,allTrigrams.find(t => t.name === 'Mountain')!,allTrigrams.find(t => t.name === 'Thunder')!,allTrigrams.find(t => t.name === 'Wind')!].filter(Boolean);
const fundamentalHexagrams = [hexagramMap.get(1), hexagramMap.get(63), hexagramMap.get(2), hexagramMap.get(64)].filter(Boolean) as Hexagram[];
const raveWheelHexagrams = raveWheelHexagramIds.map(id => hexagramMap.get(id)).filter(Boolean) as Hexagram[];

const createTextSprite = (text: string, color = 'white', fontSize = 16, fontWeight = 'normal') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite();

    const font = `${fontWeight} ${fontSize}px Arial`;
    context.font = font;
    const metrics = context.measureText(text);
    const textWidth = metrics.width;
    canvas.width = textWidth + 8;
    canvas.height = fontSize + 8;

    context.font = font;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 10, canvas.height / 10, 1);
    return sprite;
};

export function GlobeView({ pointsData, showLuopan = false }: GlobeViewProps) {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (hasMounted && globeEl.current) {
            const globe = globeEl.current;
            globe.controls().autoRotate = true;
            globe.controls().autoRotateSpeed = 0.3;

            const userPoint = pointsData.find(p => p.label === 'Your Location');
            if (userPoint) {
                globe.pointOfView({ lat: userPoint.lat, lng: userPoint.lng, altitude: 2.5 }, 2000);
            } else {
                globe.pointOfView({ altitude: 2.5 }, 2000);
            }
            
            if (showLuopan) {
                const luopanGroup = new THREE.Group();
                const scene = globe.scene();
                scene.add(luopanGroup);

                const rings = [
                    { items: raveWheelHexagrams, radius: 45, startAngle: 3, type: 'hexagram' },
                    { items: earlyHeavenTrigrams, radius: 42, startAngle: 22.5, type: 'trigram' },
                    { items: laterHeavenTrigrams, radius: 38, startAngle: 22.5, type: 'trigram' },
                    { items: fundamentalHexagrams, radius: 35, startAngle: 0, type: 'hexagram' },
                ];

                const getItemText = (item: Hexagram | Trigram): string => {
                    return (item as any).hexagramSymbol ?? (item as any).chineseName ?? (item as any).number ?? '';
                };

                rings.forEach(ring => {
                    const angleStep = 360 / ring.items.length;
                    ring.items.forEach((item, index) => {
                        const angle = (ring.startAngle || 0) + (index * angleStep);
                        const rad = angle * Math.PI / 180;
                        const x = ring.radius * Math.cos(rad);
                        const y = ring.radius * Math.sin(rad);
                        
                        const text = getItemText(item as any);
                        const sprite = createTextSprite(text, 'rgba(255, 255, 255, 0.8)', 24);
                        sprite.position.set(x, y, 0);
                        
                        sprite.material.rotation = rad + Math.PI / 2;
                        
                        luopanGroup.add(sprite);
                    });
                });

                                const palaceOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];
                                const palaces = palaceOrder
                                    .map(num => ninePalacesData.find(p => p.star === num))
                                    .filter(Boolean) as NonNullable<typeof ninePalacesData[number]>[];
                const palaceRadius = 30;
                const palaceAngleStep = 360 / palaces.length;
                const palaceRotationOffset = -90 - palaceAngleStep / 2;
                
                palaces.forEach((palace, index) => {
                    const angle = palaceRotationOffset + (index * palaceAngleStep);
                    const rad = angle * Math.PI / 180;
                    const x = palaceRadius * Math.cos(rad);
                    const y = palaceRadius * Math.sin(rad);
                    const sprite = createTextSprite(palace.star.toString(), 'rgba(255, 255, 255, 0.9)', 32, 'bold');
                    sprite.position.set(x, y, 0);
                    luopanGroup.add(sprite);
                });

                globe.scene().add(luopanGroup);

                 // Position the Luopan in front of the camera
                const animateLuopan = () => {
                    if (globeEl.current) {
                        const camera = globeEl.current.camera();
                        const distance = 100; // Distance from camera
                        const vector = new THREE.Vector3(0, 0, -distance);
                        vector.applyQuaternion(camera.quaternion);
                        luopanGroup.position.copy(camera.position).add(vector);
                        luopanGroup.quaternion.copy(camera.quaternion);
                    }
                    requestAnimationFrame(animateLuopan);
                };
                animateLuopan();
            }
        }
    }, [hasMounted, pointsData, showLuopan]);
    
    if (!hasMounted) {
        return null;
    }

    return (
        <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            pointsData={pointsData}
            pointAltitude="size"
            pointColor="color"
            pointLabel="label"
            pointRadius={0.4}
            pointResolution={12}
        />
    );
}
