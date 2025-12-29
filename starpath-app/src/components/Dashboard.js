import React from "react";
import { Star, BarChart2 } from "lucide-react";

const TOPIC_NAMES = {
    fractions: "Fractions",
    geometry: "Geometry",
    decimals: "Decimals",
    data: "Data",
};

export default function Dashboard({ progress, onRestart, lastTopicName, lastScore, lastTotal }) {
    const totalCorrect = Object.values(progress).reduce((s, t) => s + (t.correct || 0), 0);
    const totalQuestions = Object.values(progress).reduce((s, t) => s + (t.total || 0), 0);

    const renderBar = (correct, total) => (
        <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
            <div
                className="h-5 bg-gradient-to-r from-fuchsia-400 via-violet-400 to-emerald-400 transition-all"
                style={{ width: total ? `${Math.round((100 * correct) / total)}%` : "0%" }}
            />
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto mt-14 bg-gradient-to-br from-sky-50 to-violet-100 rounded-3xl shadow-2xl p-10 text-center border-2 border-violet-200">
            <div className="flex items-center justify-center mb-6 gap-2">
                <BarChart2 className="w-9 h-9 text-violet-600 drop-shadow" />
                <h1 className="text-3xl font-extrabold text-violet-700 tracking-tight drop-shadow">Your Progress</h1>
            </div>
            <div className="mb-6">
                <div className="font-semibold text-lg text-gray-600">Overall Score</div>
                <div className="text-4xl font-black text-emerald-700 mb-2">
                    {totalCorrect}/{totalQuestions}
                    <span className="ml-3 text-2xl text-violet-600">({totalQuestions > 0 ? Math.round((100 * totalCorrect) / totalQuestions) : 0}%)</span>
                </div>
            </div>
            <div className="mb-8">
                <div className="font-semibold mb-2 text-violet-600">Mastery by Topic</div>
                <div className="space-y-4">
                    {Object.entries(progress).map(([topic, { correct, total }]) => (
                        <div key={topic} className="text-left">
                            <div className="flex items-center justify-between mb-1">
                <span className="flex items-center font-bold text-lg text-violet-800">
                  <Star className="w-5 h-5 mr-1 text-amber-400" />
                    {TOPIC_NAMES[topic] || topic}
                </span>
                                <span className="text-base font-bold text-gray-800">{total ? Math.round((100 * correct) / total) : 0}%</span>
                            </div>
                            {renderBar(correct, total)}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-8">
                <div className="font-semibold text-violet-700">Last Session</div>
                <div className="text-lg mt-1 font-medium text-gray-700">
                    {lastTopicName}: <b>{lastScore}/{lastTotal}</b> ({lastTotal > 0 ? Math.round((100 * lastScore) / lastTotal) : 0}%)
                </div>
            </div>
            <button
                className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white text-lg font-bold px-8 py-3 rounded-2xl shadow-lg transition-all active:scale-95"
                onClick={onRestart}
            >
                Practice Another Topic
            </button>
        </div>
    );
}
