import React, { useEffect, useRef, useState } from "react";

export const EventView = ({ eventView, setEventView, listRef }) => {

    const eventRef = useRef(null);
    const [hidden, setHidden] = useState(false);

    useEffect(() => {
        if(eventRef.current){
            eventRef.current.scrollIntoView({behavior: 'smooth', block:'start'});
        }
    });

    const handleClick = async (e) => {
        e.preventDefault();
        listRef.current.scrollIntoView({behavior: 'smooth', block:'end', inline:'center'})
        setTimeout(()=> {
            setEventView(null);
        }, 500);
    };

    return (
        <div className="event-view">
            <button className="exit-button" onClick={handleClick}>✕</button>
            <h1 ref={eventRef} >{eventView.eventName}</h1>
            <p>{eventView.eventDesc}</p>
            <div className="placeholder"></div>
        </div>
    )
}