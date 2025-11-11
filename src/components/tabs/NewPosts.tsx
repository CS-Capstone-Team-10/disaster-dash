"use client";
import { useState } from "react";

interface Post {
    did: string;
    time_us: number;
    langs: string[];
    text: string;
    location?: string;
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
            langs: ["es"],
            text: "Este es un post de ejemplo en español.",
            location: "Madrid, Spain"
        },
        {
            did: "3",
            time_us: 1625420400000,
            langs: ["fr"],
            text: "Ceci est un post d'exemple en français.",
        }
    ];

    const [posts] = useState<Post[]>(dummyPosts);

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
