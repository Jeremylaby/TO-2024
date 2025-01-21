import { Box, Container, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import ChairIcon from "@mui/icons-material/Chair";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import WifiIcon from "@mui/icons-material/Wifi";
import CleanHandsIcon from "@mui/icons-material/CleanHands";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PlaceIcon from "@mui/icons-material/Place";
import React, { useState, useEffect } from "react";

const Home = () => {
  const [currentMovies, setCurrentMovies] = useState([]);

  // Fetch currently playing movies
  useEffect(() => {
    const fetchCurrentMovies = async () => {
      try {
        const response = await fetch("/api/seans/currently-playing", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch current movies.");
        const data = await response.json();
        setCurrentMovies(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCurrentMovies();
  }, []);

  const MovieCard = ({ movie }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Link
        to={`/movie-details/${movie.id}`} 
        state={{ movie }} 
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            height: "100%",
            transition: "transform 0.3s, box-shadow 0.3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 4,
            },
          }}
        >
          <CardMedia
            component="img"
            image={movie.imageUrl || "/api/placeholder/300/300"}
            alt={movie.title}
            sx={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
            }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              {movie.title}
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );

  return (
    <div className={"d-flex flex-column"}>
      <NavBar />
      <Container className={"d-flex flex-column justify-content-center"}>
        <Box
          component="img"
          sx={{
            width: "80%",
            margin: "0 auto",
          }}
          alt="Advert."
          src="/advert.png"
        />
        <Box mt={4}>
          <Box display="flex" justifyContent="center" gap={5}>
            <Box textAlign="center">
              <ChairIcon fontSize="large" />
              <Typography variant="h6">Newest seats</Typography>
            </Box>
            <Box textAlign="center">
              <LocalCafeIcon fontSize="large" />
              <Typography variant="h6">Delicious popcorn</Typography>
            </Box>
            <Box textAlign="center">
              <WifiIcon fontSize="large" />
              <Typography variant="h6">Free Wi-Fi</Typography>
            </Box>
            <Box textAlign="center">
              <CleanHandsIcon fontSize="large" />
              <Typography variant="h6">Clean and hygienic</Typography>
            </Box>
            <Box textAlign="center">
              <FamilyRestroomIcon fontSize="large" />
              <Typography variant="h6">Family-friendly</Typography>
            </Box>
            <Box textAlign="center">
              <SupportAgentIcon fontSize="large" />
              <Typography variant="h6">Excellent service</Typography>
            </Box>
          </Box>
        </Box>
        <Box mt={4}>
          <Grid container spacing={3}>
            {currentMovies.slice(0, 3).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </Grid>
        </Box>
        <Box mt={6} py={2} textAlign="center">
          <PlaceIcon fontSize="large" />
          <Typography variant="h6" fontWeight="bold" fontFamily={"monospace"} gutterBottom>
            Find us here for the best movies
          </Typography>
          <Typography variant="body1">
            Czarnowiejska 84, 30-054 Kraków | +48 123456789
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Home;
