import { use } from "react"
import Link from "next/link"
import { getEventById, getSpotsLeft, formatDate, formatTime } from "../../../lib/events"
import "../../../styles/event-detail.css";

export default function EventDetailPage( {params} ) {

    // this extracts the genre and id from the route params using react's use
    const { genre, id } = use(params);

    // this fetches the event object based on the event id
    const event = getEventById(id);

    // if no events are found, it will display "event not found"
    if (!event) {
        return <p className="not-found">Event not found.</p>
    }


    const spotsLeft = getSpotsLeft(event);
    const soldOut = spotsLeft === 0;
    const lowStock = spotsLeft > 0 && spotsLeft <= 15;

    // component for displaying the ticket availability status
    function StatusBadge() {

        // this shows sold out if there's no available tickets
        if (soldOut) {
            return <span className="badge badge-sold">Sold Out</span>
        }

        // this shows almost gone if tickets are almost gone
        if (lowStock) {
            return <span className="badge badge-low">Almost gone - {spotsLeft} left</span>
        }

        // this returns nothing if tickets are available
        return null;
    }

    // component for rendering the ticket action button
    function TicketButton() {

        // this disables the button when the event is sold out
        if (soldOut) {
            return <button className="cta-btn cta-disabled" disabled>Sold out</button>

        }

        // this links the button to the booking page if the tickets are available
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
                        <span className="info-value price">€{event.price.toFixed(2)}</span>
                    </div>
                </div>

                <p className="detail-description">{event.description}</p>

                <TicketButton />
            </div>
        </div>
    )
}