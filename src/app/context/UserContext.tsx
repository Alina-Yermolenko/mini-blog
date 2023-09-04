'use client'

import { User } from '@/types';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const UserContext = createContext({
    user: {},
    setUser: (user: User | null) => { },
});

type Props = {
    children: React.ReactNode
}

export const UserContextProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<User | null>({});

    const supabase = createClientComponentClient()

    const value = useMemo(() => ({ user, setUser }), [user])

    const getSession = async () => {
        const { data: currrentUser, error: currrentUserError } = await supabase.auth.getUser();
        if (currrentUser.user) {
            setUser(currrentUser.user)
        }
    };

    useEffect(() => {
        getSession()
    }, [])

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};
