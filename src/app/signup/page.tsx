'use client'

import { useState } from 'react';
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from '@material-ui/core';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('false');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createClientComponentClient()

    const handleSignUp = async () => {
        try {
            const { data: user, error } = await supabase.auth.signUp({
                email,
                password,
                // options: {
                //   emailRedirectTo: `${location.origin}/auth/callback`,
                // },
            })

            if (error) {
                setError('Error registering user:'+ error.message);
                return null;
            }

            const { data: insertData, error: insertError } = await supabase
                .from('authors')
                .insert([{
                    user_type: userType,
                    auth_id: user?.user?.id,
                    email: email,
                }]);

            if (insertError) {
                setSuccess(false)
                setError('Error adding user to the database:' + insertError.message)
                return;
            }

            router.refresh();
            setError('')
            setSuccess(true);
            router.push('/general-feed')

            return user.user;
        } catch (error: any) {
            setSuccess(false)
            setError('Error registering user:' + error.message);
            return null;
        }
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <TextField
                label="Email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
            />
            <RadioGroup
                aria-label="Profile Type"
                name="userType"
                value={userType}
                onChange={(e) => {
                    setUserType(e.target.value)}}
            >
                <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="Author"
                    checked={userType === 'true'}
                />
                <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="Commentator"
                    checked={userType === 'false'}
                />
            </RadioGroup>
            {error && <div>{error}</div>}
            {success && <div>Registered successfully</div>}
            <Button variant="contained" onClick={handleSignUp}>
                Sign Up
            </Button>
        </div>
    );
};

export default SignUp;
