"use client";

import { useRouter } from "next/navigation";
import "../styles/logout.css"

export default function LogoutPage() {
    const router = useRouter();

    async function handleLogout() {
        const res = await fetch("/api/logout", {
            method: "POST",
        });

        const data = await res.json();

        if (data.success) {
            router.refresh();
            router.push("/");
        }
    }

    return (
        <main className="logout-page">
            <div className="logout-card">
                <h1>Log Out</h1>
                <p>Are you sure you want to log out?</p>

                <button onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </main>
    );
}