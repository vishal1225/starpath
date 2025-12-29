import React from "react";

// Utility: Extract numbers and fractions (as floats)
function extractNumbers(str) {
    return (str.match(/-?\d+(?:\/\d+)?/g) || []).map(s => {
        if (s.includes("/")) {
            const [n, d] = s.split("/").map(Number);
            return d ? n / d : NaN;
        }
        return Number(s);
    });
}

export default function DiagramRenderer({ description }) {
    // --- Number line with dot at ... ---
    if (/number line/i.test(description) && /dot at/i.test(description)) {
        // e.g., "A number line from 0 to 20 with a dot at 12"
        const numbers = extractNumbers(description);
        const [min, max, dot] = numbers;
        if (numbers.length >= 3) {
            const pct = (dot - min) / (max - min);
            return (
                <svg viewBox="0 0 300 60" width={300} height={60} className="mx-auto my-4">
                    {/* Line */}
                    <line x1={40} y1={30} x2={260} y2={30} stroke="#222" strokeWidth="2"/>
                    {/* Ticks and labels */}
                    <text x={30} y={48} fontSize={14} fill="#222">{min}</text>
                    <text x={260} y={48} fontSize={14} fill="#222">{max}</text>
                    {/* Dot */}
                    <circle cx={40 + pct * 220} cy={30} r={7} fill="#ef4444"/>
                </svg>
            );
        }
    }

    // --- Number line with shaded section ---
    if (/number line/i.test(description) && /shaded/i.test(description) && /from (\d+|\d+\/\d+) to (\d+|\d+\/\d+)/i.test(description)) {
        // e.g., "A number line from 0 to 1 with the section from 0 to 1/4 shaded."
        const matches = [...description.matchAll(/from (\d+|\d+\/\d+) to (\d+|\d+\/\d+)/gi)];
        if (matches.length > 0) {
            const [minStr, maxStr] = description.match(/number line from (\d+|\d+\/\d+) to (\d+|\d+\/\d+)/i).slice(1,3);
            const [shadeFrom, shadeTo] = matches[0].slice(1,3);
            // Convert to numbers/fractions
            const f = s => s.includes("/") ? (Number(s.split("/")[0]) / Number(s.split("/")[1])) : Number(s);
            const min = f(minStr), max = f(maxStr), sFrom = f(shadeFrom), sTo = f(shadeTo);
            const width = 240;
            const scale = val => 40 + ((val - min) / (max - min)) * 220;
            return (
                <svg width={300} height={60} className="mx-auto my-4">
                    {/* Line */}
                    <line x1={40} y1={30} x2={260} y2={30} stroke="#222" strokeWidth="2"/>
                    {/* Full line ticks */}
                    <text x={30} y={48} fontSize={14} fill="#222">{minStr}</text>
                    <text x={260} y={48} fontSize={14} fill="#222">{maxStr}</text>
                    {/* Shaded section */}
                    <rect
                        x={scale(sFrom)}
                        y={20}
                        width={scale(sTo) - scale(sFrom)}
                        height={20}
                        fill="#f472b6"
                        opacity={0.8}
                        rx={4}
                    />
                    {/* Borders for shaded */}
                    <rect
                        x={scale(sFrom)}
                        y={20}
                        width={scale(sTo) - scale(sFrom)}
                        height={20}
                        fill="none"
                        stroke="#be185d"
                        strokeWidth={1.5}
                        rx={4}
                    />
                </svg>
            );
        }
    }

    // --- Number line with shaded segments ---
    if (/number line/i.test(description) && /shaded/i.test(description)) {
        // e.g., "A horizontal number line divided into 8 equal segments with the first 3 segments shaded."
        const numbers = extractNumbers(description);
        let total = 0, shaded = 0;
        if (/divided into (\d+)/i.test(description)) {
            total = numbers[0];
        }
        if (/first (\d+)/i.test(description)) {
            shaded = numbers[numbers.length - 1];
        }
        if (total > 0) {
            const width = 240, height = 50;
            const segWidth = width / total;
            return (
                <svg width={width} height={height} className="mx-auto my-4">
                    {[...Array(total)].map((_, i) => (
                        <rect
                            key={i}
                            x={i * segWidth}
                            y={16}
                            width={segWidth - 2}
                            height={20}
                            fill={i < shaded ? "#f472b6" : "#ddd"}
                            stroke="#444"
                            strokeWidth={1}
                            rx={5}
                        />
                    ))}
                    <line x1="0" y1="36" x2={width} y2="36" stroke="#222" strokeWidth={2} />
                </svg>
            );
        }
    }

    // --- Rectangle ---
    if (/rectangle/i.test(description)) {
        const numbers = extractNumbers(description);
        if (numbers.length >= 2) {
            const [a, b] = numbers;
            const w = 40 + 20 * a, h = 40 + 20 * b;
            return (
                <svg width={w} height={h} className="mx-auto my-4">
                    <rect x={5} y={5} width={w-10} height={h-10} fill="#ddd6fe" stroke="#6366f1" strokeWidth={4}/>
                    <text x={w/2} y={h/2} textAnchor="middle" dy=".3em" fontSize={16} fill="#444">{a}cm × {b}cm</text>
                </svg>
            );
        }
    }

    // --- Bar chart ---
    if (/bar chart/i.test(description)) {
        const numbers = extractNumbers(description);
        if (numbers.length >= 2) {
            const barWidth = 40, gap = 24;
            const maxVal = Math.max(...numbers);
            return (
                <svg width={(barWidth+gap)*numbers.length} height={120} className="mx-auto my-4">
                    {numbers.map((v, i) => (
                        <g key={i}>
                            <rect
                                x={i * (barWidth + gap)}
                                y={110 - (v / maxVal) * 90}
                                width={barWidth}
                                height={(v / maxVal) * 90}
                                fill="#f472b6"
                                stroke="#be185d"
                                strokeWidth={2}
                                rx={6}
                            />
                            <text
                                x={i * (barWidth + gap) + barWidth / 2}
                                y={110}
                                textAnchor="middle"
                                fontSize={15}
                                fill="#222"
                            >{v}</text>
                        </g>
                    ))}
                </svg>
            );
        }
    }

    // Default: Show description as text
    return (
        <div className="my-4 p-2 bg-yellow-50 rounded-xl text-center border text-gray-700 font-mono">
            <b>Diagram:</b> {description}
        </div>
    );
}
