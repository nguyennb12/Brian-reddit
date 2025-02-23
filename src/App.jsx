import React, { useState, useEffect } from "react";
import PostList from "./components/PostList";
import FavouriteList from "./components/FavouriteList";

function App() {
  const [subreddit, setSubreddit] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [favourites, setFavourites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favourites")) || [];
    } catch (error) {
      console.error("Failed to parse favourites from localStorage.", error);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setSubreddit(searchQuery.trim());
    }
  };

  const resetApp = () => {
    setSubreddit("");
    setSearchQuery("");
  };

  const handleRemoveFavourite = (id) => {
    const updatedFavourites = favourites.filter((fav) => fav !== id);
    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gray-50 rounded-lg shadow-lg">
      <h1
        className="text-4xl font-bold text-center mb-6 text-blue-700 cursor-pointer hover:text-blue-800 transition"
        onClick={resetApp}
      >
        Reddit Favourites
      </h1>
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="Enter subreddit name and press Enter"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="border border-gray-300 p-3 w-3/4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => setSubreddit(searchQuery.trim())}
          className="bg-blue-600 text-white px-4 rounded-r-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </div>
      {subreddit && (
        <PostList
          subreddit={subreddit}
          favourites={favourites}
          setFavourites={setFavourites}
        />
      )}
      <FavouriteList
        favourites={favourites}
        setFavourites={setFavourites}
        removeFavourite={handleRemoveFavourite}
      />
    </div>
  );
}

export default App;
