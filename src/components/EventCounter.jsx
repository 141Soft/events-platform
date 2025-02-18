import React from "react";

export const EventCounter = ({events, eventCount, displayUserEvents, setDisplayUserEvents, setSearchParams, isLoading}) => {

    const handleClick = (e) => {
        e.preventDefault();
        setDisplayUserEvents(false);
        setSearchParams(prev => ({...prev}));
    };

    return (
        <>
            {displayUserEvents && !isLoading ?
            <div className="user-event-counter">
                <p className='event-counter'>You have {events.length} {events.length === 1 ? 'event' : 'events'}</p>
                <button onClick={handleClick}>✕</button>
            </div>
            :
            <p className='event-counter'>Browsing {eventCount} {eventCount === 1 ? 'event' : 'events'}</p>
            }
        </>
    )
}