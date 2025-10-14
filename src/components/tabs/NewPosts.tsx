"use client";
import { useState } from "react";
import { Button } from "../ui/button";

interface Post {
    did: string;
    time_us: number;
    langs: string[];
    text: string;
    location?: string;
}

interface bskyPostResponse {
    createdAt: string;
    id: string;
    tweet_data: Post;
}

export default function NewPosts() {
    const dummyPosts: Post[] = [
        {
            did: "1",
            time_us: 1625247600000,
            langs: ["en"],
            text: "This is a sample post in English.",
            location: "New York, USA"
        },
        {
            did: "2",
            time_us: 1625334000000,
            langs: ["en"],
            text: "Another example of a post.",
            location: "London, UK"
        },
        {
            did: "3",
            time_us: 1625420400000,
            langs: ["en"],
            text: "Yet another example of a post.",
            location: "Paris, France"
        }
    ];

    const [posts, setPosts] = useState<Post[]>();

    async function fetchPosts() {
        const response = await fetch('http://localhost:8000/tweets');
        const data = await response.json();
        const mappedPosts = data.map((item: bskyPostResponse) => item.tweet_data);
        console.log("Mapped posts:", mappedPosts);
        setPosts(mappedPosts);
    }

    if (!posts) {
        return (
            <>
                <Button onClick={() => {fetchPosts()}} className="mb-4">Load Posts</Button>
                <div>Loading...</div>
            </>
        );
    }
    return (
        <div className="w-full h-full overflow-y-auto">
            {posts.map((post) => (
                <div key={post.did} className="border-b p-4">
                    <p className="text-sm text-gray-500">
                        {new Date(post.time_us).toLocaleString()} - {post.location || "Unknown Location"}
                    </p>
                    <p className="mt-2">{post.text}</p>
                    <p className="mt-1 text-xs text-gray-400">Languages: {post.langs.join(", ")}</p>
                </div>
            ))}
        </div>
    );
}
