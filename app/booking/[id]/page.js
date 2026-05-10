"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { getEventById, getSpotsLeft, formatDate, formatTime } from "../../lib/events"
import "../../styles/booking.css"

export default function BookingPage({ params }) {

    const { id } = use(params)
    const event = getEventById(id)
    const [quantity, setQuantity] = useState(1)
    const [confirmed, setConfirmed] = useState(false)
    const [spotsLeft, setSpotsLeft] = useState(null)

    // this runs whenever the page loads or the event id changes
    useEffect(() => {

        // this calculates remaining spots for the event
        setSpotsLeft(getSpotsLeft(event))
    }, [id])

    // if the event does not exist
    if (!event) {
        return <p className="not-found">Event not found.</p>
    }

    // this shows loading message until the spots are calculated
    if (spotsLeft === null) {
        return <p className="not-found">Loading...</p>
    }

    // this calculates if there's no tickets available
    if (spotsLeft === 0) {
        return (
        <div className="not-found">
            <p>This event is sold out.</p>
            <Link href="/events">Back to events</Link>
        </div>
        );
    }

    function handleSubmit(e) {
        e.preventDefault()
        setConfirmed(true)
    }

    if (confirmed) {
        return (
        <div className="confirmation">
            <div className="confirm-icon">✓</div>
            <h2>Booking confirmed!</h2>
            <p>{quantity} ticket{quantity > 1 ? 's' : ''} for <strong>{event.name}</strong></p>
            <p className="confirm-sub">{formatDate(event.date)} · {formatTime(event.date)} · {event.stadium}, {event.location}</p>
            <Link href="/dashboard" className="confirm-link">Go to my bookings</Link>
        </div>
        )
    }

    // this calculates the total booking price
    const total = event.price * quantity

    return (
        <div className="booking-page">
        <Link href={`/events/${event.genre.toLowerCase()}/${event.id}`} className="back-link">← Back to event</Link>

        <div className="booking-layout">
            <div className="booking-form-card">
            <h2>Get tickets</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                <label className="form-label">Number of tickets</label>
                <div className="quantity-row">
                    <button type="button" onClick={() => setQuantity(q => { if (q > 1) { return q - 1 } return q })}>−</button>
                    <span>{quantity}</span>
                    <button type="button" onClick={() => setQuantity(q => { if (q < spotsLeft) { return q + 1 } return q })}>+</button>
                </div>
                <p className="form-hint">{spotsLeft - quantity} tickets remaining after your selection</p>
                </div>

                <button type="submit" className="submit-btn">Confirm booking</button>
                <p className="form-note">You must be logged in to complete this booking.</p>
            </form>
            </div>

            <div className="booking-summary">
            <h3>Order summary</h3>
            <div className="summary-event">
                <p className="summary-title">{event.name}</p>
                <p className="summary-meta">{event.stadium} · {event.location}</p>
                <p className="summary-meta">{formatDate(event.date)} · {formatTime(event.date)}</p>
            </div>
            <div className="summary-line">
                <span>€{event.price.toFixed(2)} × {quantity} ticket{quantity > 1 ? 's' : ''}</span>
                <span>€{total.toFixed(2)}</span>
            </div>
            <div className="summary-total">
                <span>Total</span>
                <span>€{total.toFixed(2)}</span>
            </div>
            </div>
        </div>
        </div>
    )
}