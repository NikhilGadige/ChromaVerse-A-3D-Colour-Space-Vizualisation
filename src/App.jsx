import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { RGBModel } from './components/RGBModel';
import { HSIModel } from './components/HSIModel';
import { HSVModel } from './components/HSVModel';
import { ControlsPanel } from './components/ControlsPanel';
import { ColorInfoPanel } from './components/ColorInfoPanel';
import { Layers } from 'lucide-react';
import { rgbToHsi, rgbToHsv, hsiToRgb, hsvToRgb } from './utils/colorConversions';

const modelConfigs = {
    rgb: {
        id: 'rgb',
        name: 'RGB Cube',
        sliders: [
            { key: 'r', label: 'R (0-255)', min: 0, max: 255, step: 1 },
            { key: 'g', label: 'G (0-255)', min: 0, max: 255, step: 1 },
            { key: 'b', label: 'B (0-255)', min: 0, max: 255, step: 1 },
        ],
        defaultState: { r: 255, g: 128, b: 51 }
    },
    hsi: {
        id: 'hsi',
        name: 'HSI Double Cone',
        sliders: [
            { key: 'h', label: 'Hue (0-360°)', min: 0, max: 360, step: 1 },
            { key: 's', label: 'Saturation (0-100%)', min: 0, max: 100, step: 1 },
            { key: 'i', label: 'Intensity (0-1)', min: 0, max: 1, step: 0.01 },
        ],
        defaultState: { h: 24, s: 100, i: 0.6 }
    },
    hsv: {
        id: 'hsv',
        name: 'HSV Hexcone',
        sliders: [
            { key: 'h', label: 'Hue (0-360°)', min: 0, max: 360, step: 1 },
            { key: 's', label: 'Saturation (0-1)', min: 0, max: 1, step: 0.01 },
            { key: 'v', label: 'Value (0-1)', min: 0, max: 1, step: 0.01 },
        ],
        defaultState: { h: 24, s: 0.8, v: 1 }
    }
};

export default function App() {
    const [activeModel, setActiveModel] = useState('rgb');
    const [colorState, setColorState] = useState(modelConfigs.rgb.defaultState);
    const [wireframe, setWireframe] = useState(false);

    const switchModel = (newModelId) => {
        // Preserve current color visually if possible
        let r, g, b;
        if (activeModel === 'rgb') {
            r = colorState.r / 255;
            g = colorState.g / 255;
            b = colorState.b / 255;
        } else if (activeModel === 'hsi') {
            ({ r, g, b } = hsiToRgb(colorState.h, colorState.s / 100, colorState.i));
        } else if (activeModel === 'hsv') {
            ({ r, g, b } = hsvToRgb(colorState.h, colorState.s, colorState.v));
        }

        let newState = {};
        if (newModelId === 'rgb') {
            newState = { r: r * 255, g: g * 255, b: b * 255 };
        } else if (newModelId === 'hsi') {
            newState = rgbToHsi(r, g, b);
            newState.s *= 100; // convert to percentage
        } else if (newModelId === 'hsv') {
            newState = rgbToHsv(r, g, b);
        }

        // fallback to nan checks
        Object.keys(newState).forEach(key => {
            if (isNaN(newState[key])) newState[key] = 0;
        });

        setColorState(newState);
        setActiveModel(newModelId);
    };

    const currentConfig = modelConfigs[activeModel];

    return (
        <div className="flex flex-col h-screen w-full bg-background overflow-hidden font-sans">

            {/* Header section (Hero) */}
            <header className="flex-none p-6 border-b border-white/10 flex items-center justify-between bg-black/20 relative z-10 shadow-lg">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent drop-shadow-sm">
                        ChromaVerse
                    </h1>
                    <p className="text-gray-400 font-medium tracking-wide">
                        Visualize RGB, HSI, and HSV color spaces in 3D.
                    </p>
                </div>
                <div className="flex gap-4 items-center">

                    <label className="flex items-center gap-2 text-sm text-gray-300 font-medium cursor-pointer bg-white/5 py-2 px-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                        <input
                            type="checkbox"
                            checked={wireframe}
                            onChange={(e) => setWireframe(e.target.checked)}
                            className="accent-primary"
                        />
                        <Layers size={16} /> Wireframe
                    </label>

                    <div className="flex gap-2">
                        {Object.values(modelConfigs).map(conf => (
                            <button
                                key={conf.id}
                                onClick={() => switchModel(conf.id)}
                                className={`px-5 py-2 rounded-lg font-bold transition-all shadow-md active:scale-95 ${activeModel === conf.id
                                    ? 'bg-primary text-white scale-105 rounded-xl border-b-4 border-blue-700'
                                    : 'bg-white/10 hover:bg-white/20 text-gray-300 border border-white/5'
                                    }`}
                            >
                                Explore {conf.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Main Workspace */}
            <main className="flex-1 flex overflow-hidden relative">
                <ControlsPanel
                    modelConfig={currentConfig}
                    colorState={colorState}
                    setColorState={setColorState}
                />

                <div className="flex-1 relative order-2 shadow-inner bg-gradient-to-br from-black/20 via-black/40 to-black/80">
                    <Suspense fallback={<div className="flex items-center justify-center w-full h-full text-white">Loading 3D...</div>}>
                        <Canvas camera={{ position: [2, 1.5, 2], fov: 45 }}>
                            {activeModel === 'rgb' && <RGBModel currentColor={colorState} wireframe={wireframe} onColorPick={setColorState} />}
                            {activeModel === 'hsi' && <HSIModel currentColor={colorState} wireframe={wireframe} onColorPick={setColorState} />}
                            {activeModel === 'hsv' && <HSVModel currentColor={colorState} wireframe={wireframe} onColorPick={setColorState} />}
                        </Canvas>
                    </Suspense>

                    {/* Educational Overlay Hint */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-gray-300 text-sm px-6 py-2 rounded-full border border-white/10 shadow-lg backdrop-blur mx-auto whitespace-nowrap z-0 pointer-events-none">
                        Drag to Rotate • Scroll to Zoom • Right-click to Pan
                    </div>
                </div>

                <ColorInfoPanel
                    modelConfig={currentConfig}
                    colorState={colorState}
                    model={activeModel}
                    className="order-3"
                />
            </main>
        </div>
    );
}
