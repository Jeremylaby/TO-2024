import "@fortawesome/fontawesome-svg-core/styles.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider.jsx";
import Account from "./pages/Account.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import Movies from "./pages/Movies.jsx";
import MyRatings from "./pages/MyRatings";
import Payment from "./pages/Payment";
import Ratings from "./pages/Ratings";
import SeatSelection from "./pages/SeatSelection";
import SignUp from "./pages/SignUp.jsx";
import Unauthorized from "./pages/Unauthorized.jsx";
import UserList from "./pages/UserList.jsx";
import "./styles/App.css";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Admin from "./pages/Admin.jsx";
import Analytics from "./pages/Analytics.jsx";
import MoviePanel from "./pages/MoviePanel.jsx";
import MyReservations from "./pages/MyReservations.jsx";
import RoomPanel from "./pages/RoomPanel.jsx";
import SeansPanel from "./pages/SeansPanel.jsx";

const roles = {
  MANAGER: 3,
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
          <Route
            path={"/account"}
            element={
              <ProtectedRoute reqRoleLvl={roles.USER}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/account/reservations"}
            element={
              <ProtectedRoute reqRoleLvl={roles.USER}>
                <MyReservations />
              </ProtectedRoute>
            }
          />
          <Route path={"/movies"} element={<Movies />} />
          <Route
            path={"/admin"}
            element={
              <ProtectedRoute reqRoleLvl={roles.ADMIN}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path={"/movie-details/:id"} element={<MovieDetails />} />
          <Route path="/seats/:seansId" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute reqRoleLvl={roles.MANAGER}>
                <Analytics />
              </ProtectedRoute>
            }
          />
          <Route path="/ratings" element={<Ratings />} />
          <Route
            path="/account/ratings"
            element={
              <ProtectedRoute reqRoleLvl={roles.USER}>
                <MyRatings />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/admin/users"}
            element={
              <ProtectedRoute reqRoleLvl={roles.ADMIN}>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/movie-panel"
            element={
              <ProtectedRoute reqRoleLvl={roles.WORKER}>
                <MoviePanel />
              </ProtectedRoute>
            }
          />
          <Route
            path={"/admin/seans-panel"}
            element={
              <ProtectedRoute reqRoleLvl={roles.WORKER}>
                <SeansPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/room-panel"
            element={
              <ProtectedRoute reqRoleLvl={roles.WORKER}>
                <RoomPanel />
              </ProtectedRoute>
            }
          />
          <Route path={"/unauthorized"} element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
