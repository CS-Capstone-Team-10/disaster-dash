"use client";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    async function fetchPosts(page: number = 1, limit: number = 10) {
        try {
            const response = await fetch(`http://localhost:8000/tweets?page=${page}&limit=${limit}`);
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

    useEffect(() => {
        fetchPosts(page, limit);
    }, [page, limit]);

    if (error) {
        return (
            <div className="w-full h-full overflow-y-auto">
                <Button onClick={() => { fetchPosts() }} className="mb-4">Load Posts</Button>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }
    if (!posts || posts.length === 0) {
        return (
            // skeleton
            <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="animate-pulse space-y-4 w-full max-w-2xl">
                    {[...Array(5)].map((_, index) => (
                        <Skeleton key={index} className="h-20 w-full rounded-md" />
                    ))}
                </div>
            </div>
        );
    }
    return (
        <div className="w-full max-h-[calc(100vh-200px)] overflow-scroll">
            <div className="flex justify-center items-center mb-4 sticky top-0 backdrop-opacity-90 ">
                <Button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                    <ArrowLeft size={16} />
                </Button>
                <span>Page {page}</span>
                <Button onClick={() => setPage((prev) => prev + 1)} disabled={posts.length < limit}>
                    <ArrowRight size={16} />
                </Button>
            </div>
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
