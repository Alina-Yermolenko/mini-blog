export interface Comment {
    id: number,
    user_id: string,
    post_id: string,
    created_at: string,
    text: string,
    commenter_email: string
}

export interface Post {
    id: number,
    user_id: string,
    created_at: string,
    title: string,
    text: string,
    comments?: Comment[],
    author_email: string,
}

export interface User {
    id?: string,
    auth_id?: string,
    user_type?: boolean,
    email?: string,
    comments?: Comment[],
    posts?: Post[],
}