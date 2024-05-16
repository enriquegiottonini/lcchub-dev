"use client";

import { useMsal } from "@azure/msal-react";
import { Student } from "@/lib/types";
import { getStudentById } from "@/lib/api/student-by-id";
import { createContext, useState, useEffect } from "react";

export const StudentInfoContext = createContext<Student | null>(null);

export default function ProfileLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const { accounts } = useMsal();
    const studentAccount = accounts[0];
    const studentId = studentAccount.username.split("@")[0].substring(1);
    const [student, setStudent] = useState<Student | null>(null);
  
    useEffect(() => {
      getStudentById(studentId).then((student) => {
        setStudent(student);
      });
    }, [studentId]);

    return (
        <StudentInfoContext.Provider value={student}>
            {children}
        </StudentInfoContext.Provider>
    )
}