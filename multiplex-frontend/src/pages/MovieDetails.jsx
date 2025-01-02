import React, { useEffect, useState } from "react";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import { useParams } from "react-router-dom";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import NavBar from "../components/NavBar.jsx";
import {
  Container,
  Typography,
  Alert,
  Card,
  CardContent,
  Box,
  Button,
  Grid2,
} from "@mui/material";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [seanses, setSeanses] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [error, setError] = useState(null);

  const customStaticRanges = defaultStaticRanges.filter((range) =>
    ["Today", "This Week", "This Month"].includes(range.label)
  );

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movie/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch movie details.");
        }
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const fetchAllSeanses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/movie/seanses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch all seanses for the movie.");
        }
        const data = await response.json();
        setSeanses(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAllSeanses();
  }, [id]);

  const applyFilter = async () => {
    const { startDate, endDate } = dateRange[0];
    if (!startDate || !endDate) return;

    try {
      const response = await fetch(
        `/api/seans/all/between-dates-movie?movieId=${id}&start=${startDate.toISOString()}&end=${endDate.toISOString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch filtered seanses.");
      }
      const data = await response.json();
      setSeanses(data);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
    <NavBar/>
    <Container sx={{ py: 4 }}>
      {movie && (
        <>
          <Box sx={{ display: "flex", gap: 4, mb: 4 }}>
            <img
              src={movie.imageUrl || "https://placehold.co/300x300"}
              alt={movie.title}
              style={{
                width: "300px",
                height: "300px", 
                objectFit: "cover",
                borderRadius: "8px", 
              }}
            />
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {movie.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Director:</strong> {movie.director}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Duration:</strong> {movie.duration} min
              </Typography>
              <Typography variant="body1">{movie.description}</Typography>
            </Box>
          </Box>
        </>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Select date range:
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            transform: "scale(0.9)",
            transformOrigin: "top left",
          }}
        >
          <DateRangePicker
            ranges={dateRange}
            onChange={(ranges) => setDateRange([ranges.selection])}
            moveRangeOnFirstSelection={false}
            minDate={new Date()} 
            staticRanges={customStaticRanges}
            inputRanges={[]}
          />
        </Box>
        <Button variant="contained" sx={{ mt: 2 }} onClick={applyFilter}>
          Apply Filter
        </Button>
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Seans List
      </Typography>
      <Grid2 container spacing={3}>
        {seanses.map((seans) => (
          <Grid2 xs={12} sm={6} md={4} key={seans.id}>
            <Card>
              <CardContent>
                <Typography variant="body2">
                  <strong>Start:</strong> {new Date(seans.start).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>End:</strong> {new Date(seans.endTime).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  <strong>Price:</strong> {seans.price} PLN
                </Typography>
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
    </>
  );
};

export default MovieDetails;
