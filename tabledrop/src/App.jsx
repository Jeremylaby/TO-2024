import "@fortawesome/fontawesome-svg-core/styles.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./styles/App.css";
import Account from "./pages/Account.jsx";
import { AuthProvider } from "./components/AuthProvider.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRouter from "./components/ProtectedRoute.jsx";
import SignUp from "./pages/SignUp.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import UserList from "./pages/UserList.jsx";
import Home from "./pages/Home.jsx";
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
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/account"} element={<Account />} />
          <Route
            path={"/admin/users"}
            element={
              <ProtectedRouter allowedRoles={[roles.ADMIN]}>
                <UserList />
              </ProtectedRouter>
            }
          />

          <Route path={"/unauthorized"} element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
