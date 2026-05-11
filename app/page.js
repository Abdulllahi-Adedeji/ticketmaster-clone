"use client"

import { useState } from "react";
import "./styles/home.css";

// imports the mock event data and the helper functions for it
import { EVENTS, getSpotsLeft, formatDate } from "./lib/events";
import Link from "next/link"

export default function Home() {
    const [query, setQuery] = useState("");
    const [city, setCity] = useState("");

    // creates a unique list of cities from the event data
    const cities = [...new Set(EVENTS.map(e => e.location))];

    // an object used to group events by the artist name
    const artistMap = {};

    EVENTS.forEach(event => {

        // this ignores all the inactive events
        if (event.status !== "active") {
            return;
        }

        // this creates a new artist entry if it does not exist
        if (!artistMap[event.name]) {
            artistMap[event.name] = {
                name: event.name,
                imgURL: event.imgURL,
                genre: event.genre,
                events: []
            }
        }

        // this adds the event to the corresponding artist
        artistMap[event.name].events.push(event)
    });

    // this converts the artist map onto an array and applies the filters
    const artists = Object.values(artistMap).filter(artist => {

        // this checks if the search query matches the artist name
        const matchesQuery = query === "" || artist.name.toLowerCase().includes(query.toLowerCase());

        // this checks if the artist has events in the selected city
        const matchesCity = city === "" || artist.events.some(e => e.location === city);

        // this returns artists matching both filters
        return matchesQuery && matchesCity;
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
                    placeholder="Search by artist..."
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
                <p className="results-count">{artists.length} artist{artists.length !== 1 ? 's' : ''} found</p>
                <ArtistGrid artists={artists} />
            </section>
        </div>
    )
}

// a component to render the artist cards grid
function ArtistGrid({ artists }) {

    // shows a message when there's no artists with the matching filters
    if (artists.length === 0) {
        return <p className="no-results">No artists match your search.</p>
    }

    // this displays the artist cards
    return (
        <div className="events-grid">
            {artists.map(artist => <ArtistCard key={artist.name} artist={artist} />)}
        </div>
    )
}

// component to represent a single artist card
function ArtistCard({ artist }) {

    // this checks if all the artists' events are sold out
    const soldOut  = artist.events.every(e => getSpotsLeft(e) === 0)

    // this finds the lowest ticket prices
    const minPrice  = Math.min(...artist.events.map(e => Number(e.price)))

    let cardClass = "event-card";

    if (soldOut) { 
        cardClass = "event-card sold-out";
    }

    // a component to show that the artist/show is sold out
    function SoldOutBadge() {
        if (soldOut) { 
            return <span className="badge badge-sold">Sold out</span> 
        }

        return null;
    }

    return (
        <div className={cardClass}>

            <div className="event-card-image">
                <img src={artist.imgURL} alt={artist.name} />
                <div className="event-card-badges">
                <SoldOutBadge />
                </div>
            </div>

            <div className="event-card-body">
                <span className="genre-tag">{artist.genre}</span>
                <h3 className="event-title">{artist.name}</h3>
                <p className="event-venue">{artist.events.length} upcoming show{artist.events.length !== 1 ? 's' : ''}</p>
                <div className="event-card-bottom">
                    <span className="event-price">from €{minPrice.toFixed(2)}</span>
                    <Link href={`/events/${artist.genre.toLowerCase()}`} className="book-btn">View shows</Link>
                </div>
            </div>

        </div>
    );
}
