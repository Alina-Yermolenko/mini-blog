'use client'

import { UserContext } from "@/app/context/UserContext";
import { AppBar, Toolbar, Typography, makeStyles } from "@material-ui/core";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation";
import { useContext } from 'react';

const useStyles = makeStyles((theme) => ({
    appBar: {
        backgroundColor: theme.palette.primary.main,
        marginBottom:theme.spacing(5),
    },
    link: {
        margin: theme.spacing(1),
        color: theme.palette.common.white,
        textDecoration: 'none',
    },
}));
export const Header = () => {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);
    const supabase = createClientComponentClient();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser({});
        router.push('login')
    }

    const classes = useStyles();

    return (
        <AppBar position="static" className={classes.appBar}>
            <Toolbar>
                {!user.id ? (
                    <>
                        <Link href="/login" className={classes.link}>
                            <Typography variant="button">Login</Typography>
                        </Link>
                        <Link href="/signup" className={classes.link}>
                            <Typography variant="button">Signup</Typography>
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/general-feed" className={classes.link}>
                            <Typography variant="button">General feed</Typography>
                        </Link>
                        <Link href="/login" onClick={handleLogout} className={classes.link}>
                            <Typography variant="button">Logout</Typography>
                        </Link>
                    </>
                )}
            </Toolbar>
        </AppBar>
    )
}