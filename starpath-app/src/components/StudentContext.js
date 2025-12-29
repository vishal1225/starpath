import React, { createContext, useContext, useState } from "react";
export const StudentContext = createContext();

export function useStudent() {
    return useContext(StudentContext);
}

export function StudentProvider({ children }) {
    const [student, setStudent] = useState(null);
    return (
        <StudentContext.Provider value={{ student, setStudent }}>
            {children}
        </StudentContext.Provider>
    );
}
