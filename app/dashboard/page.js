"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();

    // this checks the users type and redirects them to the correct dashboard
    useEffect(() => {
        async function redirectUser() {
            const res = await fetch("/api/me");
            const data = await res.json();

            if (!data.loggedIn) {
                router.push("/sign-in");
                return;
            }

            if (data.usertype === "attendee") router.push("/dashboard/attendee");
            if (data.usertype === "organiser") router.push("/dashboard/organiser");
            if (data.usertype === "admin") router.push("/dashboard/admin");
        }
        redirectUser();
    }, []);

    return null;
}
