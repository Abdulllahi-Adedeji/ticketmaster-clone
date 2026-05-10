"use client";
import Link from 'next/link';
import "../styles/navbar.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const router = useRouter();
    const [role, setRole] = useState(null);

    useEffect(() => {
        async function checkSession() {
            const res = await fetch("/api/me");
            const data = await res.json();
            if(data.loggedIn) setRole(data.role);
        }
        checkSession();
    }, []);

    async function handleDashboard(){
        const res = await fetch ("/api/me");
        const data = await res.json();
        if(data.role === "attendee") router.push("/dashboard/attendee");
        if(data.role === "organiser") router.push("/dashboard/organiser");
        if(data.role === "admin") router.push("/dashboard/admin");
    }

    return (
        <nav>
            <div className="container nav-inner">
            <Link href="/" className="nav-logo">Seatly</Link>
                <ul className="nav-links">
                    <li><Link href="/events">Events</Link></li>
                    {role && <li><button onClick={handleDashboard}>Dashboard</button></li>}
                    {!role && <li><Link href="/sign-in">Login</Link></li>}
                    {!role && <li><Link href="/signup/attendee">Sign Up as Attendee</Link></li>}
                    {!role && <li><Link href="/signup/staff">Sign Up as Staff</Link></li>}
                    {role && <li><Link href="/settings">Settings</Link></li>}
                </ul>
            </div>
        </nav>
    )
}