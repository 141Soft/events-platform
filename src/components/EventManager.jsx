import React, { useEffect, useState } from "react";
import { getTags, postEvent } from "../api";


export const EventManager = ({ setDisplayAddEvent }) => {

    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventTime, setEventTime] = useState('');
    const [eventDuration, setEventDuration] = useState(1);
    const [eventDesc, setEventDesc] = useState('');
    const [eventStub, setEventStub] = useState('');
    const [eventThumbnail, setEventThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [searchTags, setSearchTags] = useState([
        'food','culture','literature','local','members','music','art'
    ]);
    const [selectedTags, setSelectedEventTags] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadTags = async () => {
            try {
                const data = await getTags();
                setSearchTags(prev => [...prev, ...data.tags.filter((tag) => !prev.includes(tag) && tag !== "")]);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Tag loading failed');
            }
        }
        loadTags();
    }, []);

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

    const handleTagChange = (e) => {
        if(selectedTags.includes(e.target.value)){
            const filteredTags = selectedTags.filter((tag) => tag !== e.target.value);
            setSelectedEventTags([...filteredTags]);
        } else if(selectedTags.length < 3) {
            setSelectedEventTags(prev => [...prev, e.target.value]);
        }
    }

    const formatDateTime = (date, time) => {
        const dateTime = `${date}T${time}:00`;
        return dateTime;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
            //assemble the form data here
            const formData = new FormData();
            formData.append('image', eventThumbnail);
            formData.append('eventName', eventName);
            formData.append('eventDesc', eventDesc);
            formData.append('eventStub', eventStub);
            formData.append('eventTags', selectedTags);
            formData.append('eventDate', formatDateTime(eventDate, eventTime));
            formData.append('eventDuration', eventDuration);
        try{
            const response = await postEvent(formData);
            setEventName('');
            setEventDate('');
            setEventDesc('');
            setEventStub('');
            setEventDuration(1);
            setEventThumbnail(null);
            setPreviewUrl(null);
            setSelectedEventTags([]);
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    }


    return(
        <div className="event-manager">
            <button onClick={() => setDisplayAddEvent(false)}>✕</button>
            <div className="event-manager-container">
                <h1>Create Event</h1>
                <form className="create-event" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Title</label>
                        <input
                            type="text" 
                            id="eventName" 
                            value={eventName} 
                            onChange={(e) => setEventName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="image-upload">Thumbnail</label>
                        { previewUrl ? <img src={previewUrl} alt="Preview"/> : '' }
                        <input
                            type="file" 
                            id="image-upload" 
                            accept="image/*" 
                            onChange={handleThumbChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="stub">Stub</label>
                        <input
                            type="text" 
                            id="eventStub" 
                            value={eventStub} 
                            onChange={(e) => setEventStub(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            type="text" 
                            id="eventDesc"
                            value={eventDesc} 
                            onChange={(e) => setEventDesc(e.target.value)} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor="date">When</label>
                        <input
                            type="date"
                            id="eventDate"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="time">Start Time</label>
                        <input 
                            type="time" 
                            id="eventTime" 
                            value={eventTime}
                            onChange={(e) => setEventTime(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration">Duration (hours)</label>
                        <input 
                            type="number"
                            name="duration" 
                            id="eventDuration" 
                            value={eventDuration}
                            onChange={(e) => setEventDuration(e.target.value)}
                            min="1" 
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="tags">Tags</label>
                        <select
                            id="select-tags" 
                            multiple
                            size={5} 
                            value={selectedTags}
                            onChange={handleTagChange}
                            required
                            >
                            {searchTags.map((tag, index) => 
                                <option key={index} value={tag}>{tag}</option>
                            )}
                        </select>
                    </div>
                    <button type="submit">Submit Event</button>
                </form>
            </div>
        </div>
    )

}