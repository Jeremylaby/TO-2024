import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../components/AuthProvider.jsx";
import NavBar from "../components/NavBar.jsx";
import {
  Container,
  Typography,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Rating,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Ratings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRateId, setSelectedRateId] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  
  useEffect(() => {
      if (!user) {
        navigate("/login");
      }
    }, [user, navigate]);
  

    useEffect(() => {
        const fetchMoviesWithRatings = async () => {
          try {
            const userId = user?.id;
            if (!userId) {
              console.error("User ID is not available");
              return;
            }
            const response = await fetch(`http://localhost:8080/rate/user/${userId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch ratings.");
            }
            const data = await response.json();
            setRatings(data);
          } catch (error) {
            console.error("Error fetching ratings:", error);
            setError(error.message);
          }
        };
      
        fetchMoviesWithRatings();
      }, [user]);
      

  const handleOpenDialog = (rateId, movie) => {
    setSelectedRateId(rateId);
    setSelectedMovie(movie);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRateId(null);
    setSelectedMovie(null);
  };

  const handleDeleteRating = async () => {
    const rateId = selectedRateId;
    try {
    const response = await fetch(`http://localhost:8080/rate/${rateId}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete rating.");
    }

    alert("Rating deleted successfully!");
    handleCloseDialog();
    } catch (error) {
    alert("Error deleting rating: " + error.message);
    }
  };

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
          My Ratings
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && (
          <List>
            {ratings.map(({rateId, movie, rate }) => (
              <React.Fragment key={movie.id}>
                <ListItem alignItems="flex-start" sx={{ alignItems: "center" }}>
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={movie.imageUrl || "https://placehold.co/80x80"}
                      alt={movie.title}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "8px",
                        marginRight: 2,
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {movie.title}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Director: {movie.director || "Unknown"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Genres: {movie.genres.join(", ") || "N/A"}
                        </Typography>
                      </>
                    }
                  />
                  <div
                    style={{
                      marginLeft: "auto",
                      marginRight: "16px",
                      display: "flex",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                  <Rating
                    value={rate}
                    precision={0.5}
                    readOnly
                    size="large"
                  />
                  </div>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleOpenDialog(rateId, movie)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Delete Your Rating</DialogTitle>
          <DialogContent>
            <Typography>
              {selectedMovie ? `Deleting your rate for: ${selectedMovie.title}` : ""}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleDeleteRating} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Ratings;
