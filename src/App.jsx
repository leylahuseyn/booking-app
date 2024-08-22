import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import RoomDetails from './pages/RoomDetails/RoomDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:roomId" element={<RoomDetails />} />
    </Routes>
  );
}

export default App;
