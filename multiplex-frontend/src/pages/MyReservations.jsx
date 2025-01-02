import {useAuth} from "../components/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import {Box, Paper, Table, TableBody, TableContainer} from "@mui/material";
import {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Reservation from "../components/Reservation.jsx";

const data = [
    {
        "id": 102,
        "paid": false,
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "row": 2,
        "seatNumber": 15,
        "roomName": "12",
        "price": 25.00,
        "start": "2025-01-02T15:00:00",
        "endTime": "2025-01-02T17:00:00",
        "movie": {
            "id": 502,
            "title": "The Matrix",
            "director": "Lana Wachowski",
            "duration": 120
        }
    },
    {
        "id": 101,
        "paid": true,
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "row": 1,
        "seatNumber": 10,
        "roomName": "10",
        "price": 20.00,
        "start": "2025-01-01T18:00:00",
        "endTime": "2025-01-01T20:00:00",
        "movie": {
            "id": 501,
            "title": "Inception",
            "director": "Christopher Nolan",
            "duration": 120
        }
    },
    {
        "id": 103,
        "paid": true,
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "row": 3,
        "seatNumber": 20,
        "roomName": "14",
        "price": 18.00,
        "start": "2025-01-03T10:00:00",
        "endTime": "2025-01-03T12:00:00",
        "movie": {
            "id": 503,
            "title": "Avatar",
            "director": "James Cameron",
            "duration": 120
        }
    },
    {
        "id": 104,
        "paid": false,
        "userId": 1,
        "firstName": "John",
        "lastName": "Doe",
        "row": 4,
        "seatNumber": 25,
        "roomName": "16",
        "price": 22.50,
        "start": "2025-01-04T20:00:00",
        "endTime": "2025-01-04T22:30:00",
        "movie": {
            "id": 504,
            "title": "Interstellar",
            "director": "Christopher Nolan",
            "duration": 150
        }
    }
]


const MyReservations = () => {
    const {user} = useAuth()
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchReservations = () => {
        setError(null);
        setLoading(true);
        return fetch(`/api/reservation/user/${user.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania danych');
                }
                return response.json();
            })
            .then((data) => setReservations(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false))

    };
    useEffect(() => {
        //fetchReservations();
        setReservations(data)
        setLoading(false)
    }, []);
    if (loading) return (<h1>Loading...</h1>)
    if (error) return (<h1>Error: {error}</h1>)
    return (
        <Box>
            <NavBar/>
            <Box sx={{padding: 2}}>
                <Typography variant="h4" sx={{marginBottom: 2}}>
                    Reservations
                </Typography>
                {reservations.length === 0 ? (
                    <Typography variant="body1">No reservations found.</Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table>

                            <TableBody  >
                                {reservations.map((reservation) => (

                                        <Reservation reservation={reservation} key={reservation.id}/>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </Box>)
};
export default MyReservations
