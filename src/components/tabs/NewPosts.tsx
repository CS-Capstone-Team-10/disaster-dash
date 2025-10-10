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
            location: "Paris, France"
        }
    ];

}
