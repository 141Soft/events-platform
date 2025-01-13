import React from "react";

export const EventThumb = ({image, name, stub}) => {


    return (
        <div>
            <p>{name}</p>
            <p>{stub}</p>
        </div>
    )
}