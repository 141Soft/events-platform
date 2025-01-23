import React from "react";

export const EventThumb = ({ event }) => {


    return (
        <div>
            <p>{event.eventName}</p>
            <p>{event.eventStub}</p>
        </div>
    )
}