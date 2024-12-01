import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {AuthProvider} from "./components/AuthProvider.jsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRouter from "./components/ProtectedRouter.jsx";
const roles = {
    ADMIN: 2,
    WORKER: 1,
    USER: 0,
};
function App() {


    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path={"/"} element={<Home/>}/>
                    <Route path={"/login"} element={<Login/>}/>
                    <Route path={"/signup"} element={<SignUp/>}/>
                    <Route path={"/account"} element={<Account/>}/>
                    <ProtectedRouter allowedRoles={[0]}>
                        <Route path={"/admin/users"} element={<UsersList/>}/>
                    </ProtectedRouter>
                    <Route path={"/unauthorized"} element={<Unauthorized/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
