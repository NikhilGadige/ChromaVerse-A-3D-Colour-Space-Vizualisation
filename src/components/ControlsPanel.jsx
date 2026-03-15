import React from 'react';

export function ControlsPanel({
    modelConfig,
    colorState,
    setColorState
}) {
    const handleChange = (key, value) => {
        setColorState(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    return (
        <div className="w-80 bg-card p-6 border-r border-white/10 flex flex-col gap-6">
            <div>
                <h2 className="text-xl font-bold mb-1 tracking-tight">Controls</h2>
                <p className="text-sm text-gray-400">Interact with the {modelConfig.name} parameters</p>
            </div>

            <div className="flex flex-col gap-5">
                {modelConfig.sliders.map(slider => (
                    <div key={slider.key} className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-sm">
                            <label className="font-medium text-gray-300">{slider.label}</label>
                            <span className="font-mono text-xs bg-black/40 px-2 py-1 rounded text-primary">
                                {Number(colorState[slider.key]).toFixed(slider.step >= 1 ? 0 : 2)}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={slider.min}
                            max={slider.max}
                            step={slider.step}
                            value={colorState[slider.key]}
                            onChange={(e) => handleChange(slider.key, e.target.value)}
                            className="w-full accent-primary bg-black/50 h-2 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
