import React from "react";

export const EventThumb = ({ event }) => {
    return (
        <div>
            <p>{event.eventName}</p>
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
}