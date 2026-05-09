import Link from "next/link"
import { getSpotsLeft, formatDate } from "../lib/events"

export default function EventCard( {event} ) {

    // this calculates remaining ticket availability
    const spotsLeft = getSpotsLeft(event)

    // determines the ticket status (sold out if there's 0 tickets, low stock if there's 1-15 tickets)
    const soldOut = spotsLeft === 0
    const lowStock = spotsLeft > 0 && spotsLeft <= 15

    let cardClass = "event-card"
    if (soldOut) {
        cardClass = "event-card sold-out"
    }

    let btnClass = "book-btn"

    if (soldOut) {
        btnClass = "book-btn book-btn-disabled"
    }

    let btnText = "View"

    if (soldOut) {
        btnText = "Sold Out"
    }

    function handleClick(e) {
        if (soldOut) {
            e.preventDefault();
        }
    }

    return (
        <div className={cardClass}>
            <div className="event-card-top">
                <span className="event-city">{event.location}</span>
                {soldOut && <span className="badge badge-sold">Sold out</span>}
                {lowStock && <span className="badge badge-low">Almost gone</span>}
            </div>
            <h3 className="event-title">{event.name}</h3>
            <p className="event-venue">{event.stadium}</p>
            <p className="event-date">{formatDate(event.date)}</p>
            <div className="event-card-bottom">
                <span className="event-price">€{event.price.toFixed(2)}</span>
                <Link href={`/events/${event.id}`} className={btnClass} onClick={handleClick}>
                    {btnText}
                </Link>
            </div>
        </div>
    )
}
