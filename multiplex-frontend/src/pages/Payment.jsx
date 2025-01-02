import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Typography, Box, Button, Alert } from "@mui/material";
import NavBar from "../components/NavBar.jsx";


const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, totalPrice, reservationIds } = location.state || {};
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!selectedSeats || !totalPrice || !reservationIds) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Access denied. Please complete the reservation process first.</Alert>
        <Button variant="contained" onClick={() => navigate("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const handlePayment = async () => {
    try {
      for (const reservationId of reservationIds) {
        const response = await fetch(`/api/reservation/${reservationId}/pay`, {
          method: "PUT",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Payment failed.");
        }
      }

      setSuccessMessage("Payment successful! All reservations have been paid.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
        <NavBar />
        <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
            Payment
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <Box sx={{ mb: 4 }}>
            <Typography variant="body1">
            <strong>Selected Seats:</strong>{" "}
            {selectedSeats.map((seat) => `Row ${seat.row}, Seat ${seat.seatNumber}`).join(", ")}
            </Typography>
            <Typography variant="body1">
            <strong>Total Price:</strong> {totalPrice} PLN
            </Typography>
        </Box>

        <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={!!successMessage}
        >
            Pay Now
        </Button>
        </Container>
    </>
  );
};

export default PaymentPage;
