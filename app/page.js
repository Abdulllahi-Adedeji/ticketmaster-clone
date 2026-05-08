import Link from "next/link"

export default function Home() {
    return (
        <div>
            <h1>Welcome to Placeholder Name</h1>
            <p>Discover and book amazing events.</p>
            <Link href="/events">
                <button>Browse Events</button>
            </Link>
        </div>
    );
}