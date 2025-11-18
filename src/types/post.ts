export type BskyPost = {
    id: number;
    post_uri: string;
    post_author: string;
    post_text: string;
    post_created_at: string;
    summary: string;
    location: string;
    severity: string;
    disaster_type: string;
    confidence: number;
    is_disaster: boolean;
    analyzed_at: string;
};
