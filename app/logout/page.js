"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const router = useRouter();

    async function handleLogout() {
        const res = await fetch("/api/logout", {
            method: "POST",
        });

        const data = await res.json();

        if (data.success) {
            router.push("/");
            router.refresh();
        }
    }

    return (
        <main className="page">
            <div className="form">
                <h1>Log Out</h1>
                <p>Are you sure you want to log out?</p>

                <button onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </main>
    );
}