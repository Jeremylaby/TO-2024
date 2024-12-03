import {createContext, useContext, useEffect, useState} from "react";
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    useEffect(() => {
        console.log(user);
    }, [user]);

    const login = async (email, password) => {
        //TODO
    };

    const signUp = async (firstNames, lastName, email, password, permissionLevel) => {//to nie wiem czy tak zrobimy
        //TODO
    }

    const logout = async () => {
        //TODO
    };

    const checkAuth = async () => {
        //TODO
    }
    useEffect(() => {
        checkAuth();
    }, []);
    return (
        <AuthContext.Provider value={{user, login, signUp, logout}}>{children}</AuthContext.Provider>
    )

}
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
export const useAuth = () => useContext(AuthContext);