"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";

interface Post {
    did: string;
    time_us: number;
    langs: string[];
    text: string;
    classification: {
        label: string;
        score: number;
    };
    location?: string;
}

interface bskyPostResponse {
    createdAt: string;
    id: string;
    tweet_data: Post;
}

export default function NewPosts() {

    const [posts, setPosts] = useState<Post[]>();
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);

    async function fetchPosts() {
        try {
            const response = await fetch(`http://localhost:8000/tweets?page=${page}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            const mappedPosts = data.map((item: bskyPostResponse) => item.tweet_data);
            setPosts(mappedPosts);
            setError(null);
        } catch (error) {
            setError("Failed to fetch posts");
        }
    }

    if (error) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <Button onClick={() => {fetchPosts()}} className="mb-4">Load Posts</Button>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
    if (!posts || posts.length === 0) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <Button onClick={() => {fetchPosts()}} className="mb-4">Load Posts</Button>
            </div>
        );
    }
    return (
        <div className="w-full h-full overflow-y-auto">
            <Button onClick={() => {fetchPosts()}} className="mb-4">Load Posts</Button>
            {posts.map((post) => (
                <div key={post.text} className="border-b p-4">
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            backgroundColor: "#f1c40f",
                            color: "#222",
                            marginBottom: "0.5rem",
                            marginRight: "0.5rem"
                          }}>
                        {post.classification.label}, 
                        {post.classification.score.toFixed(2)}
                    </span>
                    <p className="text-sm text-gray-500">
                        {new Date(post.time_us / 1000).toLocaleString()} - {post.location || "Unknown Location"}
                    </p>
                    <p className="mt-2">{post.text}</p>
                    <p className="mt-1 text-xs text-gray-400">Languages: {post.langs.join(", ")}</p>
                </div>
            ))}
        </div>
    );
}
