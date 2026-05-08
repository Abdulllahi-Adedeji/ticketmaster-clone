import Link from 'next/link'
import "../styles/navbar.css"

export default function Navbar() {
    return (
        <nav className="navbar">
            <Link href="/" className="nav-logo">Placeholder Name</Link>
            <ul className="nav-links">
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/login" className="nav-btn">Login/Register</Link></li>
            </ul>
        </nav>
    )
}