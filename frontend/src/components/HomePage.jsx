import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/hotels/";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmNhMWM2NWY0NzEwMDRlYWM5YzIzOSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NDA0MTU0NjgsImV4cCI6MTc0MDUwMTg2OH0.TnlRMmD-JV7G3q8gwXr9qNYcYaYF9iJAdansTMSoUvc";

const topDestinations = [
  { name: "New York", img: "https://images.unsplash.com/photo-1483653364400-eedcfb9f1f88?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmV3JTIweW9ya3xlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Miami", img: "https://images.unsplash.com/photo-1514214246283-d427a95c5d2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWlhbWl8ZW58MHx8MHx8fDA%3D" },
  { name: "San Francisco", img: "https://plus.unsplash.com/premium_photo-1673002094407-a72547fa791a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2FuJTIwZnJhbmNpc2NvfGVufDB8fDB8fHww" },
  { name: "Phoenix", img: "https://images.unsplash.com/photo-1558362380-0d84fba529f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGhvZW5peCUyMGNpdHl8ZW58MHx8MHx8fDA%3D" },
  { name: "Denver", img: "https://images.unsplash.com/photo-1617246405400-462cb1ab98ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVudmVyfGVufDB8fDB8fHww" },
];

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length > 1) {
      fetchHotels(searchTerm);
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm]);

  // Fetch hotel cities from API
  const fetchHotels = async (query) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { city: query, limit: 10 },
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        withCredentials: true,
      });

      // Extract unique city names
      const uniqueCities = [...new Set(response.data.map((hotel) => hotel.city))].map((city) => ({
        name: city,
      }));

      setFilteredCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    if (searchTerm) {
      navigate(`/search-results?city=${searchTerm}`);
    } else {
      alert("Please enter a destination before searching.");
    }
  };

  // Handle user typing input
  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clicking on suggested city
  const handleDestinationClick = (location) => {
    setSearchTerm(location.name);
    setFilteredCities([]); // Close dropdown
    navigate(`/search-results?city=${location.name}`);
  };

  return (
    <div className="flex flex-col items-center p-6 w-screen">
      {/* Search Box */}
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-4xl flex flex-col gap-4 border border-gray-300 relative">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter a destination"
            value={searchTerm}
            onChange={handleSearchInput}
            className="border border-gray-400 p-2 rounded w-full placeholder-gray-500 text-black"
          />
          {filteredCities.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded shadow-md w-full text-black absolute top-full left-0 z-50">
              {filteredCities.map((city, index) => (
                <li
                  key={index}
                  onClick={() => handleDestinationClick(city)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {city.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 border border-gray-400"
        >
          Search
        </button>
      </div>

      {/* Top Destinations */}
      <div className="mt-8 w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Top destinations</h2>
        <div className="flex overflow-x-auto space-x-4">
          {topDestinations.map((destination, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleDestinationClick(destination)}
            >
              <img
                src={destination.img}
                alt={destination.name}
                className="w-48 h-32 object-cover rounded-lg shadow-md"
              />
              <h3 className="text-lg font-semibold mt-2">{destination.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
