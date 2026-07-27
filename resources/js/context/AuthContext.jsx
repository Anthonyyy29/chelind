import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        getMe()
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setChecking(false));
    }, []);

    const login = useCallback(async (credentials) => {
        const loggedInUser = await apiLogin(credentials);
        setUser(loggedInUser);
        return loggedInUser;
    }, []);

    const logout = useCallback(async () => {
        await apiLogout();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, checking, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
