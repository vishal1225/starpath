import React from "react";
import { BookOpen, Calculator, Ruler, BarChart2 } from "lucide-react";

const TOPICS = [
    { id: "fractions", name: "Fractions", color: "from-amber-200 to-orange-400", icon: <Calculator className="w-8 h-8 text-orange-500" /> },
    { id: "geometry", name: "Geometry", color: "from-blue-200 to-violet-400", icon: <Ruler className="w-8 h-8 text-violet-500" /> },
    { id: "decimals", name: "Decimals", color: "from-emerald-200 to-green-400", icon: <BookOpen className="w-8 h-8 text-green-500" /> },
    { id: "data", name: "Data", color: "from-fuchsia-200 to-pink-400", icon: <BarChart2 className="w-8 h-8 text-pink-500" /> },
    // Add more topics as needed!
];

export default function TopicSelector({ onSelect }) {
    return (
        <div className="flex flex-col items-center min-h-screen pt-20 pb-8 bg-gradient-to-b from-blue-50 via-violet-50 to-white">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-violet-700 tracking-tight drop-shadow">✨ Pick a Topic to Practice</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {TOPICS.map(topic => (
                    <button
                        key={topic.id}
                        className={`
              group flex flex-col items-center justify-center
              p-7 w-56 h-44 bg-gradient-to-br ${topic.color}
              rounded-3xl shadow-xl border-2 border-transparent
              transition-all hover:scale-105 hover:shadow-2xl hover:border-violet-400 focus:outline-none
            `}
                        onClick={() => onSelect(topic.id)}
                        tabIndex={0}
                    >
                        <div className="mb-3">{topic.icon}</div>
                        <div className="text-xl font-bold text-violet-800 mb-2 drop-shadow">{topic.name}</div>
                        <div className="text-xs text-gray-600 opacity-60">Practice & master {topic.name.toLowerCase()}!</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
