import Link from 'next/link'
export default function Navbar() {
    return (
        <nav className="navbar">
            <Link href="/" className="nav-logo">Placeholder Name</Link>
            <ul className="nav-links">
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/sign-in" className="nav-btn">Login</Link></li>
                <li><Link href="/signup/attendee" className="nav-btn">SignUp as Attendee</Link></li>
                <li><Link href="/signup/staff" className="nav-btn">SignUp as Staff</Link></li>
            </ul>
        </nav>
    )
}