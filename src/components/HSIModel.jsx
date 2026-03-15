import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import { hsiToRgb } from '../utils/colorConversions';

export function HSIModel({ currentColor, wireframe, onColorPick }) {
    // Input currentColor is HSI
    const { h, i } = currentColor;
    const s = currentColor.s / 100; // mapped to [0, 1] internally

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];
        const indices = [];

        const radialSegments = 64;
        const heightSegments = 32;

        // Generate vertices
        for (let y = 0; y <= heightSegments; y++) {
            const v = y / heightSegments; // I from 0 to 1

            // Double cone radius logic
            // Max radius at I=0.5
            let radius = v <= 0.5 ? (v / 0.5) : ((1 - v) / 0.5);

            for (let x = 0; x <= radialSegments; x++) {
                const u = x / radialSegments;
                const theta = u * Math.PI * 2; // H from 0 to 360

                const px = radius * Math.cos(theta);
                const pz = radius * Math.sin(theta);
                const py = v - 0.5;

                positions.push(px, py, pz);

                // Convert H, S=1, I=v to RGB for surface color
                const surfaceH = u * 360;
                const surfaceS = 1;
                const rgb = hsiToRgb(surfaceH, surfaceS, v);
                colors.push(rgb.r, rgb.g, rgb.b);
            }
        }

        // Generate indices
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

    // Current point position:
    const pointRadius = s * (i <= 0.5 ? (i / 0.5) : ((1 - i) / 0.5));
    const pointTheta = (h / 360) * Math.PI * 2;
    const pointPosition = new THREE.Vector3(
        pointRadius * Math.cos(pointTheta),
        i - 0.5,
        pointRadius * Math.sin(pointTheta)
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
                    opacity={wireframe ? 0.2 : 0.6}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Custom Axes */}
            <Line points={[[0, -0.6, 0], [0, 0.6, 0]]} color="rgba(255,255,255,0.5)" lineWidth={2} dashed dashSize={0.05} gapSize={0.05} transparent />
            <Line points={[[0, 0, 0], [1.2, 0, 0]]} color="rgba(255, 60, 60, 0.8)" lineWidth={2} transparent />
            <Line points={[[0, 0, 0], [-0.6, 0, 1.04]]} color="rgba(60, 255, 60, 0.8)" lineWidth={2} transparent />
            <Line points={[[0, 0, 0], [-0.6, 0, -1.04]]} color="rgba(60, 60, 255, 0.8)" lineWidth={2} transparent />
            <Html position={[0, 0.6, 0]} className="text-gray-300 font-bold text-sm pointer-events-none">White (I=1)</Html>
            <Html position={[0, -0.6, 0]} className="text-gray-500 font-bold text-sm pointer-events-none">Black (I=0)</Html>
            <Html position={[1.2, 0, 0]} className="text-red-500 font-bold text-sm pointer-events-none">0° (Red)</Html>
            <Html position={[-0.6, 0, 1.04]} className="text-green-500 font-bold text-sm pointer-events-none">120° (Green)</Html>
            <Html position={[-0.6, 0, -1.04]} className="text-blue-500 font-bold text-sm pointer-events-none">240° (Blue)</Html>
        </group>
    );
}
