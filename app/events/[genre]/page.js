"use client";

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { EVENTS, getSpotsLeft, formatShortDate } from "../../lib/events"
import EventCard from "../../components/EventCard"
import "../../styles/genre.css"

export default function GenrePage({ params }) {

    // this extracts the genre from route params
    const { genre } = use(params);

    // this capitalizes the first letter of the genre for the display
    const genreLabel = genre.charAt(0).toUpperCase() + genre.slice(1);

    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");
    const [sort, setSort] = useState("date");
    const [dbEvents, setDbEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        async function loadDbEvents() {
            const res = await fetch(`/api/events?genre=${encodeURIComponent(genre)}`);
            const data = await res.json();
            setDbEvents((data.events || []).filter(e => e.status === "active"));
            setLoading(false);
        }
        loadDbEvents();
    }, [genre]);

    // static events for this genre
    const staticEvents = EVENTS.filter(e => e.genre.toLowerCase() === genre.toLowerCase() && e.status === "active");

    // merge: db events take precedence, static events fill in the rest
    const staticIds = new Set(dbEvents.map(e => e.id));
    const genreEvents = [...dbEvents, ...staticEvents.filter(e => !staticIds.has(e.id))];

    // this creates a unique list of cities from the events
    const cities = [...new Set(genreEvents.map(e => e.location))];

    // this filters each event based on search query and city
    const filtered = genreEvents.filter(e => {
        
        // matches search query against the event name or stadium
        const matchesQuery = query === "" || e.name.toLowerCase().includes(query.toLowerCase()) || e.stadium.toLowerCase().includes(query.toLowerCase());

        // matches the selected city
        const matchesCity = city === "" || e.location === city;

        // this returns events matching both filters
        return matchesQuery && matchesCity;
    })

    // this sorts events depending on selected sort options
    .sort((a, b) => {

        // this sorts by date
        if (sort === "date") {
            return new Date(a.date) - new Date(b.date);
        }

        // this sorts by ascending price
        if (sort === "price-asc") {
            return a.price - b.price;
        }

        // this sorts by descending price
        if (sort === "price-desc") {
            return b.price - a.price;
        }

        return 0;
    });

    // this selects the 4 trending events based on lowest spots left
    const trending = [...filtered]
        .sort((a, b) => getSpotsLeft(a) - getSpotsLeft(b))
        .slice(0, 4);
    
    if (loading) {
        return (
            <div className="genre-page">
                <Link href="/events" className="back-link">← Back to genres</Link>
                <p className="no-results">Loading events...</p>
            </div>
        );
    }

    if (genreEvents.length === 0) {
        return (
            <div className="genre-page">
                <Link href="/events" className="back-link">← Back to genres</Link>
                <p className="no-results">No events found in this genre.</p>
            </div>
        );
    }

    return (
        <div className="genre-page">
            <Link href="/events" className="back-link">← Back to genres</Link>

            <h1 className="genre-heading">{genreLabel}</h1>

            <section className="genre-section">
                <h2 className="section-heading">Trending</h2>
                <div className="trending-row">
                    {trending.map(event => <EventCard key={event.id} event={event} />)}
                </div>
            </section>

            <section className="genre-section">
                <h2 className="section-heading">All {genreLabel} Events</h2>

                <div className="filters">
                    <input  
                        type="text"
                        placeholder="Search artist or venue"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        className="filter-input"
                    />

                <select value={city} onChange={e => setCity(e.target.value)} className="filter-select">
                    <option value="">All cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <select value={sort} onChange={e => setSort(e.target.value)} className="filter-select">
                    <option value="date">Sort: Date</option>
                    <option value="price-asc">Sort: Price low–high</option>
                    <option value="price-desc">Sort: Price high–low</option>
                </select>

                </div>

                <EventsList filtered={filtered} genre={genre} />
            </section>
        </div>
    )
} 

function EventsList({ filtered, genre }) {
    if (filtered.length === 0) {
        return <p className="no-results">No events match your search.</p>
    }

    return (
        <div className="events-list">
            {filtered.map(event => <EventListRow key={event.id} event={event} genre={genre} />)}
        </div>
    )
} 

function EventListRow({ event, genre }) {
    const spotsLeft = getSpotsLeft(event);
    const soldOut = spotsLeft === 0;
    const lowStock = spotsLeft > 0 && spotsLeft <= 15;

    let rowClass = "event-list-row";
    
    if (soldOut) {
        rowClass = "event-list-row event-list-row-soldout";
    }

    let btnClass = "row-btn";

    if (soldOut) {
        btnClass = "row-btn row-btn-disabled";
    }

    function handleClick(e) {
        if (soldOut) {
            e.preventDefault();
        }
    }

    function SoldOutBadge() {
        if (soldOut) {
            return <span className="badge badge-sold">Sold out</span>;
        }

        return null;
    }

    function LowStockBadge() {
        if (lowStock) {
            return <span className="badge badge-low">Almost gone</span>;
        }

        return null;
    }

    return (
        <div className={rowClass}>
            <div className="event-list-row-date">
                <span>{formatShortDate(event.date)}</span>
            </div>

            <div className="event-list-row-info">
                <h3>{event.name}</h3>
                <p>{event.stadium} · {event.location}</p>
            </div>

            <div className="event-list-row-badges">
                <SoldOutBadge />
                <LowStockBadge />
            </div>

            <div className="event-list-row-action">
                <span className="event-price">€{Number(event.price).toFixed(2)}</span>
                <Link href={`/events/${genre}/${event.id}`} className={btnClass} onClick={handleClick}>View</Link>
            </div>
        </div>
    )
}