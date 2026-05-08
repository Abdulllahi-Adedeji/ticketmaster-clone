import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
export default function Home(){
    return(
        <div>
            <h1>Welcome to Placeholder Name</h1>
            <p>Discover and book amazing events.</p>
            <Link href="/events">
                <button>Browse Events</button>
            </Link>
        </div>
    )
}