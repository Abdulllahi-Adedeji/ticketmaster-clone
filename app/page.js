"use client"

import { useState } from "react";

// imports the mock event data and the helper functions for it
import { EVENTS } from "./lib/events";
import EventCard from "./components/EventCard"; 

export default function Home() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");

    // creates a unique list of cities from the event data
    const cities = [...new Set(EVENTS.map(e => e.location))]

    // filters events based on the search query, city and the active status
    const filtered = EVENTS.filter(e => {

        // matches artist name or stadium name
        const matchesQuery = 
            query === "" ||
            e.name.toLowerCase().includes(query.toLowerCase()) ||
            e.stadium.toLowerCase().includes(query.toLowerCase())
        
        // matches selected city
        const matchesCity = city === "" || e.location === city
        
        // returns only events that satisfy all the conditions
        return matchesQuery && matchesCity && e.status === "active"
    })

    return (
        <div className="home">
            <section className="hero">
                <h1>Find your next concert</h1>
                <p>Book tickets for live music near you</p>
            </section>

            <section className="search-bar">
                <input
                    type="text"
                    placeholder="Search by artist or venue"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="search-input"
                />
                
                <select value={city} onChange={e => setCity(e.target.value)} className="search-select">
                    <option value="">All cities</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </section>

            <section className="events-section">
                <p className="results-count">{filtered.length} events found</p>

                {filtered.length === 0 && <p className="no-results">No concerts match your search.</p>}

                {filtered.length > 0 && (
                    <div className="events-grid">
                        {filtered.map(event => <EventCard key={event.id} event={event} />)}
                    </div>
                )}
            </section>
        </div>
    )
}
