const deg2rad = (deg) => (deg * Math.PI) / 180;
const rad2deg = (rad) => (rad * 180) / Math.PI;

export function rgbToHsi(r, g, b) {
    // r, g, b must be in [0, 1]
    const sum = r + g + b;
    const min = Math.min(r, g, b);

    const I = sum / 3;
    if (I === 0) return { h: 0, s: 0, i: 0 };

    const S = 1 - (3 / sum) * min;

    let H = 0;
    if (S > 0) {
        const num = 0.5 * ((r - g) + (r - b));
        const den = Math.sqrt(Math.pow(r - g, 2) + (r - b) * (g - b));
        if (den !== 0) {
            const theta = rad2deg(Math.acos(num / den));
            H = b > g ? 360 - theta : theta;
        }
    }

    return { h: H, s: S, i: I };
}

export function hsiToRgb(h, s, i) {
    // h in [0, 360), s in [0, 1], i in [0, 1]
    h = h % 360;
    if (h < 0) h += 360;

    let r = 0, g = 0, b = 0;

    if (s === 0) {
        r = g = b = i;
    } else if (h >= 0 && h < 120) {
        b = i * (1 - s);
        r = i * (1 + (s * Math.cos(deg2rad(h))) / Math.cos(deg2rad(60 - h)));
        g = 3 * i - (r + b);
    } else if (h >= 120 && h < 240) {
        const hDeg = h - 120;
        r = i * (1 - s);
        g = i * (1 + (s * Math.cos(deg2rad(hDeg))) / Math.cos(deg2rad(60 - hDeg)));
        b = 3 * i - (r + g);
    } else {
        const hDeg = h - 240;
        g = i * (1 - s);
        b = i * (1 + (s * Math.cos(deg2rad(hDeg))) / Math.cos(deg2rad(60 - hDeg)));
        r = 3 * i - (g + b);
    }

    // clamp to [0, 1] due to floating point precision
    r = Math.min(1, Math.max(0, r));
    g = Math.min(1, Math.max(0, g));
    b = Math.min(1, Math.max(0, b));

    return { r, g, b };
}

export function rgbToHsv(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    const v = max;
    const s = max === 0 ? 0 : delta / max;
    let h = 0;

    if (delta !== 0) {
        if (max === r) {
            h = 60 * (((g - b) / delta) % 6);
        } else if (max === g) {
            h = 60 * (((b - r) / delta) + 2);
        } else {
            h = 60 * (((r - g) / delta) + 4);
        }
    }

    if (h < 0) h += 360;

    return { h, s, v };
}

export function hsvToRgb(h, s, v) {
    h = h % 360;
    if (h < 0) h += 360;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r1 = 0, g1 = 0, b1 = 0;
    if (h >= 0 && h < 60) {
        r1 = c; g1 = x; b1 = 0;
    } else if (h >= 60 && h < 120) {
        r1 = x; g1 = c; b1 = 0;
    } else if (h >= 120 && h < 180) {
        r1 = 0; g1 = c; b1 = x;
    } else if (h >= 180 && h < 240) {
        r1 = 0; g1 = x; b1 = c;
    } else if (h >= 240 && h < 300) {
        r1 = x; g1 = 0; b1 = c;
    } else {
        r1 = c; g1 = 0; b1 = x;
    }

    return {
        r: r1 + m,
        g: g1 + m,
        b: b1 + m
    };
}

export function rgbToHex(r, g, b) {
    const toHex = (x) => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
