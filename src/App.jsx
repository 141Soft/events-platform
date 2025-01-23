import './App.css'
import { EventList } from './components/EventList'
import React, { useState } from 'react';

function App() {

  //For displaying errors in UI
  const [error, setError] = useState();
  
  //for testing
  const searchParams = {};
  

  return (
    <>
      <EventList searchParams={searchParams}/>
    </>
  )
}

export default App
