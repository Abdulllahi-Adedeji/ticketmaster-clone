"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EVENTS } from "../lib/events";
import "../styles/events.css";

export default function EventsPage() {
    const [dbEvents, setDbEvents] = useState([]);

    useEffect(() => {
        async function loadDbEvents() {
            const res = await fetch("/api/events");
            const data = await res.json();
            setDbEvents(data.events || []);
        }
        loadDbEvents();
    }, []);

    // merge static and db events, db takes precedence
    const staticIds = new Set(dbEvents.map(e => e.id));
    const allEvents = [...dbEvents, ...EVENTS.filter(e => !staticIds.has(e.id))];

    // unique genres across both sources
    const genres = [...new Set(allEvents.map(e => e.genre))];

    return (
        <div className="events-page">
            <h1 className="events-heading">Browse by genre</h1>
            <div className="genre-grid">
                {genres.map(genre => <GenreCard key={genre} genre={genre} events={allEvents} />)}
            </div>
        </div>
    );
}

function GenreCard({ genre, events }) {
    const genreEvents = events.filter(e => e.genre === genre && e.status === "active");
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
    );
}
