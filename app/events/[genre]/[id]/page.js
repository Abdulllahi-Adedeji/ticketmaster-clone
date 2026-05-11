"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { getEventById, getSpotsLeft, formatDate, formatTime } from "../../../lib/events"
import "../../../styles/event-detail.css";

export default function EventDetailPage({ params }) {

    // this extracts the genre and id from the route params
    const { genre, id } = use(params);

    const [event, setEvent] = useState(getEventById(id));
    const [spotsLeft, setSpotsLeft] = useState(null);
    const [loading, setLoading] = useState(!getEventById(id));

    useEffect(() => {
        const staticEvent = getEventById(id);

        // this uses the static event data if it exists
        if (staticEvent) {
            setEvent(staticEvent);
            setSpotsLeft(getSpotsLeft(staticEvent));
            setLoading(false);
            return;
        }

        // this fetches the event from the database if its not in the static list
        async function loadEvent() {
            const res = await fetch(`/api/event/${id}`);
            const data = await res.json();
            if (data.success) {
                setEvent(data.event);
                setSpotsLeft(getSpotsLeft(data.event));
            }
            setLoading(false);
        }
        loadEvent();
    }, [id]);

    if (loading) {
        return <p className="not-found">Loading...</p>
    }

    // if no event is found display event not found
    if (!event) {
        return <p className="not-found">Event not found.</p>
    }

    const soldOut = spotsLeft === 0;
    const lowStock = spotsLeft > 0 && spotsLeft <= 15;

    // component for displaying ticket availability status
    function StatusBadge() {
        if (soldOut) {
            return <span className="badge badge-sold">Sold Out</span>
        }
        if (lowStock) {
            return <span className="badge badge-low">Almost gone - {spotsLeft} left</span>
        }
        return null;
    }

    // component for rendering the ticket action button
    function TicketButton() {
        if (soldOut) {
            return <button className="cta-btn cta-disabled" disabled>Sold out</button>
        }
        return <Link href={`/booking/${event.id}`} className="cta-btn">Get tickets</Link>
    }

    return (
        <div className="event-detail">
            <Link href={`/events/${genre}`} className="back-link">← Back to {genre}</Link>

            <div className="detail-header">
                <div>
                    <h1>{event.name}</h1>
                    <p className="detail-sub">{event.stadium} · {event.location}</p>
                </div>
                <StatusBadge />
            </div>

            <div className="detail-body">
                <div className="detail-info">
                    <div className="info-block">
                        <span className="info-label">Date</span>
                        <span className="info-value">{formatDate(event.date)}</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">Time</span>
                        <span className="info-value">{formatTime(event.date)}</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">Stadium</span>
                        <span className="info-value">{event.stadium}</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">City</span>
                        <span className="info-value">{event.location}</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">Genre</span>
                        <span className="info-value">{event.genre}</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">Capacity</span>
                        <span className="info-value">{event.capacity} total · {spotsLeft} left</span>
                    </div>

                    <div className="info-block">
                        <span className="info-label">Price</span>
                        <span className="info-value price">€{Number(event.price).toFixed(2)}</span>
                    </div>
                </div>

                <p className="detail-description">{event.description}</p>

                <TicketButton />
            </div>
        </div>
    )
}
