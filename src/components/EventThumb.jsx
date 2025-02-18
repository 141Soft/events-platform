import React, { useEffect, useRef } from "react";

export const MemoEventThumb = React.memo(function EventThumb({ event, isMiddle, listRef }) {
    
    const scrollToMiddle = (e) => {
        e.preventDefault();
        if(isMiddle){return false};
        if(!listRef.current){return false};

        const listRect = listRef.current.getBoundingClientRect();
        const itemRect = e.currentTarget.getBoundingClientRect();

        const listCenter = listRect.width / 2;
        const itemCenter = itemRect.width / 2;
        const scrollLeft = itemRect.left - listRect.left + itemCenter - listCenter;

        listRef.current.scrollTo({
            behavior: 'smooth',
            left: listRef.current.scrollLeft + scrollLeft,
            
        });
    };

    return (
        <div className="event-thumb" onClick={scrollToMiddle}>
            <h1>{event.eventName}</h1>
            <img src={event.image} height="250" width="250"/>
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