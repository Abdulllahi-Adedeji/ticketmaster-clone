import Link from 'next/link'
<<<<<<< HEAD

=======
>>>>>>> 22f425f9f48e11e82080db000a03151170b26b4f
export default function Navbar() {
    return (
        <nav className="navbar">
            <Link href="/" className="nav-logo">Placeholder Name</Link>
            <ul className="nav-links">
                <li><Link href="/events">Events</Link></li>
                <li><Link href="/dashboard">Dashboard</Link></li>
                <li><Link href="/sign-in" className="nav-btn">Login/Register</Link></li>
            </ul>
        </nav>
    )
}