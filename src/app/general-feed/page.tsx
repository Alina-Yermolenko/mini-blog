'use client'

import Post from '@/components/Post';
import PostForm from '@/components/PostForm';
import { useContext, useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserContext } from '../context/UserContext';
import { Post as postType } from '@/types';

function GeneralFeed() {
    const supabase = createClientComponentClient()
    const [posts, setPosts] = useState([]);
    const [isError, setIsError] = useState(false);
    const [author, setAuthor] = useState({});
    const [isAuthor, setIsAuthor] = useState(false);
    const { user } = useContext<any>(UserContext);

    useEffect(() => {
        const setUserSession = async () => {
            let { data: authorUser, error: authorError } = await supabase
                .from('authors')
                .select('*')
                .eq('auth_id', user.id)
                .eq('user_type', true);

            if (authorUser?.length) {
                setAuthor(authorUser[0]);
                setIsAuthor(true)
            }
        }

        setUserSession();
    }, []);

    useEffect(() => {
        async function getPosts() {
            const { data: posts, error: postsError } = await supabase
                .from('posts')
                .select('*, comments(*), authors(*)');

            if (postsError) {
                setIsError(true)
            }
            const sorted = (posts as postType[] | undefined)?.sort((a, b) => {
                const dateA = new Date(a.created_at);
                const dateB = new Date(b.created_at);
                return dateB.getTime() - dateA.getTime();
            }) || [];
            setPosts(sorted);
            setIsError(false)
        }

        getPosts()
    }, []);

    const addPost = (newPost: postType) => {
        setPosts([newPost, ...posts])
    }

    if (isError) {
        return <div>Error loading posts</div>;
    }

    return (
        <ProtectedRoute>
            {isAuthor &&
                <PostForm addPost={addPost} />
            }
            {posts && posts.map((post: postType) => (
                <Post key={post.id} post={post} />
            ))}
        </ProtectedRoute>
    );
}

export default GeneralFeed;
