import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import { hsvToRgb } from '../utils/colorConversions';

export function HSVModel({ currentColor, wireframe, onColorPick }) {
    const { h, s, v } = currentColor;

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const indices = [];

        // Hexcone: 6 sides
        const radialSegments = 6;
        const heightSegments = 32;

        for (let y = 0; y <= heightSegments; y++) {
            const val = y / heightSegments; // V from 0 to 1
            const maxRadius = val; // Radius scales linearly with V

            for (let x = 0; x <= radialSegments; x++) {
                // x=0..6 => angles 0, 60, 120, 180, 240, 300, 360
                const hDeg = x * (360 / radialSegments);
                const theta = (hDeg / 360) * Math.PI * 2;

                const px = maxRadius * Math.cos(theta);
                const pz = maxRadius * Math.sin(theta);
                const py = val - 0.5;

                positions.push(px, py, pz);

                const surfaceS = 1; // outer shell is fully saturated
                const rgb = hsvToRgb(hDeg, surfaceS, val);
                colors.push(rgb.r, rgb.g, rgb.b);
            }
        }

        for (let y = 0; y < heightSegments; y++) {
            for (let x = 0; x < radialSegments; x++) {
                const a = x + (radialSegments + 1) * y;
                const b = x + (radialSegments + 1) * (y + 1);
                const c = (x + 1) + (radialSegments + 1) * (y + 1);
                const d = (x + 1) + (radialSegments + 1) * y;

                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        return geo;
    }, []);

    // Calculate the current point radius and position
    // In a hexcone, saturation S=1 is at the hexagonal edge.
    // Linear scale with S and V for radius
    // But wait, the math of a hexcone means the radius at an arbitrary angle isn't just a circle if we render it as a hexagon.
    // For the visual point, let's keep it mapped to the hexagon space.
    const theta = (h / 360) * Math.PI * 2;
    // distance to hex edge at angle theta: r = 1 / cos(theta % 60deg - 30deg) scaled appropriately.
    // Simplest is considering radius = s * v. Since our mesh is mapped this way linearly, this matches.
    const radius = s * v;

    const pointPosition = new THREE.Vector3(
        radius * Math.cos(theta),
        v - 0.5,
        radius * Math.sin(theta)
    );

    return (
        <group>
            <OrbitControls makeDefault />
            <ambientLight intensity={Math.PI / 2} />

            <Sphere position={pointPosition} args={[0.03, 16, 16]}>
                <meshBasicMaterial color="white" />
            </Sphere>

            <mesh geometry={geometry}>
                <meshBasicMaterial
                    vertexColors
                    wireframe={wireframe}
                    transparent
                    opacity={wireframe ? 0.4 : 1}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Custom Axes */}
            <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="rgba(255,255,255,0.5)" lineWidth={2} dashed dashSize={0.05} gapSize={0.05} transparent />
            <Line points={[[0, 0, 0], [1.2, 0, 0]]} color="rgba(255, 60, 60, 0.8)" lineWidth={2} transparent />
            <Line points={[[0, 0, 0], [-0.6, 0, 1.04]]} color="rgba(60, 255, 60, 0.8)" lineWidth={2} transparent />
            <Line points={[[0, 0, 0], [-0.6, 0, -1.04]]} color="rgba(60, 60, 255, 0.8)" lineWidth={2} transparent />
            <Html position={[0, 0.6, 0]} className="text-gray-300 font-bold text-sm pointer-events-none">White (V=1)</Html>
            <Html position={[0, -0.6, 0]} className="text-gray-500 font-bold text-sm pointer-events-none">Black (V=0)</Html>
            <Html position={[1.2, 0, 0]} className="text-red-500 font-bold text-sm pointer-events-none">0° (Red)</Html>
            <Html position={[-0.6, 0, 1.04]} className="text-green-500 font-bold text-sm pointer-events-none">120° (Green)</Html>
            <Html position={[-0.6, 0, -1.04]} className="text-blue-500 font-bold text-sm pointer-events-none">240° (Blue)</Html>
        </group>
    );
}
