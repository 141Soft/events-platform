import React, { useEffect } from "react";

export const EventView = ({ eventView, setEventView }) => {

    useEffect(() => {
    });

    const handleClick = (e) => {
        e.preventDefault();
        setEventView(null);
    };

    return (
        <div className="event-view">
            <button className="exit-button" onClick={handleClick}>✕</button>
            <h1>{eventView.eventName}</h1>
            <p>{eventView.eventDesc}</p>
        </div>
    )
}