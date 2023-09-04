'use client'

import { useContext, useEffect, useState } from 'react';
import { Button, TextField } from '@material-ui/core';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserContext } from '../context/UserContext';

const Login = () => {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const { user, setUser } = useContext<any>(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');

    const handleLogin = async () => {
        let { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        })

        if (error) {
            console.error(error);
            setErrorText(error.message);
        } else {
            setUser(data.user);
            router.push('/general-feed');
        }
    };

    useEffect(() => {
        if (user?.id) {
            router.push('/general-feed');
        }
    }, [user])

    return (
        <div>
            <h2>Login</h2>
            <TextField
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {errorText && <div>{errorText}</div>}
            <Button variant="contained" onClick={handleLogin}>
                Login
            </Button>
        </div>
    );
};

export default Login;
