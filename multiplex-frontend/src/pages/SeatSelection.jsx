import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../components/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import {Alert, Box, Button, Card, Container, Grid2, Typography,} from "@mui/material";

const SeatSelection = () => {
    const {seansId} = useParams();
    const navigate = useNavigate();
    const {user} = useAuth();
    const [seats, setSeats] = useState([]);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [error, setError] = useState(null);
    const [seansDetails, setSeansDetails] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isConfirming, setIsConfirming] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                const response = await fetch(`/api/seans/${seansId}/seats`);
                if (!response.ok) {
                    throw new Error("Failed to fetch seats.");
                }
                const data = await response.json();
                setSeats(data);

                const seansResponse = await fetch(`/api/seans/${seansId}`);
                if (seansResponse.ok) {
                    const seansData = await seansResponse.json();
                    setSeansDetails(seansData);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchSeats();
    }, [seansId]);

    const handleSeatToggle = (seat) => {
        if (isConfirming || seat.isReserved) return;
        setSelectedSeats((prev) =>
            prev.some((selected) => selected.id === seat.id)
                ? prev.filter((selected) => selected.id !== seat.id)
                : [...prev, seat]
        );
    };

    const totalPrice = seansDetails ? selectedSeats.length * seansDetails.price : 0;

    const handleConfirm = async () => {
        if (!user || !user.id) {
            setErrorMessage("User is not logged in.");
            return;
        }

        setIsConfirming(true);
        try {
            const requestBody = {
                seansId: seansId,
                userId: user.id,
                seats: selectedSeats.map((seat) => seat.id),
            };

            const response = await fetch("/api/reservation/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to make reservation.");
            }

            const responseData = await response.json();
            const {reservationIds} = responseData;

            setSuccessMessage(
                "Reservations successful! You will be redirected to the payment page shortly. Please complete your payment within 15 minutes; otherwise, your reservation will be canceled."
            );

            setTimeout(() => {
                navigate("/payment", {
                    state: {
                        selectedSeats,
                        totalPrice,
                        reservationIds,
                    },
                });
            }, 6000);
        } catch (error) {
            setErrorMessage(error.message);
            setIsConfirming(false);
        }
    };

    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <>
            <NavBar/>
            <Container sx={{py: 4}}>
                <Typography
                    variant="h4"
                    component="h1"
                    gutterBottom
                    sx={{marginBottom: 3, fontWeight: "bold"}}
                >
                    Select Your Seat
                </Typography>

                {seansDetails && (
                    <Box sx={{mb: 4}}>
                        <Typography variant="body1">
                            <strong>Movie:</strong> {seansDetails.movie.title}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Start:</strong> {new Date(seansDetails.start).toLocaleString()}
                        </Typography>
                        <Typography variant="body1">
                            <strong>Price:</strong> {seansDetails.price} PLN
                        </Typography>
                    </Box>
                )}

                <Box sx={{mb: 4, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Box
                        sx={{
                            width: "80%",
                            height: 20,
                            backgroundColor: "black",
                            borderRadius: "4px",
                            marginBottom: 4,
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{textAlign: "center", color: "white", lineHeight: "20px"}}
                        >
                            Screen
                        </Typography>
                    </Box>

                    <Box>
                        {Array.from(new Set(seats.map((seat) => seat.row))).map((row) => (
                            <Box key={row} sx={{mb: 2, display: "flex", alignItems: "center"}}>
                                <Typography
                                    variant="body2"
                                    sx={{width: 50, textAlign: "center", fontWeight: "bold"}}
                                >
                                    Row {row}
                                </Typography>
                                <Grid2
                                    container
                                    spacing={1}
                                    sx={{
                                        flex: 1,
                                        justifyContent: "center",
                                    }}
                                >
                                    {seats
                                        .filter((seat) => seat.row === row)
                                        .map((seat) => (
                                            <Grid2
                                                item
                                                key={seat.id}
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                }}
                                            >
                                                <Box
                                                    onClick={() => handleSeatToggle(seat)}
                                                    sx={{
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: "4px",
                                                        backgroundColor: seat.isReserved
                                                            ? "gray"
                                                            : selectedSeats.some((selected) => selected.id === seat.id)
                                                                ? "green"
                                                                : "blue",
                                                        cursor:
                                                            isConfirming || seat.isReserved
                                                                ? "not-allowed"
                                                                : "pointer",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        fontSize: "10px",
                                                        color: "white",
                                                        transition: "transform 0.2s, box-shadow 0.2s",
                                                        "&:hover":
                                                            !isConfirming &&
                                                            !seat.isReserved && {
                                                                transform: "scale(1.1)",
                                                                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                                            },
                                                    }}
                                                >
                                                    {seat.seatNumber}
                                                </Box>
                                            </Grid2>
                                        ))}
                                </Grid2>
                                <Typography
                                    variant="body2"
                                    sx={{width: 50, textAlign: "center", fontWeight: "bold"}}
                                >
                                    Row {row}
                                </Typography>
                            </Box>
                        ))}
                    </Box>

                </Box>

                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

                <Box sx={{mt: 4, display: "flex", justifyContent: "center"}}>
                    <Card
                        sx={{
                            width: "100%",
                            maxWidth: 400,
                            padding: 3,
                            borderRadius: "8px",
                            boxShadow: 3,
                        }}
                    >
                        <Typography
                            variant="h5"
                            component="div"
                            sx={{fontWeight: "bold", marginBottom: 2}}
                        >
                            Summary
                        </Typography>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 1,
                            }}
                        >
                            <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                Selected Seats:
                            </Typography>
                            <Typography variant="body1">{selectedSeats.length}</Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: 1,
                            }}
                        >
                            <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                Total Price:
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{color: "green", fontWeight: "bold"}}
                            >
                                {totalPrice} PLN
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                marginTop: 2,
                            }}
                        >
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{mb: 1}}
                                disabled={isConfirming || selectedSeats.length === 0}
                                onClick={handleConfirm}
                            >
                                Confirm Selection
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{color: 'gray', borderColor: 'gray'}}
                                onClick={() => setSelectedSeats([])}
                                disabled={isConfirming}
                            >
                                Clear Selection
                            </Button>
                        </Box>
                    </Card>
                </Box>
            </Container>
        </>
    );
};

export default SeatSelection;