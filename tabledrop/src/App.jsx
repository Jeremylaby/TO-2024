import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-svg-core/styles.css';
import './App.css'
import {AuthProvider} from "./components/AuthProvider.jsx";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import ProtectedRouter from "./components/ProtectedRouter.jsx";
import Unauthorized from "./components/Unauthorized.jsx";
import UserList from "./components/UserList.jsx";
import Account from "./components/Account.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import Home from "./components/Home/Home.jsx";
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
                        <Route path={"/admin/users"} element={
                            <ProtectedRouter allowedRoles={[roles.ADMIN]}>
                                <UserList/>
                            </ProtectedRouter>
                        }
                        />

                    <Route path={"/unauthorized"} element={<Unauthorized/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
