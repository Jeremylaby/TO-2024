import {useAuth} from "../components/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import {
    Box, Button, Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Rating,
    Table,
    TableBody,
    TableContainer
} from "@mui/material";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import Reservation from "../components/Reservation.jsx";





const MyReservations = () => {
    const {user} = useAuth()

    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openCancelDialog, setOpenCancelDialog] = useState(false);
    const [openRateDialog, setOpenRateDialog] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [ratingValue, setRatingValue] = useState(0);
    const handleOpenDialog = (reservation) => {
        setSelectedReservation(reservation);
        setOpenDialog(true);
    };
    const handleOpenRate = () =>{
        setOpenDialog(false);
        setOpenRateDialog(true);
    }
    const handleOpenCancel = () =>{
        setOpenDialog(false);
        setOpenCancelDialog(true);
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setOpenRateDialog(false);
        setOpenCancelDialog(false)
        setSelectedReservation(null);
        setRatingValue(0);
    };

    const handleSubmitRating = async () => {

        if (!selectedReservation|| ratingValue === 0) {
            alert("Please select a valid rating.");
            return;
        }

        const requestPayload = {
            movieId: selectedReservation.movie.id,
            userId: user.id,
            rate: ratingValue,
        };

        try {
            const response = await fetch("http://localhost:8080/rate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestPayload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to submit rating.");
            }

            alert("Rating submitted successfully!");
            handleCloseDialog();

        } catch (error) {
            alert("Error submitting rating: " + error.message);
        }
    };

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
    const handleSubmitCancel = async () => {
        if (!selectedReservation) {
            alert("Please select a valid reservation to cancel.");
            return;
        }

        const reservationId = selectedReservation.id;
        const userId = user.id;

        try {
            const response = await fetch(`/api/reservation/${reservationId}/user/${userId}/cancel`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to cancel the reservation.");
            }

            alert("Reservation canceled successfully!");
            handleCloseDialog();

        } catch (error) {
            alert("Error canceling reservation: " + error.message);
        } finally {
            fetchReservations();
        }
    };

    useEffect(() => {
        fetchReservations();
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

                                        <Reservation onClick={() => handleOpenDialog(reservation)} reservation={reservation} key={reservation.id}/>

                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Select Action</DialogTitle>
                <DialogContent>
                    <Box  sx={{ display:"flex", justifyContent:"center"}}>
                    <Button onClick={handleOpenCancel} sx={{margin:2}} variant="outlined">Cancel Reservation</Button>
                    <Button onClick={handleOpenRate} sx={{margin:2}} variant="outlined">Rate Movie</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openRateDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Add your rating</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedReservation ? `Movie: ${selectedReservation.movie.title}` : ""}
                    </Typography>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            marginTop: "16px",
                        }}
                    >
                        <Rating
                            name="user-rating"
                            value={ratingValue}
                            onChange={(event, newValue) => setRatingValue(newValue)}
                            size="large"
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmitRating} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openCancelDialog}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Are you sure to cancel this reservation ?</DialogTitle>
                <DialogContent>
                    <Typography>
                        {selectedReservation ? `Reservation Id: ${selectedReservation.id}` : ""}
                        {selectedReservation ? ` Movie: ${selectedReservation.movie.title}` : ""}
                    </Typography>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmitCancel} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>)
};
export default MyReservations
