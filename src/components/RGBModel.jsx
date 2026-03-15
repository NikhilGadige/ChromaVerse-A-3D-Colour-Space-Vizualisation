import React, { useMemo } from 'react';
import { OrbitControls, Sphere, Html, Edges, Line } from '@react-three/drei';
import * as THREE from 'three';

export function RGBModel({ currentColor, wireframe, onColorPick }) {
    const r = currentColor.r / 255;
    const g = currentColor.g / 255;
    const b = currentColor.b / 255; // mapped to [0, 1] internally

    const geometry = useMemo(() => {
        // 1x1x1 cube, centered at origin
        const geo = new THREE.BoxGeometry(1, 1, 1);

        // Calculate colors based on position
        const positions = geo.attributes.position;
        const colors = [];

        const count = positions.count;
        for (let i = 0; i < count; i++) {
            // position coordinates are between -0.5 and 0.5
            const x = positions.getX(i);
            const y = positions.getY(i);
            const z = positions.getZ(i);

            // map to [0, 1] for RGB
            const cr = x + 0.5;
            const cg = y + 0.5;
            const cb = z + 0.5;

            colors.push(cr, cg, cb);
        }

        geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        return geo;
    }, []);

    // Quaternion to rotate the cube so the main diagonal (Black -> White) is pointing vertical (World Y)
    const cubeRotation = useMemo(() => {
        return new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(1, 1, 1).normalize(),
            new THREE.Vector3(0, 1, 0)
        );
    }, []);

    // Position of the current color point in the cube's local space
    const pointPosition = new THREE.Vector3(r - 0.5, g - 0.5, b - 0.5);

    // Dynamic slice geometry connecting Black (-0.5,-0.5,-0.5), White (0.5,0.5,0.5), and Current Color
    const sliceGeometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const vertices = new Float32Array([
            -0.5, -0.5, -0.5, // Black
            0.5, 0.5, 0.5,    // White
            r - 0.5, g - 0.5, b - 0.5 // Current Target
        ]);
        geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geo.computeVertexNormals();
        return geo;
    }, [r, g, b]);

    const offset = 1.15; // To push labels slightly outside the cube vertices

    return (
        <group>
            <OrbitControls makeDefault />
            <ambientLight intensity={Math.PI / 2} />

            <group quaternion={cubeRotation}>
                {/* Target Color Indicator Point */}
                <Sphere position={pointPosition} args={[0.04, 32, 32]}>
                    <meshBasicMaterial color="white" />
                </Sphere>

                {/* Hue Wedge Slice */}
                <mesh geometry={sliceGeometry}>
                    <meshBasicMaterial color="white" transparent opacity={0.3} side={THREE.DoubleSide} depthWrite={false} />
                </mesh>

                <mesh geometry={geometry}>
                    <meshBasicMaterial
                        vertexColors
                        wireframe={wireframe}
                        transparent
                        opacity={wireframe ? 0.2 : 0.6}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                    />
                    {!wireframe && <Edges color="rgba(255,255,255,0.4)" />}
                </mesh>

                {/* Inner Axes from Black */}
                {!wireframe && (
                    <>
                        <Line points={[[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5]]} color="#ff4444" lineWidth={2} transparent opacity={0.6} />
                        <Html position={[(0.5 + -0.5) / 2, -0.5, -0.5]} center className="text-red-400 text-[10px] pointer-events-none drop-shadow-md">R axis</Html>

                        <Line points={[[-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]]} color="#44ff44" lineWidth={2} transparent opacity={0.6} />
                        <Html position={[-0.5, (0.5 + -0.5) / 2, -0.5]} center className="text-green-400 text-[10px] pointer-events-none drop-shadow-md">G axis</Html>

                        <Line points={[[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5]]} color="#4444ff" lineWidth={2} transparent opacity={0.6} />
                        <Html position={[-0.5, -0.5, (0.5 + -0.5) / 2]} center className="text-blue-400 text-[10px] pointer-events-none drop-shadow-md">B axis</Html>

                        {/* Central Intensity Axis */}
                        <Line points={[[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]]} color="rgba(255,255,255,0.6)" lineWidth={1.5} dashed={true} dashSize={0.05} gapSize={0.05} transparent opacity={0.8} />
                    </>
                )}

                {/* Vertex Labels */}
                <Html position={[-0.5 * offset, -0.5 * offset, -0.5 * offset]} center className="text-gray-400 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Black</Html>
                <Html position={[0.5 * offset, 0.5 * offset, 0.5 * offset]} center className="text-white font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>White</Html>
                
                <Html position={[0.5 * offset, -0.5 * offset, -0.5 * offset]} center className="text-red-500 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Red</Html>
                <Html position={[-0.5 * offset, 0.5 * offset, -0.5 * offset]} center className="text-green-500 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Green</Html>
                <Html position={[-0.5 * offset, -0.5 * offset, 0.5 * offset]} center className="text-blue-500 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Blue</Html>
                
                <Html position={[-0.5 * offset, 0.5 * offset, 0.5 * offset]} center className="text-cyan-400 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Cyan</Html>
                <Html position={[0.5 * offset, -0.5 * offset, 0.5 * offset]} center className="text-fuchsia-500 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Magenta</Html>
                <Html position={[0.5 * offset, 0.5 * offset, -0.5 * offset]} center className="text-yellow-400 font-bold text-sm pointer-events-none" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>Yellow</Html>
            </group>
        </group>
    );
}
