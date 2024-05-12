import React, { useState } from 'react';
import './App.css';
import axios from 'axios'

const totalSeats = 80;
const seatsInRow = 7;
const lastRowSeats = 3;


const generateSeatNumbers = () => {
  let seatNumbers = [];
  let currentRow = 1;
  let seatInRowCount = 0;
  for (let i = 1; i <= totalSeats; i++) {
    seatNumbers.push({ id: i, row: currentRow });
    seatInRowCount++;
    if (seatInRowCount === (currentRow === Math.ceil(totalSeats / seatsInRow) ? lastRowSeats : seatsInRow)) {
      seatInRowCount = 0;
      currentRow++;
    }
  }
  return seatNumbers;
};

const initializeSeats = () => {
  const seatNumbers = generateSeatNumbers();
  return seatNumbers.map((seat) => ({
    ...seat,
    isBooked: false,
  }));
};

const App = () => {
  const [seats, setSeats] = useState(initializeSeats());
  const [selectedSeatCount, setSelectedSeatCount] = useState(1);

  const reserveSeats = () => {
    let seatsToBook = selectedSeatCount;
    const updatedSeats = [...seats];

    for (let i = 0; i < updatedSeats.length; i++) {
      if (!updatedSeats[i].isBooked) {
        updatedSeats[i].isBooked = true;
        seatsToBook--;

        if (seatsToBook === 0) break;
      }
    }
    axios.post('/v1/reservation/book', { email: 'test@gmail.com', seats: selectedSeatCount })
    .then((response) => {
      console.log(response.data.data.message); 
    })
    .catch((error) => {
      console.error('Error:', error.data.message);
    });
    setSeats(updatedSeats);
  };

  const handleDropdownChange = (event) => {
    const selectedCount = parseInt(event.target.value);
    setSelectedSeatCount(selectedCount);
  };

  return (
    <div className="seat-reservation-container">
      <h2>Coach Seat Reservation</h2>
      <div className="controls">
        <label>Select number of seats:</label>
        <select value={selectedSeatCount} onChange={handleDropdownChange}>
          {[...Array(7).keys()].map((count) => (
            <option key={count + 1} value={count + 1}>{count + 1}</option>
          ))}
        </select>
        <button className="reserve-button" onClick={reserveSeats}>Reserve Selected Seats</button>
      </div>
      <div className="seat-container">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.isBooked ? 'booked' : ''}`}
          >
            {seat.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
