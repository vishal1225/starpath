import React, { useEffect, useState } from "react";
import { useStudent } from "./StudentContext";
import { studentApi } from "../api";

export default function StudentProfile() {
    const { student } = useStudent();
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            if (!student?._id) {
                setLoading(false);
                return;
            }

            try {
                const data = await studentApi.getProfile(student._id);
                setProfile(data);
            } catch (err) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, [student]);

    if (loading) {
        return (
            <div className="p-6 text-center">
                <div className="animate-pulse text-lg text-gray-500">Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-xl mx-auto mt-8 bg-red-50 shadow-xl rounded-2xl p-8 text-center">
                <div className="text-red-600 font-medium">{error}</div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="p-6 text-gray-500 text-center">No profile found.</div>
        );
    }

    return (
        <div className="max-w-xl mx-auto mt-8 bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-2">{profile.name}'s Profile</h2>
            <div className="mb-3 text-gray-500">
                Joined: {new Date(profile.created).toLocaleDateString()}
            </div>

            <div className="mb-5">
                <h3 className="font-bold mb-1">Achievements</h3>
                {profile.achievements?.length ? (
                    <ul className="list-disc list-inside">
                        {profile.achievements.map((ach, i) => (
                            <li key={i}>
                                <b>{ach.title}</b> ({new Date(ach.date).toLocaleDateString()})
                                <br />
                                <span className="text-sm">{ach.description}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-400">No achievements yet.</div>
                )}
            </div>

            <div>
                <h3 className="font-bold mb-1">Recent Progress</h3>
                {profile.scores?.length ? (
                    <ul>
                        {profile.scores.slice(-5).reverse().map((score, i) => (
                            <li key={i} className="py-1">
                                <b>{score.subject}</b> ({score.mode}) — {score.score}/{score.total}
                                <span className="ml-2 text-gray-400">
                                    on {new Date(score.date).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-gray-400">No progress yet.</div>
                )}
            </div>
        </div>
    );
}
