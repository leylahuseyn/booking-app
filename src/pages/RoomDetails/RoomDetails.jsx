import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './RoomDetails.css';

const RoomDetails = () => {
  const { roomId } = useParams(); // URL-dən otağın ID-sini alırıq
  const [room, setRoom] = useState(null);
  const [newReservation, setNewReservation] = useState({
    reservedBy: '',
    from: '',
    to: '',
    notes: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoomDetails();
  }, []);

  const fetchRoomDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/rooms/${roomId}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReservation({ ...newReservation, [name]: value });
  };

  const isDateRangeAvailable = (from, to) => {
    return !room.reservations.some((reservation) => {
      const existingFrom = new Date(reservation.from);
      const existingTo = new Date(reservation.to);
      const newFrom = new Date(from);
      const newTo = new Date(to);

      return (
        (newFrom >= existingFrom && newFrom <= existingTo) ||
        (newTo >= existingFrom && newTo <= existingTo) ||
        (newFrom <= existingFrom && newTo >= existingTo)
      );
    });
  };

  const handleAddReservation = async (e) => {
    e.preventDefault();
    setError('');

    const { reservedBy, from, to } = newReservation;

    if (!reservedBy || !from || !to) {
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(from) > new Date(to)) {
      setError('"From" date cannot be later than "To" date.');
      return;
    }

    if (!isDateRangeAvailable(from, to)) {
      setError('Selected date range is not available.');
      return;
    }

    const newReservationObj = {
      id: room.reservations.length + 1,
      reservedBy,
      from,
      to,
      notes: newReservation.notes,
    };

    try {
      const updatedRoom = {
        ...room,
        reservations: [...room.reservations, newReservationObj],
      };

      await axios.put(`http://localhost:5000/rooms/${roomId}`, updatedRoom);
      setRoom(updatedRoom);
      setNewReservation({
        reservedBy: '',
        from: '',
        to: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };

  if (!room) return <p>Loading...</p>;

  return (
    <div className="room-details-container">
      <h2>{room.name} Details</h2>

      <h3>Reservations:</h3>
      {room.reservations.length > 0 ? (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Reserved By</th>
              <th>From</th>
              <th>To</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {room.reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.reservedBy}</td>
                <td>{res.from}</td>
                <td>{res.to}</td>
                <td>{res.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reservations for this room.</p>
      )}

      <h3>Add New Reservation:</h3>
      {error && <p className="error-message">{error}</p>}
      <form className="reservation-form" onSubmit={handleAddReservation}>
        <div className="form-group">
          <label>Reserved By:</label>
          <input
            type="text"
            name="reservedBy"
            value={newReservation.reservedBy}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>From:</label>
          <input
            type="date"
            name="from"
            value={newReservation.from}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>To:</label>
          <input
            type="date"
            name="to"
            value={newReservation.to}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <input
            type="text"
            name="notes"
            value={newReservation.notes}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Add Reservation</button>
      </form>
    </div>
  );
};

export default RoomDetails;
