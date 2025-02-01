import React, { useEffect } from "react";

export const MemoEventThumb = React.memo(function EventThumb({ event, index, middleIndex, setEventView }) {
    
    return (
        <div className="event-thumb">
            <h1>{event.eventName}</h1>
            <p>{event.eventStub}</p>
            <ul className='et-tags'>
                {
                    event.tags.map((tag, index)=> 
                        <li className='tag' key={ index }>{tag}</li>
                    )
                }
            </ul>
        </div>
    )
})