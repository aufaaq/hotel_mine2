import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Function to fetch popular locations from an API with query parameters
const fetchPopularLocations = (city) => {
  const accessToken = "your_access_token_here"; // Replace with the actual token
  const url = city ? `http://localhost:5000/api/hotels?city=${city}` : "http://localhost:5000/api/hotels"; // Add city query param if available

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`, // Correctly format the authorization header
      },
    })
    .then((response) => {
      return response.data || []; // Assuming the response contains an array of hotels
    })
    .catch((error) => {
      console.error("Error fetching locations data:", error);
      return [];
    });
};

function HomePage() {
  const [searchTerm, setSearchTerm] = useState(""); // city search term
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [guests, setGuests] = useState("");
  const [popularLocations, setPopularLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const navigate = useNavigate();

  // Fetch the popular locations data from the API based on search term (city)
  useEffect(() => {
    fetchPopularLocations(searchTerm).then((locations) => {
      setPopularLocations(locations);
    });
  }, [searchTerm]); // Run whenever searchTerm changes (city)

  const handleSearch = () => {
    // Ensure that all fields are filled before proceeding
    if (searchTerm && fromDate && toDate && guests) {
      navigate(
        `/search-results?query=${searchTerm}&from=${fromDate}&to=${toDate}&guests=${guests}`
      );
    } else {
      alert("Please fill in all fields before searching.");
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Fetch the filtered locations based on the search input (city)
    fetchPopularLocations(value).then((locations) => {
      setFilteredLocations(locations);
    });
  };

  const handleDestinationClick = (location) => {
    // When a location is clicked, populate the search input and clear filtered locations
    setSearchTerm(location.city);
    setFilteredLocations([]); // Clear suggestions after selection
  };

  // Sorting top destinations based on the number of accommodations
  const topDestinations = popularLocations
    .sort((a, b) => b.cheapestPrice - a.cheapestPrice) // Sorting based on price, but you can change this sorting criteria
    .slice(0, 5);

  return (
    <div className="flex flex-col items-center p-6 w-screen">
      <div className="bg-white shadow-lg p-6 rounded-lg w-full max-w-4xl flex flex-col gap-4 border border-gray-300 relative">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Enter a destination or property"
            value={searchTerm}
            onChange={handleSearchInput}
            className="border border-gray-400 p-2 rounded w-full placeholder-gray-500 text-black"
          />
          
          {/* Filtered suggestions based on user input */}
          {filteredLocations.length > 0 && (
            <ul className="bg-white border border-gray-300 rounded shadow-md w-full text-black absolute top-full left-0 z-50">
              {filteredLocations.map((loc, index) => (
                <li 
                  key={index} 
                  onClick={() => handleDestinationClick(loc)}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                >
                  {loc.city}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Date Inputs */}
        <div className="flex gap-4">
          <input
            type="date"
            placeholder="From Date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full placeholder-gray-500 text-black"
          />
          <input
            type="date"
            placeholder="To Date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border border-gray-400 p-2 rounded w-full placeholder-gray-500 text-black"
          />
        </div>

        {/* Guest Number Select */}
        <select
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className="border border-gray-400 p-2 rounded w-full placeholder-gray-500 text-black"
        >
          <option value="" disabled className="text-black">Number of Guests</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
            <option key={num} value={num} className="text-black">
              {`${num} ${num > 1 ? "adults" : "adult"}`}
            </option>
          ))}
        </select>

        {/* Search Button */}
        <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 border border-gray-400">
          Search
        </button>
      </div>

      {/* Top Destinations Section */}
      <h2 className="text-xl font-bold mt-8">Top destinations</h2>
      <div className="flex flex-wrap gap-12 mt-4 overflow-x-auto">
        {topDestinations.map((loc, index) => (
          <div 
            key={index} 
            className="bg-white shadow-lg rounded-lg p-4 w-48 border border-gray-300 cursor-pointer"
            onClick={() => handleDestinationClick(loc)}
          >
            <img src={loc.photos[0]} alt={loc.name} className="w-full h-32 object-cover rounded-md" />
            <p className="font-semibold mt-2 text-black">{loc.name}</p>
            <span className="text-gray-600 text-sm text-black">{loc.cheapestPrice}$ per night</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
