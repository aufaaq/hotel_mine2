import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/hotels/";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YmNhMWM2NWY0MDRlYWM5YzIzOSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE3NDA0MTU0NjgsImV4cCI6MTc0MDUwMTg2OH0.TnlRMmD-JV7G3q8gwXr9qNYcYaYF9iJAdansTMSoUvc";

function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchCity = params.get("city"); // Get city from query params
  const sortBy = params.get("sortBy");
  const order = params.get("order");

  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchCity) {
      fetchHotels(searchCity, sortBy, order);
    }
  }, [searchCity, sortBy, order]);

  // Fetch hotels based on city (and sorting if applied)
  const fetchHotels = async (city, sortBy, order) => {
    try {
      const response = await axios.get(API_BASE_URL, {
        params: { city, sortBy, order },
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
        withCredentials: true,
      });

      setHotels(response.data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
    }
  };

  // Handle hotel click (navigate to hotel details)
  const handleHotelClick = (hotelId) => {
    navigate(`/hotel/${hotelId}`);
  };

  // Handle sorting by price
  const handleSortByPrice = () => {
    params.set("sortBy", "cheapestPrice");
    params.set("order", "asc");
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="p-6 w-300 mx-auto">
      <h1 className="text-xl font-bold mb-4">Hotels in {searchCity}</h1>

      {/* Show sort button only if hotels exist */}
      {hotels.length > 0 && (
        <button
          onClick={handleSortByPrice}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Sort by Price (Lowest First)
        </button>
      )}

      {hotels.length > 0 ? (
        hotels.map((hotel) => (
          <div
            key={hotel._id}
            className="bg-white p-4 shadow-lg rounded-lg border border-gray-300 flex mb-4 cursor-pointer"
            onClick={() => handleHotelClick(hotel._id)}
          >
            <img
              src={hotel.photos?.[0] || "https://via.placeholder.com/150"}
              alt={hotel.name}
              className="w-48 h-32 object-cover text-gray-600 rounded-md"
            />
            <div className="ml-4">
              <h2 className="text-lg text-gray-600 font-semibold">{hotel.name}</h2>
              <p className="text-gray-600">{hotel.address}, {hotel.state}, {hotel.country}</p>
              <p className="text-lg text-gray-600 font-bold">⭐ {hotel.rating || "N/A"}</p>
              <p className="text-gray-500 italic">{hotel.title}</p>
              <p className="text-gray-600">{hotel.description}</p>
              <p className="text-blue-600 font-semibold">{hotel.offerings?.join(", ")}</p>
            </div>
          </div>
        ))
      ) : (
        <p>No hotels found in {searchCity}.</p>
      )}
    </div>
  );
}

export default SearchResults;
