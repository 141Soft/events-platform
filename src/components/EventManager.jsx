import React, { useState } from "react";


export const EventManager = ({ setDisplayAddEvent }) => {

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDuration, setEventDuration] = useState(1);
    const [eventDesc, setEventDesc] = useState('');
    const [eventStub, setEventStub] = useState('');
    const [eventThumbnail, setEventThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState('');

    const handleThumbChange = (e) => {
        const selectedFile = e.target.files[0];
        setEventThumbnail(selectedFile);

        if(selectedFile){
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviewUrl('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

            //assemble the form data here


        try{
            //axios post event here
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    }


    return(
        <div className="Event-Manager">
            <button onClick={() => setDisplayAddEvent(false)}>✕</button>
            <div Event-Manager-Container>
                <h1>Create Event:</h1>
                <form className="Create-Event" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Event Title:</label>
                        <input
                            type="text" 
                            id="eventName" 
                            value={eventName} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="image-upload">Add Thumbnail:</label>
                        <input
                            type="file" 
                            id="image-upload" 
                            accept="image/*" 
                            onChange={handleThumbChange}
                        />
                        { previewUrl ? <img src={previewUrl} alt="Preview" style={{maxWidth: '5rem'}} /> : '' }
                    </div>
                    <div>
                        <label htmlFor="description">Add Description:</label>
                        <input
                            type="text" 
                            id="eventDesc" 
                            value={eventDesc} 
                            onChange={(e) => setEventDesc(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="stub">Add Stub:</label>
                        <input
                            type="text" 
                            id="eventStub" 
                            value={eventStub} 
                            onChange={(e) => setEventStub(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="date">When:</label>
                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time">Start Time:</label>
                        <input 
                            type="time" 
                            id="eventTime" 
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration (hours):</label>
                        <input 
                            type="number" 
                            id="eventDuration" 
                            value={eventDuration}
                            onChange={(e) => setEventDuration(e.target.value)}
                            min="1" 
                            required
                        />
                    </div>
                    <button type="submit">Submit Event</button>
                </form>
            </div>
        </div>
    )

}