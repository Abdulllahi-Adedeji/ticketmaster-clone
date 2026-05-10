import Link from "next/link";
import {EVENTS} from "../lib/events";
import "../styles/events.css";

export default function EventsPage() {

    // this creates a unique list of genres from all the events
    const genres = [...new Set(EVENTS.map(e => e.genre))]

    return (
        <div className="events-page">
            <h1 className="events-heading">Browse by genre</h1>
            <div className="genre-grid">
                {genres.map(genre => <GenreCard key={genre} genre={genre} events={EVENTS} />)}
            </div>
        </div>
    )
}

// a component to represent a single genre card
function GenreCard({ genre, events }) {

    // this filters events matching the current genre and ensures that only active events are included
    const genreEvents = events.filter(e => e.genre === genre && e.status === "active");

    // this uses the first event as a preview image
    const preview = genreEvents[0];

    return (
        <Link href={`/events/${genre.toLowerCase()}`} className="genre-card">
            <div className="genre-card-image">
                <img src={preview ? preview.imgURL : "https://placehold.co/400x200"} alt={genre} />
                <div className="genre-card-overlay">
                    <h2>{genre}</h2>
                    <p>{genreEvents.length} event{genreEvents.length !== 1 ? "s" : ""}</p>
                </div>
            </div>
        </Link>
    )
}