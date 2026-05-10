    "use client";
    import Link from 'next/link';
    import "../styles/navbar.css";
    import { useEffect, useState } from "react";
    import { usePathname, useRouter } from "next/navigation";

    export default function Navbar() {
        const router = useRouter();
        const pathname = usePathname();
        const [usertype, setUserType] = useState(null);

        useEffect(() => {
            async function checkSession() {
                const res = await fetch("/api/me");
                const data = await res.json();
                if(data.loggedIn) {
                    setUserType(data.usertype);
                } else {
                    setUserType(null);
                }
            }
            checkSession();
        }, [pathname]);

        async function handleDashboard(){
            const res = await fetch ("/api/me");
            const data = await res.json();
            if(data.usertype === "attendee") router.push("/dashboard/attendee");
            if(data.usertype === "organiser") router.push("/dashboard/organiser");
            if(data.usertype === "admin") router.push("/dashboard/admin");
        }

        function LoggedOutLinks() {
            if (usertype) {
                return null
            }

            return (
                <>
                    <li><Link href="/sign-in" className="nav-btn">Login/Signup</Link></li>
                </>
            )
        }

        function LoggedInLinks() {
            if (!usertype) { 
                return null 
            }

            return (
                <>
                    <li><button className="nav-dashboard" onClick={handleDashboard}>Dashboard</button></li>
                    <li><Link href="/settings">Settings</Link></li>
                    <li><Link href="/logout" className="nav-logout">Logout</Link></li>
                </>
            )
        }

        return (
            <nav>
                <div className="container nav-inner">
                <Link href="/" className="nav-logo">Seatly</Link>
                    <ul className="nav-links">
                        <li><Link href="/events">Events</Link></li>
                        <LoggedOutLinks />
                        <LoggedInLinks />
                    </ul>
                </div>
            </nav>
        )
    }