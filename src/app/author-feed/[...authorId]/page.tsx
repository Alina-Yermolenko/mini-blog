'use client'

import CommentForm from "@/components/CommentForm";
import Post from "@/components/Post";
import { useContext, useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ProtectedRoute from "@/components/ProtectedRoute";
import { UserContext } from "@/app/context/UserContext";
import { Typography, Box, makeStyles } from "@material-ui/core";
import { Post as PostType } from "@/types";

const useStyles = makeStyles((theme) => ({
    authorFeed: {
        marginBottom: theme.spacing(2),
    },
    post: {
        marginBottom: theme.spacing(2),
    },
    comments: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: theme.spacing(2),
    },
    comment: {
        background: theme.palette.grey[200],
        padding: theme.spacing(2),
        marginBottom: theme.spacing(1),
        borderRadius: theme.spacing(1),
    },
}));


function AuthorFeed({ params }: { params: { authorId: string } }) {
    const supabase = createClientComponentClient()
    const { user: contextUser } = useContext(UserContext);
    const classes = useStyles();

    const { authorId } = params;
    const [author, setAuthor] = useState({});
    const [posts, setPosts] = useState<PostType[]>([]);
    const [commentator, setCommentator] = useState({});
    const [isCommentator, setIsCommentator] = useState(false);

    useEffect(() => {
        const setUserSession = async () => {
            const { data: currrentAuthor, error } = await supabase
                .from('authors')
                .select('*')
                .eq('auth_id', authorId[0]);


            setAuthor(currrentAuthor[0]);
            let { data: user, error: userError } = await supabase
                .from('authors')
                .select('*')
                .eq('auth_id', contextUser.id)
                .eq('user_type', false);


            if (user?.length) {
                setCommentator(user[0]);
                setIsCommentator(true)
            }
        }

        setUserSession();

    }, [authorId]);

    useEffect(() => {
        const getPosts = async () => {
            const { data, error: postsError } = await supabase
                .from('posts')
                .select('*, comments(*), authors(*)')
                .eq('user_id', authorId[0]);

            setPosts(data);
        }

        getPosts()
    }, []);

    const addComment = (newComment: Comment, postId: any) => {
        setPosts(
            posts.map((one: PostType) => {
                if (one.id === postId) {
                    return { ...one, comments: [...one.comments ?? [], newComment] }
                }

                return one
            })
        )
    }


    return (
        <ProtectedRoute>
            <Box className={classes.authorFeed}>
                <Typography variant="h4">Author Feed of {author?.email}</Typography>
                {posts.map((post) => (
                    <Box className={classes.post} key={post.id}>
                        <Post post={post} />

                        {isCommentator && (
                            <Box className={classes.comments}>
                                {isCommentator && (
                                    <CommentForm postId={post.id} userId={commentator.auth_id} addComment={addComment} />
                                )}
                            </Box>
                        )}
                    </Box>
                ))}
            </Box>
        </ProtectedRoute>
    );
}

export default AuthorFeed;
