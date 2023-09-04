'use client'

import { Comment } from "@/types";
import {
    Paper,
    Typography,
    // Link,
    Grid,
    makeStyles,
    Box,
} from "@material-ui/core";

import Link from "next/link";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    commentContainer: {
        marginTop: theme.spacing(2),
        padding: theme.spacing(2),
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.spacing(1),
        width: '100%',
    },
    comment: {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.grey[300]}`,
        borderRadius: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: '100%',
    },
}));

interface Props {
    post: any,
}

const Post: React.FC<Props> = ({ post }) => {
    const classes = useStyles();

    return (
        <Paper className={classes.paper} key={post.id}>
            <Typography variant="h3" style={{ fontSize: '1.5rem', marginBottom: '8px' }}>
                {post.title}
            </Typography>
            <Typography variant="body1" style={{ fontSize: '1rem' }}>
                {post.text}
            </Typography>
            <Link
                href={`/author-feed/${post.user_id}`}
            >
                {post.authors?.email}
            </Link>

            {!!post.comments.length && (
                <Box className={classes.commentContainer} component="div">
                    <Typography variant="h6">Comments:</Typography>
                    {post.comments.map((comment:Comment) => (
                        <Box className={classes.comment} component={Paper} key={comment.id}>
                            <Typography variant="body1">{comment.text}</Typography>
                            <Typography variant="body2">by: {comment.commenter_email}</Typography>
                        </Box>
                    ))}
                </Box>
            )}
        </Paper>
    )
};

export default Post;