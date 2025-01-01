import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import {
  Grid2,
  Card,
  CardContent,
  CardMedia,
  Container,
  Typography,
  Alert,
} from "@mui/material";


const Movies = () => {
  const [movies, setMovies] = useState([]); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("/api/seans/movies");
        if (!response.ok) {
          throw new Error("Failed to fetch movies.");
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMovies();
  }, []);

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
          Currently playing movies
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        {!error && (
          <Grid2 container spacing={3}>
            {movies.map((movie) => (
              <Grid2 xs={12} sm={6} md={3} key={movie.id}>
                <Link
                  to={`/movie/${movie.id}`}
                  state={{ movie }}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    sx={{
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 4,
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={movie.imageUrl || "https://placehold.co/300x300"}
                      alt={movie.title}
                      style={{
                        width: "300px",
                        height: "300px", 
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid2>
            ))}
          </Grid2>
        )}
      </Container>
    </>
  );
};

export default Movies;
