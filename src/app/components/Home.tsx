import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/interceptor';
import '../scss/Home.scss';

interface User {
  isAuthenticated: boolean;
  name: string;
  email: string;
  roles: string[];
}

interface Trip {
  routeId: string;
  date: string;
  frequency: string;
  timing: string;
  fare: number;
  stops: { stop: string; time: string }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  busType: string; // Added busType field
}

const Home: React.FC = () => {
  const [user, setUser] = useState<User>({
    isAuthenticated: false,
    name: 'Guest',
    email: '',
    roles: []
  });
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchDate, setSearchDate] = useState('');
  const [busTypes, setBusTypes] = useState<string[]>(['AC']);
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      setUser(JSON.parse(cachedUser));
    }
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get(`/bus_trip/list?date=${searchDate}&busTypes=${busTypes.join(',')}&from=${fromLocation}&to=${toLocation}`);
      setTrips(response.data);
    } catch (error) {
      console.error('Failed to fetch trips', error);
    }
  };

  const handleBusTypeChange = (type: string) => {
    setBusTypes(prevBusTypes =>
      prevBusTypes.includes(type)
        ? prevBusTypes.filter(busType => busType !== type)
        : [...prevBusTypes, type]
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    handleSearch();
  };

  return (
    <div className="home-container">
      <div className="search-form">
        <div className="form-grid">
        <h2 style={{ gridColumn: '2 / 4' }}>Search for Trips</h2>
          <label style={{ gridColumn: '2 / 3' }}>
            From:
            <input
              type="text"
              value={fromLocation}
              onChange={e => setFromLocation(e.target.value)}
            />
          </label>
          <label style={{ gridColumn: '3 / 4' }}>
            To:
            <input
              type="text"
              value={toLocation}
              onChange={e => setToLocation(e.target.value)}
            />
          </label>
          <label style={{ gridColumn: '2 / 3' }}>
            Date:
            <input
              type="date"
              value={searchDate}
              onChange={e => setSearchDate(e.target.value)}
            />
          </label>
          <label style={{ gridColumn: '3 / 4' }}>
            <div>
              <label>
              AC:
                <input
                  type="checkbox"
                  checked={busTypes.includes('AC')}
                  onChange={() => handleBusTypeChange('AC')}
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={busTypes.includes('Sleeper')}
                  onChange={() => handleBusTypeChange('Sleeper')}
                />
                Sleeper:
              </label>
            </div>
          </label>
          <button className="search-button" style={{ gridColumn: '2 / 4' }} onClick={handleSearch}>Search</button>
        </div>
      </div>
      <div className="trip-results">
        <h2>Trip Results</h2>
        {trips.length > 0 ? (
          <div className="trip-cards">
            {trips.map(trip => (
              <div className="trip-card" key={trip.routeId}>
                <h3>Trip Details</h3>
                <p><strong>Date:</strong> {new Date(trip.date).toLocaleDateString()}</p>
                <p><strong>Timing:</strong> {trip.timing}</p>
                <p><strong>Fare:</strong> {trip.fare}</p>
                <p><strong>Bus Type:</strong> {trip.busType}</p>
                <p><strong>From:</strong> {trip.stops[0].stop}</p>
                <p><strong>To:</strong> {trip.stops[trip.stops.length - 1].stop}</p>
                <p><strong>Stops:</strong></p>
                <ul>
                  {trip.stops.map((stop, index) => (
                    <li key={index}>
                      {stop.stop} at {stop.time}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <p>No trips found</p>
        )}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;