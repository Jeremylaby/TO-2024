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
  Rating, Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const Ratings = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [moviesWithRatings, setMoviesWithRatings] = useState([]);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [ratingValue, setRatingValue] = useState(0);
  const fetchMoviesWithRatings = async () => {
    try {
      const response = await fetch("/api/movie/ratings");
      if (!response.ok) {
        throw new Error("Failed to fetch movies with ratings.");
      }
      const data = await response.json();
      setMoviesWithRatings(data);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {


    fetchMoviesWithRatings();
  }, []);

  const handleOpenDialog = (movie) => {
    setSelectedMovie(movie);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMovie(null);
    setRatingValue(0);
  };

  const handleSubmitRating = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!selectedMovie || ratingValue === 0) {
      alert("Please select a valid rating.");
      return;
    }

    const requestPayload = {
      movieId: selectedMovie.id,
      userId: user.id,
      rate: ratingValue,
    };

    try {
      const response = await fetch("/api/rate", {
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
      fetchMoviesWithRatings()

    } catch (error) {
      alert("Error submitting rating: " + error.message);
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
          User Ratings
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && (
          <List component={Paper}>
            {moviesWithRatings.map(({ movie, averageRating }) => (
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
                    {averageRating > 0 ? (
                      <Rating
                        value={averageRating}
                        precision={0.5}
                        readOnly
                        size="large"
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Brak ocen
                      </Typography>
                    )}
                  </div>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => handleOpenDialog(movie)}
                  >
                    <AddIcon />
                  </IconButton>
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Add your rating</DialogTitle>
          <DialogContent>
            <Typography>
              {selectedMovie ? `Movie: ${selectedMovie.title}` : ""}
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
      </Container>
    </>
  );
};

export default Ratings;
