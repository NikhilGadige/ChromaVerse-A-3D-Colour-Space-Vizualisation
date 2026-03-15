import React from 'react';
import { Copy, Info } from 'lucide-react';
import { rgbToHex, rgbToHsi, rgbToHsv, hsiToRgb, hsvToRgb } from '../utils/colorConversions';

export function ColorInfoPanel({
    modelConfig,
    colorState,
    model,
    className
}) {
    let rgbCoords, hsiCoords, hsvCoords, hexCode;

    if (model === 'rgb') {
        const nr = colorState.r / 255;
        const ng = colorState.g / 255;
        const nb = colorState.b / 255;
        rgbCoords = { r: nr, g: ng, b: nb };
        hsiCoords = rgbToHsi(nr, ng, nb);
        hsvCoords = rgbToHsv(nr, ng, nb);
    } else if (model === 'hsi') {
        rgbCoords = hsiToRgb(colorState.h, colorState.s / 100, colorState.i);
        hsiCoords = { h: colorState.h, s: colorState.s / 100, i: colorState.i };
        hsvCoords = rgbToHsv(rgbCoords.r, rgbCoords.g, rgbCoords.b);
    } else {
        rgbCoords = hsvToRgb(colorState.h, colorState.s, colorState.v);
        hsiCoords = rgbToHsi(rgbCoords.r, rgbCoords.g, rgbCoords.b);
        hsvCoords = { h: colorState.h, s: colorState.s, v: colorState.v };
    }

    hexCode = rgbToHex(rgbCoords.r, rgbCoords.g, rgbCoords.b);

    const copyHex = () => {
        navigator.clipboard.writeText(hexCode);
        alert('Copied to clipboard: ' + hexCode);
    };

    return (
        <div className={`w-80 bg-card p-6 border-l border-white/10 flex flex-col gap-6 overflow-y-auto ${className || ''}`}>
            <div>
                <h2 className="text-xl font-bold mb-1 tracking-tight">Information</h2>
                <p className="text-sm text-gray-400">Color Conversion Details</p>
            </div>

            <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                <div
                    className="w-16 h-16 rounded shadow-md border border-white/20"
                    style={{ backgroundColor: hexCode }}
                ></div>
                <div className="flex flex-col gap-1 w-full relative">
                    <span className="font-mono text-lg tracking-widest">{hexCode}</span>
                    <button
                        onClick={copyHex}
                        className="absolute right-0 top-0 p-1 bg-white/10 hover:bg-white/20 rounded shadow transition-colors"
                        title="Copy HEX"
                    >
                        <Copy size={16} />
                    </button>
                    <span className="text-xs text-gray-500 uppercase tracking-widest">Selected Color</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 font-mono text-sm">
                <div className="bg-black/30 p-3 rounded flex justify-between items-center border border-white/5">
                    <span className="text-gray-400">RGB</span>
                    <span className="text-primary tracking-wide">
                        ({Math.round(rgbCoords.r * 255)}, {Math.round(rgbCoords.g * 255)}, {Math.round(rgbCoords.b * 255)})
                    </span>
                </div>
                <div className="bg-black/30 p-3 rounded flex justify-between items-center border border-white/5">
                    <span className="text-gray-400">HSI</span>
                    <span className="text-primary tracking-wide">
                        ({Math.round(hsiCoords.h)}°, {(hsiCoords.s * 100).toFixed(0)}%, {hsiCoords.i.toFixed(2)})
                    </span>
                </div>
                <div className="bg-black/30 p-3 rounded flex justify-between items-center border border-white/5">
                    <span className="text-gray-400">HSV</span>
                    <span className="text-primary tracking-wide">
                        ({Math.round(hsvCoords.h)}°, {hsvCoords.s.toFixed(2)}, {hsvCoords.v.toFixed(2)})
                    </span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                    <Info size={18} className="text-blue-400" />
                    <span className="text-blue-100">Theory: {modelConfig.name}</span>
                </h3>

                <div className="text-sm text-gray-300 leading-relaxed space-y-3 bg-black/20 p-4 rounded-xl border border-white/5">
                    {model === 'rgb' && (
                        <>
                            <p>RGB represents color additively as <span className="text-white font-mono">C = (R,G,B)</span>. </p>
                            <p>Used primarily in screen display systems like computer graphics, monitors, and cameras.</p>
                            <p className="border-l-2 border-primary pl-2 text-gray-400 text-xs mt-2 italic">Black = (0,0,0) <br /> White = (255,255,255)</p>
                        </>
                    )}

                    {model === 'hsi' && (
                        <>
                            <p>HSI represents color in a Double Cone geometry. It stands for Hue, Saturation, Intensity.</p>
                            <p>Commonly applied in image processing because it naturally separates chromatic information from intensity, aligning with human perception.</p>
                            <p className="border-l-2 border-primary pl-2 text-gray-400 text-xs mt-2 italic">Max saturation radius exists precisely at I=0.5.</p>
                        </>
                    )}

                    {model === 'hsv' && (
                        <>
                            <p>HSV (Hue, Saturation, Value) is defined via a Hexcone geometry.</p>
                            <p>Common in general digital painting and graphic design due to intuitive color selection.</p>
                            <p className="border-l-2 border-primary pl-2 text-gray-400 text-xs mt-2 italic">White exists where Value=1 and Saturation=0.</p>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
