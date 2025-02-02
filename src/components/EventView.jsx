import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { updateCalendar } from "../googleApi";
import { useGoogleLogin } from "@react-oauth/google";

export const EventView = ({ eventView, setEventView, listRef, setHasJoined, hasJoined }) => {

    const eventRef = useRef(null);
    const { user, setUser } = useContext(UserContext);
    const [pressed, setPressed] = useState(false);

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

    const login = useGoogleLogin({
        onSuccess: (response) => setUser(response),
        onError: (error) => {throw error},
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    useEffect(() => {
        const retryPost = async () => {
            if(pressed){
                await updateCalendar(user.access_token, eventView);
                setPressed(false);
                setHasJoined(prev => [...prev, eventView.eventName]);
            };
        };
        retryPost();
    }, [user])

    const joinEvent = async () => {
        try {
            if(!user?.access_token){
                login();
                setPressed(true);
            } 
            if(!hasJoined.includes(eventView.eventName) && !pressed){
                await updateCalendar(user.access_token, eventView);
                setHasJoined(prev => [...prev, eventView.eventName]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="event-view">
            <button className="exit-button" onClick={handleClick}>✕</button>
            <h1 ref={eventRef} >{eventView.eventName}</h1>
            <p>{eventView.eventDesc}</p>
            <button className="join-event-button" disabled={hasJoined.includes(eventView.eventName)} onClick={joinEvent}>{hasJoined.includes(eventView.eventName) ? '✓' : 
                <svg width="1rem" height="1rem" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#a47864" className="person-plus">
                <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                <path d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
              </svg>
                }</button>
            <div className="placeholder"></div>
        </div>
    )
}