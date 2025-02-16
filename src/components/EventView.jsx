import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { updateCalendar } from "../googleApi";
import { useGoogleLogin } from "@react-oauth/google";
import { formatDateTime } from "../utils/parsers";
import { getUser } from "../googleApi";

export const EventView = ({ eventView, setEventView, listRef, setHasJoined, hasJoined, setError }) => {

    const eventRef = useRef(null);
    const { user, setUser } = useContext(UserContext);
    const { adminUser } = useContext(UserContext);
    const [pressed, setPressed] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { date, time } = formatDateTime(eventView.eventDate);

    useEffect(() => {
        if(eventRef.current && !hasScrolled){
            eventRef.current.scrollIntoView({behavior: 'smooth', block:'start'});
            setHasScrolled(true);
        }
    });

    const handleClick = async (e) => {
        e.preventDefault();
        listRef.current.scrollIntoView({behavior: 'smooth', block:'end', inline:'center'})
        setIsHidden(true);
        setTimeout(()=> {
            setEventView(null);
        }, 500);
    };

    const generateUser = async(response) => {
        const { data } = await getUser(response.access_token);
        setUser({...response, email: data.email, picture: data.picture});
    };

    const login = useGoogleLogin({
        onSuccess: async (response) => await generateUser(response),
        onError: (error) => {throw error},
        scope: 'https://www.googleapis.com/auth/calendar',
    });

    useEffect(() => {
        const retryPost = async () => {
            if(pressed){
                const res = await updateCalendar(user.access_token, eventView);
                setPressed(false);
                setHasJoined(prev => [...prev, eventView.eventName]);
                if(res.status === 200){
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000)
                };
            };
        };
        retryPost();
    }, [user])

    const joinEvent = async () => {
        try {
            if(!user?.access_token){
                const res = login();
                setPressed(true);
            } 
            if(!hasJoined.includes(eventView.eventName) && !pressed){
                const res = await updateCalendar(user.access_token, eventView);
                setHasJoined(prev => [...prev, eventView.eventName]);
                if(res.status === 200){
                    setSuccess(true);
                    setTimeout(() => setSuccess(false), 3000)
                };
            };
        } catch (error) {
            if(user?.access_token){
                setError("failed to add event, code: " + error.message);
                setTimeout(()=> setError(""), 3000);
                console.error(error);
            }
        }
    }

    const deleteEvent = async () => {
        try {

        } catch (error) {
            console.error(error);
            throw error; 
        }
    }

    return (
        <div className="event-view">
            {success ? <div className="success-indicator">Event Joined!</div> : ''}
            {isHidden ? '' : 
            <>
                <header>
                <h1 ref={eventRef} >{eventView.eventName}</h1>
                <button className="exit-button" onClick={handleClick}>✕</button>
                </header>
                <div className="event-view-details">
                    <div>
                        <div className="button-container">
                            <button className="join-event-button" title="Join Event" disabled={hasJoined.includes(eventView.eventName)} onClick={joinEvent}>{hasJoined.includes(eventView.eventName) ? '✓' : 
                                <svg width="1.5rem" height="1.5rem" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF">
                                    <path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.289 10 6 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
                                    <path d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                                </svg>
                            }</button>
                            {adminUser.isAdmin ? 
                            <button className="delete-event-button" title="Delete Event" disabled={!adminUser.isAdmin} onClick={deleteEvent}>
                                <svg width="1.5rem" height="1.5rem" viewBox="0 0 485 485" fill="#950606" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="67.224" width="350.535" height="71.81"/>
                                        <path d="M417.776,92.829H67.237V485h350.537V92.829H417.776z M165.402,431.447h-28.362V146.383h28.362V431.447z M256.689,431.447
                                            h-28.363V146.383h28.363V431.447z M347.97,431.447h-28.361V146.383h28.361V431.447z"/>
                                </svg>
                            </button>
                            : ''}
                        </div>
                        <div>
                            <br></br>
                            <p>Date: {date}</p>
                            <p>Time: {time} for {eventView.eventDuration} {eventView.eventDuration > 1 ? 'hours' : 'hour'} </p>
                            <p>Description: {eventView.eventStub}</p>
                        </div>
                    </div>
                    <img src={eventView.image}/>
                </div>
                <p className="event-view-body">{eventView.eventDesc}</p>
            </>
            }
        </div>
    )
}