import './App.css'
import { EventList } from './components/EventList'
import React, { useEffect, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { getTags } from './api';

function App() {

  //For displaying errors in UI
  const [error, setError] = useState();
  
  //params: id, name, tag, paginate, page, limit
  //pagination parameters are placed here for now
  const [searchParams, setSearchParams] = useState({paginate:true, limit:2, page: 1});
  const [eventCount, setEventCount] = useState(0);

  
  

  return (
    <>
      <SearchBar setSearchParams={setSearchParams} setError={setError}/>
      <p>We have {eventCount} events</p>
      <EventList searchParams={searchParams} setSearchParams={setSearchParams} setEventCount={setEventCount} setError={setError}/>
    </>
  )
}

export default App
