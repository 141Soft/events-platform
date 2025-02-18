import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserProvider";
import { updateCalendar } from "../googleApi";
import { useGoogleLogin } from "@react-oauth/google";
import { formatDateTime } from "../utils/parsers";
import { getUser } from "../googleApi";
import { postEventParticipant, removeDBEvent } from "../api";

export const EventView = ({ events, setEvents, eventView, setEventView, listRef, joinedEvents, setJoinedEvents, setEventCount, hasCalendar, setHasCalendar }) => {

    const eventRef = useRef(null);
    const { user, setUser } = useContext(UserContext);
    const { adminUser } = useContext(UserContext);
    const [pressed, setPressed] = useState(false);
    const [pressedJoin, setPressedJoin] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [success, setSuccess] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);
    const [error, setError] = useState('');
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
        setSuccess(false);
        setTimeout(()=> {
            setEventView(null);
        }, 500);
    };

    const generateUser = async(response) => {
        const { data } = await getUser(response.access_token);
        setUser({...response, email: data.email, picture: data.picture});
        if(!response.scope.split(" ").includes('email')){
            setError("Please grant calendar access to use the calendar");
            setTimeout(()=>{setError('')}, 3000);
            setHasCalendar(false);
        } else {
            setHasCalendar(true);
        };
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
                if(res.status === 200){
                    setSuccess("Event added to Calendar!");
                    setTimeout(() => setSuccess(false), 3000)
                };
            };
            if(pressedJoin){
                const res = await postEventParticipant(eventView.id, user.email);
                setPressedJoin(false);
                if(res.status === 200){
                    setJoinedEvents(prev => [...prev, eventView.id]);
                    setSuccess("Event Joined!");
                    setTimeout(() => setSuccess(false), 3000);
                };
            };
        };
        retryPost();
    }, [user])

    const addEventToCalendar = async () => {
        try {
            if(!user?.access_token){
                const res = login();
                setPressed(true);
            };
            if(!hasCalendar && user?.access_token){
                setError("Calendar not connected");
                setTimeout(()=> setError(""), 3000);
                return false
            };
            const res = await updateCalendar(user.access_token, eventView);
            if(res.status === 200){
                setSuccess("Event added to Calendar!");
                setTimeout(() => setSuccess(false), 3000);
            };
        } catch (error) {
            if(user?.access_token){
                setError("failed to add event, code: " + error.message);
                setTimeout(()=> setError(""), 3000);
                console.error(error);
            }
        }
    }

    const joinEvent = async () => {
        try{
            if(!user?.email){
                const res = login();
                setPressedJoin(true);
            };
            if(!joinedEvents.includes(eventView.id) && !pressedJoin){
                const res = await postEventParticipant(eventView.id, user.email);
                if(res.data.status === 'failed'){
                    setError(res.data.msg);
                    setTimeout(()=> setError(''), 3000);
                    return false;
                } else if(res.status === 200){
                    setJoinedEvents(prev => [...prev, eventView.id]);
                    setSuccess("Event Joined!");
                    setTimeout(() => setSuccess(false), 3000);
                    
                };
            };
        } catch(error){
            console.error(error);
            throw error;
        }
    }

    const deleteEvent = async () => {
        if(isDeleted){
            setError('Event already deleted');
            setTimeout(()=>{setError('')}, 3000);
            return false;
        };
        try {
            setIsDeleted(true);
            const res = await removeDBEvent(eventView?.id);
            const i = events.findIndex((e) => e.id === eventView.id);
            const updatedEvents = events.filter((e) => e.id !== eventView.id);
            setSuccess(res.msg);
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
            setEvents(updatedEvents);
            setEventCount(prev => prev-=1);
        } catch (error) {
            console.error('Error deleting event:', error);
            setError('Failed to delete event, please try again.');
            setIsDeleted(false);
            setTimeout(()=>{
                setError('');
            }, 3000);
            throw error; 
        };
    };

    return (
        <div className="event-view">
            {success && eventView ? <div className="success-indicator">{success}</div> : ''}
            {error && eventView ? <p className="error-message">{error}</p> : ''}
            {isHidden ? '' : 
            <>
                <header>
                <h1 ref={eventRef} >{eventView.eventName}</h1>
                <button className="exit-button" onClick={handleClick}>✕</button>
                </header>
                <div className="event-view-details">
                    <div>
                        <div className="button-container">
                            <button className="join-event-button" title="Add Event to Calendar" disabled={isDeleted} onClick={addEventToCalendar}>
                                <img src="/assets/calendar.svg" alt="Calendar"/>
                            </button>
                            <button className="join-event-button" title="Join Event" disabled={joinedEvents.includes(eventView.id) || isDeleted} onClick={joinEvent}>
                                {joinedEvents.includes(eventView.id) ?
                                '✓'
                                :    
                                <img src="/assets/person-plus.svg" alt="Add Event"/>
                                }
                            </button>
                            {adminUser.isAdmin ? 
                            <button className="delete-event-button" title="Delete Event" disabled={!adminUser.isAdmin} onClick={deleteEvent}>
                                <img src="/assets/trash-can.svg" alt="Delete"/>
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