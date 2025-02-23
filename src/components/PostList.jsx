import React, { useState, useEffect } from "react";
import axios from "axios";

/**
 * PostList Component
 * ------------------
 * Displays the top 10 "hot" posts from a subreddit.
 * Allows users to add or remove posts from their favourites.
 *
 * Props:
 * - subreddit: The subreddit to fetch posts from.
 * - favourites: Array of favourite post IDs.
 * - setFavourites: Function to update the favourites list.
 */
const PostList = ({ subreddit, favourites, setFavourites }) => {
    const [posts, setPosts] = useState([]); // Store fetched posts
    const [loading, setLoading] = useState(false); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        if (subreddit) fetchPosts();
    }, [subreddit]);

    /**
     * Fetches top 10 hot posts from Reddit API.
     * Displays a loading spinner and handles errors.
     */
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`https://www.reddit.com/r/${subreddit}/hot.json?limit=10`);
            setPosts(response.data.data.children);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setError("Couldn't load posts. Please check the subreddit name and try again.");
        } finally {
            setLoading(false);
        }
    };

    /**
     * Handles adding or removing a post from favourites.
     * If the post is already favourited, it removes it; otherwise, it adds it.
     */
    const toggleFavourite = (postId) => {
        const updatedFavourites = favourites.includes(postId)
            ? favourites.filter((id) => id !== postId) // Remove ID
            : [...favourites, postId]; // Add ID
        setFavourites(updatedFavourites); // Update favourites in state
        localStorage.setItem("favourites", JSON.stringify(updatedFavourites)); // Store IDs using Web Storage API
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Top 10 Posts in r/{subreddit}</h2>
            {loading && <p className="text-blue-600">Loading posts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {posts.map((post) => (
                    <li
                        key={post.data.id}
                        className="border border-gray-300 p-4 rounded-lg shadow-sm hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{post.data.title}</p>
                                <p className="text-gray-600">Score: {post.data.score}</p>
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
                                onClick={() => toggleFavourite(post.data.id)}
                                className={`ml-4 px-4 py-2 rounded-lg font-medium text-white ${favourites.includes(post.data.id) ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                                    } transition`}
                            >
                                {favourites.includes(post.data.id) ? "Remove" : "Add"}
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PostList;
