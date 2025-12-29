import React, { useState } from "react";
import NaplanNumeracyPractice from "./components/NaplanPractice/NaplanNumeracyPractice";
import TopicSelector from "./components/TopicSelector";
import AdaptivePractice from "./components/AdaptivePractice/AdaptivePractice";
import Dashboard from "./components/Dashboard";
import { StudentProvider, useStudent } from "./components/StudentContext";
import StudentRegister from "./components/StudentRegister";
import StudentProfile from "./components/StudentProfile";

const SUBJECTS = [
    { id: "maths", label: "Maths / Numeracy" },
    { id: "reading", label: "Reading" },
    { id: "writing", label: "Writing" }
];

const MODES = {
    HOME: "home",
    MODE_SELECT: "mode_select",
    NAPLAN: "naplan",
    ADAPTIVE_TOPIC: "adaptive_topic",
    ADAPTIVE_PRACTICE: "adaptive_practice",
    DASHBOARD: "dashboard",
    PROFILE: "profile"
};

function MainApp() {
    const { student } = useStudent();
    const [step, setStep] = useState(MODES.HOME);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [lastSession, setLastSession] = useState({ topic: "", score: 0, total: 0 });
    const [progress] = useState(() => {
        return JSON.parse(localStorage.getItem("starpath-progress")) || {
            fractions: { correct: 0, total: 0 },
            geometry: { correct: 0, total: 0 },
            decimals: { correct: 0, total: 0 },
            data: { correct: 0, total: 0 },
        };
    });

    // Profile always required
    if (!student) return <StudentRegister />;

    // Profile view
    if (step === MODES.PROFILE) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-violet-100 py-8">
                <div className="max-w-xl mx-auto">
                    <StudentProfile />
                    <div className="text-center mt-6">
                        <button
                            className="text-blue-700 underline hover:text-blue-900"
                            onClick={() => setStep(MODES.HOME)}
                        >
                            &larr; Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 1. Subject selection (Home)
    if (step === MODES.HOME) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-violet-100">
                <h1 className="text-4xl font-extrabold text-violet-700 mb-6 tracking-tight drop-shadow">
                    Welcome to StarPath
                </h1>
                <p className="text-gray-600 mb-2">Hello, {student.name}! 👋</p>
                <button
                    className="mb-8 text-blue-700 underline hover:text-blue-900"
                    onClick={() => setStep(MODES.PROFILE)}
                >
                    View My Profile
                </button>
                <div className="flex flex-col md:flex-row gap-8">
                    {SUBJECTS.map(subject => (
                        <button
                            key={subject.id}
                            className="w-80 h-40 bg-gradient-to-br from-blue-200 via-blue-100 to-violet-100 rounded-3xl shadow-2xl border-2 border-violet-300 flex flex-col items-center justify-center hover:scale-105 transition text-violet-800 text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => {
                                setSelectedSubject(subject.id);
                                setStep(MODES.MODE_SELECT);
                            }}
                            disabled={subject.id !== "maths"}
                        >
                            {subject.label}
                            {subject.id !== "maths" && (
                                <span className="text-sm text-gray-400 font-normal mt-2">Coming soon</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // 2. Mode selection (shows after subject picked)
    if (step === MODES.MODE_SELECT) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-violet-100">
                <h2 className="text-3xl font-extrabold text-violet-700 mb-6 tracking-tight">
                    Select a mode for {SUBJECTS.find(s => s.id === selectedSubject)?.label}
                </h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <button
                        className="w-80 h-40 bg-gradient-to-br from-blue-200 via-blue-100 to-violet-100 rounded-3xl shadow-2xl border-2 border-violet-300 flex flex-col items-center justify-center hover:scale-105 transition text-violet-800 text-xl font-bold"
                        onClick={() => setStep(MODES.NAPLAN)}
                    >
                        Take a Full NAPLAN Test (AI)
                        <span className="text-base text-gray-500 font-normal mt-3">
                            40 questions, AI-generated
                        </span>
                    </button>
                    <button
                        className="w-80 h-40 bg-gradient-to-br from-fuchsia-200 via-violet-50 to-violet-100 rounded-3xl shadow-2xl border-2 border-fuchsia-300 flex flex-col items-center justify-center hover:scale-105 transition text-fuchsia-700 text-xl font-bold"
                        onClick={() => setStep(MODES.ADAPTIVE_TOPIC)}
                    >
                        Adaptive Practice
                        <span className="text-base text-gray-500 font-normal mt-3">
                            Smart, topic-based, AI-powered learning
                        </span>
                    </button>
                </div>
                <button
                    className="mt-12 text-fuchsia-700 underline hover:text-fuchsia-900"
                    onClick={() => setStep(MODES.HOME)}
                >
                    &larr; Back to subject selection
                </button>
            </div>
        );
    }

    // 3. NAPLAN Practice
    if (step === MODES.NAPLAN && selectedSubject === "maths") {
        return <NaplanNumeracyPractice />;
    }

    // 4. Adaptive Topic Selection
    if (step === MODES.ADAPTIVE_TOPIC && selectedSubject === "maths") {
        return (
            <TopicSelector
                onSelect={id => {
                    setSelectedTopic({ 
                        id, 
                        name: id.charAt(0).toUpperCase() + id.slice(1), 
                        subtopic: null 
                    });
                    setStep(MODES.ADAPTIVE_PRACTICE);
                }}
            />
        );
    }

    // 5. Adaptive Practice
    if (step === MODES.ADAPTIVE_PRACTICE && selectedSubject === "maths" && selectedTopic) {
        return (
            <AdaptivePractice
                topic={selectedTopic.name}
                subtopic={selectedTopic.subtopic}
                topicName={selectedTopic.name}
                onComplete={(score, total) => {
                    setLastSession({ topic: selectedTopic.id, score, total });
                    setStep(MODES.DASHBOARD);
                }}
            />
        );
    }

    // 6. Dashboard
    if (step === MODES.DASHBOARD) {
        return (
            <Dashboard
                progress={progress}
                onRestart={() => setStep(MODES.ADAPTIVE_TOPIC)}
                lastTopicName={lastSession.topic}
                lastScore={lastSession.score}
                lastTotal={lastSession.total}
            />
        );
    }

    return null;
}

export default function App() {
    return (
        <StudentProvider>
            <MainApp />
        </StudentProvider>
    );
}
