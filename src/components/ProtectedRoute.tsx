import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserContext } from '@/app/context/UserContext';

type Props = {
    children: React.ReactNode,
}
const ProtectedRoute:React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const { user } = useContext<any>(UserContext);

    useEffect(() => {
        async function checkAuthStatus() {
            if (!user.id) {
                router.replace('/login');
            }
        }

        checkAuthStatus();
    }, [router]);

    return children;
};

export default ProtectedRoute;
