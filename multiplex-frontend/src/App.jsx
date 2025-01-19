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
import Movies from "./pages/Movies.jsx";
import MovieDetails from "./pages/MovieDetails.jsx";
import SeatSelection from "./pages/SeatSelection";
import Payment from "./pages/Payment";
import Ratings from "./pages/Ratings";
import MyRatings from "./pages/MyRatings";

import MyReservations from "./pages/MyReservations.jsx";
import MoviePanel from "./pages/MoviePanel.jsx";
import Analytics from "./pages/Analytics.jsx";
import { ThemeProvider, createTheme } from '@mui/material/styles';
const roles = {
  ADMIN: 2,
  WORKER: 1,
  USER: 0,
};
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
function App() {
  return (
    <ThemeProvider theme={darkTheme}>

    <AuthProvider>
      <Router>
        <Routes>
          <Route path={"/"} element={<Home />} />
          <Route path={"/login"} element={<Login />} />
          <Route path={"/signup"} element={<SignUp />} />
          <Route path={"/account"} element={<Account />} />
          <Route path={"/account/reservations"} element={<MyReservations/>}/>
          <Route path={"/movies"} element={<Movies />} />
          <Route path={"/movie-details/:id"} element={<MovieDetails />} />
          <Route path="/seats/:seansId" element={<SeatSelection />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/ratings" element={<Ratings />} />
          <Route path='/account/ratings' element={<MyRatings />} />
          <Route
            path={"/admin/users"}
            element={
              <UserList />
            }
            />
          <Route path="/admin/movie-panel" element={<MoviePanel/>}/>

          <Route path={"/unauthorized"} element={<Unauthorized />} />
        </Routes>
      </Router>
    </AuthProvider>
            </ThemeProvider>
  );
}

export default App;
