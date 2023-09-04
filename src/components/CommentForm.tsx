import { Button, CircularProgress, Grid, TextareaAutosize, makeStyles } from '@material-ui/core';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Comment } from '@/types';

const useStyles = makeStyles((theme) => ({
    formContainer: {
        marginTop: theme.spacing(2),
    },
    textarea: {
        width: '100%',
        padding: theme.spacing(1),
        borderRadius: theme.spacing(1),
        border: `1px solid ${theme.palette.grey[300]}`,
        resize: 'none',
    },
    button: {
        marginTop: theme.spacing(2),
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: theme.spacing(2),
        color: theme.palette.primary.main,
        fontWeight: 'bold',
    },
}));

type Params = {
    postId: number,
    userId: string,
    addComment: (newComment: any, postId: any) => void
};

const CommentForm: React.FC<Params> = ({ postId, userId, addComment }) => {
    const supabase = createClientComponentClient()
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const classes = useStyles();

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        const { data: currrentUser, error: currrentUserError } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    user_id: userId,
                    post_id: postId,
                    text: comment,
                    commenter_email: currrentUser?.user?.email,
                }
            ])
            .select('*');

        if (error) {
            setIsLoading(false);
            console.error('Error creating comment:', error.message);
            return;
        }

        addComment(data[0], postId)
        setIsLoading(false);
        setComment('');
    };

    return (
        <>
            {!isLoading ? (
                <form onSubmit={handleCommentSubmit}>
                    <Grid container spacing={2} className={classes.formContainer}>
                        <Grid item xs={12}>
                            <TextareaAutosize
                                className={classes.textarea}
                                minRows={3}
                                placeholder="Add your comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                className={classes.button}
                                type="submit"
                                variant="contained"
                                color="primary"
                            >
                                Submit Comment
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <div className={classes.loadingContainer}>
                    <CircularProgress />
                </div>
            )}
        </>
    );
}

export default CommentForm;
