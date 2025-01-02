import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";

import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  Button,
  Grid2,
  Alert,
} from "@mui/material";

const SeatSelection = () => {
  const { seansId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [error, setError] = useState(null);
  const [seansDetails, setSeansDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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
    setSelectedSeats((prev) =>
      prev.some(
        (selected) =>
          selected.row === seat.row && selected.seatNumber === seat.seatNumber
      )
        ? prev.filter(
            (selected) =>
              selected.row !== seat.row || selected.seatNumber !== seat.seatNumber
          )
        : [...prev, seat]
    );
  };

  const totalPrice = seansDetails ? selectedSeats.length * seansDetails.price : 0;

  const handleConfirm = async () => {
    if (!user || !user.id) {
      setErrorMessage("User is not logged in.");
      return;
    }
  
    try {
      const requestBody = {
        seansId: seansId,
        userId: user.id,
        seats: selectedSeats.map((seat) => seat.id),
      };
  
      const response = await fetch("/api/reservation/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to make reservation.");
      }
  
      const responseData = await response.json();
      const { reservationIds } = responseData;
  
      setSuccessMessage(
        "Reservations successful! You have 15 minutes to complete the payment."
      );
  
      setTimeout(() => {
        navigate("/payment", {
          state: {
            selectedSeats,
            totalPrice,
            reservationIds,
          },
        });
      }, 3000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
        <NavBar />
        <Container sx={{ py: 4 }}>
        <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ marginBottom: 3, fontWeight: "bold" }}
        >
            Select Your Seat
        </Typography>

        {seansDetails && (
            <Box sx={{ mb: 4 }}>
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

        <Box sx={{ mb: 4 }}>
            <Typography variant="body1" gutterBottom>
            <strong>Available Seats:</strong>
            </Typography>
            <Grid2 container spacing={2}>
            {seats.map((seat) => (
                <Grid2 item xs={12} sm={6} md={4} key={`${seat.row}-${seat.seatNumber}`}>
                <List>
                    <ListItem>
                    <Checkbox
                        checked={selectedSeats.some(
                        (selected) =>
                            selected.row === seat.row && selected.seatNumber === seat.seatNumber
                        )}
                        onChange={() => handleSeatToggle(seat)}
                    />
                    <ListItemText
                        primary={`Row ${seat.row}, Seat ${seat.seatNumber}`}
                    />
                    </ListItem>
                </List>
                </Grid2>
            ))}
            </Grid2>
        </Box>

        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box>
            <Typography variant="h5">Summary</Typography>
            <Typography variant="body1">
            Selected Seats: {selectedSeats.length}
            </Typography>
            <Typography variant="body1">Total Price: {totalPrice} PLN</Typography>
            <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={selectedSeats.length === 0}
            onClick={handleConfirm}
            >
            Confirm Selection
            </Button>
        </Box>
        </Container>
    </>
  );
};

export default SeatSelection;
