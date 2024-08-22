import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';


const Home = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);
  
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/rooms');
      console.log('Rooms:', response.data);
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const handleRoomClick = (roomId) => {
    navigate(`/room/${roomId}`);
  };



const getRoomColor = (index) => {
    const colors = ['#FFF4E6', '#FFE8CC', '#FFD8A8', '#FFC078', '#FFA94D']; 
    return colors[index % colors.length]; 
  };
  return (
    <div className="home-container">
      <h1>Room Availability Management</h1>
      <div className="floor-plan-container">
        {rooms.length > 0 ? (
      <svg
      width="1000"
      height="400"
      viewBox="0 0 700 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      {rooms.map((room, index) => (
        <g key={room.id} className="room-group">
          <rect
            x={50 + index * 130}
            y={100}
            width="100"
            height="100"
            fill={getRoomColor(index)} 
            stroke="#000"
            strokeWidth="1"
            className="room-rect"
            onClick={() => handleRoomClick(room.id)}
          />
          <text
            x={100 + index * 130}
            y={160}
            textAnchor="middle"
            fill="#000"
            fontSize="16"
            pointerEvents="none"
          >
            {room.name}
          </text>
        </g>
      ))}
    </svg>
    
        ) : (
          <p>Loading rooms...</p>
        )}
      </div>
    </div>
  );
  
};

export default Home;
