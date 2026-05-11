"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { getEventById, getSpotsLeft, formatDate, formatTime } from "../../lib/events"
import "../../styles/booking.css"

export default function BookingPage({ params }) {

    const { id } = use(params)
    const [event, setEvent] = useState(getEventById(id))
    const [quantity, setQuantity] = useState(1)
    const [confirmed, setConfirmed] = useState(false)
    const [spotsLeft, setSpotsLeft] = useState(null)
    const [loading, setLoading] = useState(!getEventById(id))
    const [bookingError, setBookingError] = useState(null)

    useEffect(() => {
        const staticEvent = getEventById(id)
        if (staticEvent) {
            setEvent(staticEvent)
            setSpotsLeft(getSpotsLeft(staticEvent))
            setLoading(false)
            return
        }
        // not in static array — fetch from database
        async function loadFromDb() {
            const res = await fetch(`/api/event/${id}`)
            const data = await res.json()
            if (data.success) {
                setEvent(data.event)
                setSpotsLeft(getSpotsLeft(data.event))
            }
            setLoading(false)
        }
        loadFromDb()
    }, [id])

    if (loading) {
        return <p className="not-found">Loading...</p>
    }

    if (!event) {
        return <p className="not-found">Event not found.</p>
    }

    if (spotsLeft === 0) {
        return (
            <div className="not-found">
                <p>This event is sold out.</p>
                <Link href="/events">Back to events</Link>
            </div>
        );
    }

    async function handleSubmit(e) {
        e.preventDefault()

        const me = await fetch("/api/me")
        const meData = await me.json()

        if (!meData.loggedIn) {
            setBookingError("You must be logged in to book tickets.")
            return
        }

        const res = await fetch("/api/booking", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userID: meData.userID, eventID: event.id }),
        })
        const data = await res.json()

        if (!res.ok) {
            setBookingError(data.message || "Something went wrong. Please try again.")
            return
        }

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

    const total = Number(event.price) * quantity

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
                                <button type="button" onClick={() => setQuantity(q => q > 1 ? q - 1 : q)}>−</button>
                                <span>{quantity}</span>
                                <button type="button" onClick={() => setQuantity(q => q < spotsLeft ? q + 1 : q)}>+</button>
                            </div>
                            <p className="form-hint">{spotsLeft - quantity} tickets remaining after your selection</p>
                        </div>

                        {bookingError && <p className="form-error">{bookingError}</p>}
                        <button type="submit" className="submit-btn">Confirm booking</button>
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
                        <span>€{Number(event.price).toFixed(2)} × {quantity} ticket{quantity > 1 ? 's' : ''}</span>
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
