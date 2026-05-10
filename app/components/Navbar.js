"use client"

import Link from 'next/link'
import { useRouter } from "next/navigation"
import "../styles/navbar.css"

export default function Navbar() {

    const router = useRouter();

    async function handleLogout() {
        await fetch('/api/logout', { method : 'DELETE' })
        router.push('/sign-in')
    }

    return (
        <nav>
            <div className="container nav-inner">
                <Link href="/" className="nav-logo">Seatly</Link>
                <ul className="nav-links">
                    <li><Link href="/events">Events</Link></li>
                    <li><Link href="/dashboard">Dashboard</Link></li>
                    <li><Link href="/sign-in">Login</Link></li>
                    <li><Link href="/signup/attendee">SignUp as Attendee</Link></li>
                    <li><Link href="/signup/staff">SignUp as Staff</Link></li>
                    <li><Link href="/settings">Settings</Link></li>
                    <li><button className="nav-logout" onClick={handleLogout}>Logout</button></li>
                </ul>
            </div>
        </nav>
    )
}