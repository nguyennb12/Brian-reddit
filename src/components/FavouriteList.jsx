import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * FavouriteList Component
 * -----------------------
 * Displays the list of favourited posts.
 * Fetches post data based on post IDs stored in favourites.
 *
 * Props:
 * - favourites: Array of favourited post IDs.
 * - setFavourites: Function to update the favourites list.
 */
const FavouriteList = ({ favourites, setFavourites }) => {
    const [favouritePosts, setFavouritePosts] = useState([]); // Store fetched favourite posts
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchFavouritePosts = async () => {
            setLoading(true);
            setError(null);
            try {
                const posts = await Promise.all(
                    favourites.map(async (id) => {
                        if (!id) return null; // Prevent fetching if ID is invalid
                        const response = await axios.get(`https://www.reddit.com/comments/${id}.json`);
                        return response.data[0]?.data?.children[0] ?? null; // Safely access post data
                    })
                );

                // Filter out null posts (in case of invalid IDs or failed fetches)
                setFavouritePosts(posts.filter((post) => post !== null));
            } catch (err) {
                console.error("Error fetching favourite posts:", err);
                setError("Failed to load favourite posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        if (favourites.length) {
            fetchFavouritePosts();
        } else {
            setFavouritePosts([]); // Clear posts if no favourites remain
        }
    }, [favourites]);

    /**
     * Removes a post from the favourites list.
     * Updates both state and localStorage.
     * @param {string} id - Post ID to remove.
     */
    const removeFavourite = (id) => {
        const updatedFavourites = favourites.filter((fav) => fav !== id);
        setFavourites(updatedFavourites);
        localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Favourite Posts</h2>
            {loading && <p className="text-blue-600">Loading favourite posts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && favouritePosts.length === 0 && <p>No favourites yet.</p>}

            <ul className="space-y-4">
                {favouritePosts.map((post) => (
                    <li
                        key={post.data.id}
                        className="border border-gray-300 p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between items-start">
                            <div className="w-3/4">
                                <p className="font-bold text-lg text-gray-800 mb-1">{post.data.title}</p>
                                <p className="text-gray-600 mb-2">Score: {post.data.score}</p>
                                <a
                                    href={`https://reddit.com${post.data.permalink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    View Comments
                                </a>
                            </div>
                            <button
                                onClick={() => removeFavourite(post.data.id)}
                                className="ml-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavouriteList;
