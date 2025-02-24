import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import SearchResults from "./components/SearchResults";
import HotelDetail from "./components/HotelDetail";

function App() {
  return (
    <Router>  {/* Wrapping Routes with BrowserRouter */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
