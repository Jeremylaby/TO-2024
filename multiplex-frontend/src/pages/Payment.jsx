import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import { 
  Container,
   Typography, Box,
    Button, 
    Alert, 
    Card,
    List,
    ListItem,
    ListItemText 
} from "@mui/material";

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedSeats, totalPrice, reservationIds } = location.state || {};
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!selectedSeats || !totalPrice || !reservationIds) {
    return (
      <Container sx={{ py: 4, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Access denied. Please complete the reservation process first.
        </Alert>
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

      setSuccessMessage("Payment successful! You can now view your tickets and reservation details in your account.");
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4, display: "flex", justifyContent: "center" }}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 500,
            padding: 3,
            borderRadius: "12px",
            boxShadow: 4,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ textAlign: "center", fontWeight: "bold", mb: 3 }}
          >
            Payment
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1, textAlign: "center" }}>
              Selected Seats:
            </Typography>
            <List
              sx={{
                mb: 2,
                textAlign: "center",
              }}
            >
              {selectedSeats.map((seat, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primary={`Row ${seat.row}, Seat ${seat.seatNumber}`}
                    primaryTypographyProps={{ variant: "body2", textAlign: "center" }}
                  />
                </ListItem>
              ))}
            </List>
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              <strong>Total Price:</strong> {totalPrice} PLN
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePayment}
              disabled={!!successMessage}
              sx={{ fontSize: "16px", padding: "12px" }}
            >
              Pay Now
            </Button>
            <Button
               variant="outlined"
               sx = {{ color: 'gray', borderColor: 'gray', fontSize: "16px", padding: "12px"}}
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default PaymentPage;
