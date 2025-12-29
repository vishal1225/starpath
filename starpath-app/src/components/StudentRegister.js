import React, { useState } from "react";
import { useStudent } from "./StudentContext";
import { studentApi } from "../api";

export default function StudentRegister({ onRegistered }) {
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { setStudent } = useStudent();

    async function handleRegister(e) {
        e.preventDefault();
        setError("");

        if (!name.trim()) {
            setError("Please enter your name");
            return;
        }

        setLoading(true);
        try {
            const data = await studentApi.register(name.trim());
            setStudent(data);
            if (onRegistered) onRegistered(data);
        } catch (err) {
            setError(err.message || "Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleRegister} className="max-w-sm mx-auto mt-16 p-8 bg-white shadow-xl rounded-2xl">
            <h2 className="text-xl font-bold mb-3">Welcome to StarPath</h2>
            <div className="mb-2">Please enter your name:</div>
            <input
                className="w-full border px-3 py-2 rounded-xl mb-4"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="First name"
                autoFocus
                disabled={loading}
            />
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <button 
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50"
                disabled={loading}
            >
                {loading ? "Loading..." : "Continue"}
            </button>
        </form>
    );
}
