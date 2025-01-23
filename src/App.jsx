import './App.css'
import { EventList } from './components/EventList'
import React, { useState } from 'react';

function App() {

  //For displaying errors in UI
  const [error, setError] = useState();
  
  //for testing
  //params: id, name, tag, paginate, page, limit
  const [searchParams, setSearchParams] = useState({paginate: true, page: 3, limit: 2})
  

  return (
    <>
      <EventList searchParams={searchParams} setSearchParams={setSearchParams} setError={setError}/>
    </>
  )
}

export default App
