

"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { hexagrams, categoryColors, HexagramNode, HexagramCategory } from "@/lib/hexagram-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { centers, channels } from "@/lib/human-design-data";

interface SelectedNodeInfo {
  id: number;
  category: string;
  position: THREE.Vector2;
  definition: string;
  character: string;
  description: string;
  binary: string;
}

type ViewMode = 'torus' | 'bodygraph';

const createTextNode = (text: string, size = 0.5, color = '#FFFFFF') => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return new THREE.Sprite();

    const fontSize = 64;
    context.font = `bold ${fontSize}px Arial`;
    const textMetrics = context.measureText(text);
    canvas.width = textMetrics.width;
    canvas.height = fontSize;

    context.font = `bold ${fontSize}px Arial`;
    context.fillStyle = color;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);

    const aspect = canvas.width / canvas.height;
    sprite.scale.set(size * aspect, size, 1);

    return sprite;
};


export function HexagramGlobe({ activeCameraIndex = 0, isWireframeVisible = true, pathType = 1, viewMode = 'torus' }: { activeCameraIndex?: number; isWireframeVisible?: boolean; pathType?: number; viewMode?: ViewMode }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<SelectedNodeInfo | null>(null);
  
  const pathMeshes = useRef<THREE.Group>(new THREE.Group());
  const tunnelMeshes = useRef<THREE.Group>(new THREE.Group());
  const animatedSphereRef = useRef<THREE.Mesh | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const bodyGraphGroupRef = useRef<THREE.Group>(new THREE.Group());
  const torusGroupRef = useRef<THREE.Group>(new THREE.Group());

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    const clock = new THREE.Clock();

    // Cameras
    const camera1 = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera1.position.z = 25; 
    
    const camera2 = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera2.position.set(0, 0, 0); 
    camera2.rotation.y = Math.PI;

    const cameras = [camera1, camera2];
    let activeCamera = cameras[activeCameraIndex];


    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);
    
    // Post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, activeCamera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = 0;
    bloomPass.strength = 1.2; // glow intensity
    bloomPass.radius = 0.5;
    composer.addPass(bloomPass);

    // Controls
    const controls = new OrbitControls(camera1, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.enablePan = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);
    const pointLight2 = new THREE.PointLight(0xffffff, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Groups for toggling views
    scene.add(bodyGraphGroupRef.current);
    scene.add(torusGroupRef.current);

    // Torus
    const torusGeometry = new THREE.TorusGeometry(4, 2, 8, 36);
    const torusMaterial = new THREE.MeshStandardMaterial({
      color: "#4682b4",
      wireframe: true,
      transparent: true,
      opacity: 0.2,
      metalness: 0.1,
      roughness: 0.7
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torusGroupRef.current.add(torus);

    // Nodes
    nodesRef.current = [];
    const nodeGeometry = new THREE.SphereGeometry(0.2, 16, 16);

    const placeNode = (hexagram: HexagramNode, position: THREE.Vector3, parentGroup: THREE.Group) => {
        const color = "#0077be"; // Single blue color
        const nodeMaterial = new THREE.MeshStandardMaterial({ color });
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.copy(position);
        node.userData = { 
          id: hexagram.id, 
          category: hexagram.category,
          definition: hexagram.definition,
          character: hexagram.character,
          description: hexagram.description,
          binary: hexagram.binary,
        };

        const textNode = createTextNode(hexagram.id.toString().padStart(2, '0'), 0.25);
        textNode.position.set(0, 0, 0.21);
        node.add(textNode);
        
        parentGroup.add(node);
        nodesRef.current.push(node);
        return node;
    };

    const pathIds = [11, 54, 63, 36, 25, 21, 27, 8, 16, 35, 12, 53, 59, 64, 48, 32];

    const placeHexagramSequences = () => {
        const sequences = {
            'Hexagram 01': { ids: [1], position: new THREE.Vector3(0, 0, 2) },
            'Hexagram 02': { ids: [2], position: new THREE.Vector3(0, 0, -2) },
            'Hexagram 63': { ids: [63], position: new THREE.Vector3(-2, 0, 0) },
            'Hexagram 64': { ids: [64], position: new THREE.Vector3(2, 0, 0) },
            'Surface': { ids: [11,54,60,41,55,22,17,21,42,12,53,56,31,59,47,18,48,32], segments: 18, radius: 6 },
            'North Solar': { ids: [5,26,38,61,49,37,25,33,6,50,28,34], segments: 12, vAngleMultiplier: 1 },
            'South Solar': { ids: [36,3,27,20,35,45,39,62,4,40,46,19,], segments: 12, vAngleMultiplier: -1 },
            'North Earthly': { ids: [43,14,9,10,13,44], segments: 6, vAngleMultiplier: 2 },
            'South Earthly': { ids: [23,8,16,15,7,24], segments: 6, vAngleMultiplier: -2 },
            'North Heavenly': { ids: [58, 30, 57], segments: 3, vAngleMultiplier: 3 },
            'South Heavenly': { ids: [52, 29, 51], segments: 3, vAngleMultiplier: -3 },
        };

        const { radius: torusRadius, tube: tubeRadius, radialSegments: torusRadialSegments } = torus.geometry.parameters;
        const vAngleStep = Math.PI * 2 / torusRadialSegments;

    for (const category in sequences) {
      const seq = sequences[category as keyof typeof sequences];
            const hexagramIds = seq.ids;

      if ('position' in seq) {
                const hexagram = hexagrams.find(h => h.id === hexagramIds[0]);
                if (hexagram) {
          placeNode(hexagram, seq.position, torusGroupRef.current);
                }
      } else if ('segments' in seq) {
                hexagramIds.forEach((hexId, index) => {
                    const hexagram = hexagrams.find(h => h.id === hexId);
                    if (hexagram) {
                        let position: THREE.Vector3;
            if (category === 'Surface') {
              const s = seq as { ids: number[]; segments: number; radius: number };
              const angle = (index / s.segments) * Math.PI * 2;
              position = new THREE.Vector3(s.radius * Math.cos(angle), s.radius * Math.sin(angle), 0);
                        } else {
              const s = seq as { ids: number[]; segments: number; vAngleMultiplier: number };
              const uAngle = (index / s.segments) * Math.PI * 2;
              const vAngle = vAngleStep * s.vAngleMultiplier;
                            const x = (torusRadius + tubeRadius * Math.cos(vAngle)) * Math.cos(uAngle);
                            const y = (torusRadius + tubeRadius * Math.cos(vAngle)) * Math.sin(uAngle);
                            const z = tubeRadius * Math.sin(vAngle);
                            position = new THREE.Vector3(x, y, z);
                        }
                        placeNode(hexagram, position, torusGroupRef.current);
                    }
                });
            }
        }
    };

    placeHexagramSequences();

    // BodyGraph Layout
    const bodyGraphNodes = new Map<number, THREE.Mesh>();

    const centerShapeMaterial = new THREE.MeshBasicMaterial({
        color: 0xaaaaaa,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
    });
    
    const solidCenterMaterial = new THREE.MeshStandardMaterial({
        color: "#f0f0f0", 
        transparent: true,
        opacity: 0.1,
        metalness: 0.2,
        roughness: 0.8,
    });

    centers.forEach(center => {
        let geometry;
        const [cx, cy, cz] = center.position;

        switch (center.name) {
            case 'Head':
                geometry = new THREE.ConeGeometry(1.5, 1.5, 3);
                break;
            case 'Ajna':
                geometry = new THREE.OctahedronGeometry(1.5, 0);
                break;
            case 'Throat':
                geometry = new THREE.DodecahedronGeometry(1.5, 0);
                break;
            case 'Spleen':
            case 'Solar Plexus':
                geometry = new THREE.BoxGeometry(2, 2, 2);
                 break;
            case 'G-Center':
            case 'Heart/Ego':
            case 'Sacral':
            case 'Root':
                 geometry = new THREE.IcosahedronGeometry(1.5, 0);
                 break;
            default:
                geometry = new THREE.BoxGeometry(2, 2, 2);
                break;
        }

        if (geometry) {
             const shapeMesh = new THREE.Mesh(geometry, centerShapeMaterial);
             shapeMesh.position.set(cx, cy, cz);
             bodyGraphGroupRef.current.add(shapeMesh);

             const solidMesh = new THREE.Mesh(geometry.clone(), solidCenterMaterial);
             solidMesh.position.copy(shapeMesh.position);
             bodyGraphGroupRef.current.add(solidMesh);

             const positionAttribute = geometry.attributes.position;
             const uniqueVertices: THREE.Vector3[] = [];
             const vertexSet = new Set<string>();

             for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
                const vertexString = `${vertex.x.toFixed(4)},${vertex.y.toFixed(4)},${vertex.z.toFixed(4)}`;
                if (!vertexSet.has(vertexString)) {
                    vertexSet.add(vertexString);
                    uniqueVertices.push(vertex);
                }
             }

            center.gates.forEach((gateId, index) => {
                const hexagram = hexagrams.find(h => h.id === gateId);
                if (hexagram) {
                    const vertexIndex = index % uniqueVertices.length;
                    const vertex = uniqueVertices[vertexIndex].clone();
                    const nodePosition = vertex.add(shapeMesh.position);

                    const node = placeNode(hexagram, nodePosition, bodyGraphGroupRef.current);
                    bodyGraphNodes.set(gateId, node);
                }
            });
        }
    });

    channels.forEach(channel => {
        const node1 = bodyGraphNodes.get(channel.gates[0]);
        const node2 = bodyGraphNodes.get(channel.gates[1]);
        if (node1 && node2) {
            const points = [node1.position, node2.position];
            const tubeGeometry = new THREE.TubeGeometry(new THREE.LineCurve3(points[0], points[1]), 2, 0.05, 8, false);
            const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
            const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
            bodyGraphGroupRef.current.add(tube);
        }
    });

    
    const pathPoints = pathIds.map(id => {
      const node = nodesRef.current.find(n => n.userData.id === id);
      return node ? node.position : new THREE.Vector3();
    }).filter(p => p.length() > 0);
    
    if (pathPoints.length > 1) {
        const curvePath = new THREE.CurvePath<THREE.Vector3>();
        for (let i = 0; i < pathPoints.length; i++) {
            const startPoint = pathPoints[i];
            const endPoint = pathPoints[(i + 1) % pathPoints.length];
            curvePath.add(new THREE.LineCurve3(startPoint, endPoint));
        }

        // Create Path
        const pathMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        const pathGeometry = new THREE.TubeGeometry(curvePath, pathPoints.length * 10, 0.05, 8, false);
        const pathMesh = new THREE.Mesh(pathGeometry, pathMaterial);
        pathMeshes.current.add(pathMesh);
        
        // Create Tunnel
        const tunnelFaceMaterial = new THREE.MeshStandardMaterial({
          color: 0x222222,
          side: THREE.DoubleSide,
          metalness: 0.2,
          roughness: 0.8,
          transparent: false,
        });
        const tunnelWireframeMaterial = new THREE.MeshBasicMaterial({
          color: 0xff00ff,
          wireframe: true,
        });
        const tunnelGeometry = new THREE.TubeGeometry(curvePath, pathPoints.length * 10, 0.5, 6, false);
        const tunnelFaceMesh = new THREE.Mesh(tunnelGeometry, tunnelFaceMaterial);
        const tunnelWireframeMesh = new THREE.Mesh(tunnelGeometry, tunnelWireframeMaterial);
        tunnelMeshes.current.add(tunnelFaceMesh);
        tunnelMeshes.current.add(tunnelWireframeMesh);
    }
    
    torusGroupRef.current.add(pathMeshes.current);
    torusGroupRef.current.add(tunnelMeshes.current);


    // Animated Sphere
    const animatedSphereGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const animatedSphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000, emissive: 0xff0000, emissiveIntensity: 0.5 });
    const animatedSphere = new THREE.Mesh(animatedSphereGeometry, animatedSphereMaterial);
    animatedSphereRef.current = animatedSphere;
    scene.add(animatedSphere);
    animatedSphere.add(camera2);


    // Raycasting for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-Infinity, -Infinity);

    const onPointerMove = (event: PointerEvent) => {
      if (!currentMount) return;
      controls.autoRotate = false;
      const rect = currentMount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / currentMount.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / currentMount.clientHeight) * 2 + 1;
    };
    
    const onClick = (event: MouseEvent) => {
        if (!currentMount) return;
        controls.autoRotate = false;
        
        raycaster.setFromCamera(mouse, activeCamera);
        const intersects = raycaster.intersectObjects(nodesRef.current, true);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            const node = intersect.object;
            const screenPosition = new THREE.Vector3();
            node.getWorldPosition(screenPosition);
            screenPosition.project(activeCamera);

            const rect = renderer.domElement.getBoundingClientRect();
            const x = ((screenPosition.x + 1) / 2) * rect.width;
            const y = ((-screenPosition.y + 1) / 2) * rect.height;

            setSelectedNode({
                id: node.userData.id,
                category: node.userData.category,
                position: new THREE.Vector2(x, y),
                definition: node.userData.definition,
                character: node.userData.character,
                description: node.userData.description,
                binary: node.userData.binary,
            });
        } else {
            setSelectedNode(null);
        }
    }

    currentMount.addEventListener("pointermove", onPointerMove);
    currentMount.addEventListener("click", onClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const animationSpeed = 0.2; // Controls how fast the sphere moves
      const totalSegments = pathPoints.length;
      
      torus.visible = isWireframeVisible && viewMode === 'torus';
      bodyGraphGroupRef.current.visible = viewMode === 'bodygraph';
      torusGroupRef.current.visible = viewMode === 'torus';
      
      pathMeshes.current.visible = pathType === 1;
      tunnelMeshes.current.visible = pathType === 2;

      // Conditionally render the animated sphere
      animatedSphere.visible = viewMode === 'torus';
      camera2.visible = viewMode === 'torus';

      let lookAtPoint = scene.position;

      if (totalSegments > 1) {
        const progress = (elapsedTime * animationSpeed) % totalSegments;
        const currentSegmentIndex = Math.floor(progress);
        const nextSegmentIndex = (currentSegmentIndex + 1) % totalSegments;
        const segmentProgress = progress - currentSegmentIndex;

        const startPoint = pathPoints[currentSegmentIndex];
        const endPoint = pathPoints[nextSegmentIndex];

        if (startPoint && endPoint) {
          animatedSphere.position.lerpVectors(startPoint, endPoint, segmentProgress);
          lookAtPoint = endPoint;
        }
      }

      activeCamera = cameras[activeCameraIndex];
      renderPass.camera = activeCamera;
      controls.enabled = activeCameraIndex === 0;
      if (activeCameraIndex === 0 && controls.autoRotate) {
        controls.update();
      } else {
        controls.autoRotate = false;
      }
      
      if (activeCameraIndex === 1) {
          animatedSphere.up.copy(animatedSphere.position).normalize();
          animatedSphere.lookAt(lookAtPoint);
      }
      
      raycaster.setFromCamera(mouse, activeCamera);
      const intersects = raycaster.intersectObjects(nodesRef.current, true);

      nodesRef.current.forEach((node) => {
          const isIntersected = intersects.length > 0 && intersects[0].object.uuid === node.uuid;
          const scale = isIntersected ? 1.5 : 1;
          node.scale.set(scale, scale, scale);
      });

      if (intersects.length > 0) {
        currentMount.style.cursor = "pointer";
      } else {
        currentMount.style.cursor = "auto";
      }
      
      if(activeCameraIndex === 0) {
        controls.update();
      }

      composer.render();
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!currentMount) return;
      cameras.forEach(camera => {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
      });
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      composer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (currentMount) {
        currentMount.removeEventListener("pointermove", onPointerMove);
        currentMount.removeEventListener("click", onClick);
        if(renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      renderer.dispose();
      
      scene.remove(bodyGraphGroupRef.current);
      scene.remove(torusGroupRef.current);
      
      torusGeometry.dispose();
      torusMaterial.dispose();
      nodeGeometry.dispose();
      animatedSphereGeometry.dispose();
      animatedSphereMaterial.dispose();

      controls.dispose();
    };
  }, [activeCameraIndex, isWireframeVisible, pathType, viewMode]);

  return (
    <>
      <div ref={mountRef} className="h-full w-full" />
      {selectedNode && (
          <Card 
              className="absolute w-64 bg-background/80 backdrop-blur-sm shadow-2xl rounded-lg"
              style={{
                  left: `${selectedNode.position.x}px`,
                  top: `${selectedNode.position.y}px`,
                  transform: `translate(-50%, -110%)`,
                  transition: 'top 0.2s ease-out, left 0.2s ease-out',
                  pointerEvents: 'none',
              }}
          >
              <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                  <div className="w-4 h-4 rounded-full" style={{backgroundColor: "#0077be"}}/>
                  <CardTitle>Hexagram {selectedNode.id}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                  <p className="font-semibold">Category: {selectedNode.category}</p>
                  <p className="font-semibold">Binary: {selectedNode.binary}</p>
                  <p className="text-sm text-muted-foreground mt-2">More details about this hexagram could be displayed here.</p>
              </CardContent>
          </Card>
      )}
    </>
  );
}
