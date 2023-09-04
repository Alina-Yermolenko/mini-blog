'use client'

import { FormEvent, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button, CircularProgress, TextField, Typography } from "@material-ui/core";
import { User } from "@/types";

const PostForm: React.FC<any> = ({ addPost }) => {
    const supabase = createClientComponentClient();
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const { data: currrentUser, error: currrentUserError } = await supabase.auth.getUser();
        
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([{
                    title,
                    text,
                    user_id: currrentUser?.user?.id,
                    author_email: currrentUser?.user?.email
                }])
                .select('*, comments(*), authors(*)');
            if (error) {
                setIsLoading(false)
                throw error
            };
            addPost(data[0])
            setTitle('');
            setText('');
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            console.error(error);
        }
    };


    return (
        !isLoading ?
            <form onSubmit={handleFormSubmit}>
                <Typography variant="h5" gutterBottom>
                    Create a New Post
                </Typography>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    margin="normal"
                    value={title}
                    required
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Text"
                    multiline
                    minRows={4}
                    variant="outlined"
                    margin="normal"
                    value={text}
                    required
                    onChange={(e) => setText(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary">
                    Create Post
                </Button>
            </form>
            : <CircularProgress />
    )
};

export default PostForm;