import Link from 'next/link'
import "../styles/navbar.css";

export default function Navbar() {
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
                </ul>
            </div>
        </nav>
    )
}