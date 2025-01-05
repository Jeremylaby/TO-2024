import React, { useEffect, useState } from "react";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import { useParams, useNavigate } from "react-router-dom";
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
  Modal,
  Grid2,
} from "@mui/material";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
      setIsCalendarOpen(false);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSeansClick = (seansId) => {
    navigate(`/seats/${seansId}`);
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <NavBar />
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
              <Box sx={{ textAlign: "left" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  {movie.title}
                </Typography>
                <Typography variant="body1">
                  <strong>Director:</strong> {movie.director}
                </Typography>
                <Typography variant="body1">
                  <strong>Duration:</strong> {movie.duration} min
                </Typography>
                <Typography variant="body1">{movie.description}</Typography>
              </Box>
            </Box>
          </>
        )}

        <Box sx={{ mb: 4 }}>
          <Button
            variant="contained"
            onClick={() => setIsCalendarOpen(true)}
          >
            Select Date Range
          </Button>

          <Modal
            open={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Box
              sx={{
                backgroundColor: "white",
                p: 4,
                borderRadius: "8px",
                boxShadow: 24,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Select date range:
              </Typography>
              <DateRangePicker
                ranges={dateRange}
                onChange={(ranges) => setDateRange([ranges.selection])}
                moveRangeOnFirstSelection={false}
                minDate={new Date()}
                staticRanges={customStaticRanges}
                inputRanges={[]}
              />
              <Box sx={{ mt: 2, textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={applyFilter}
                  sx={{ mr: 2 }}
                >
                  Apply
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setIsCalendarOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </Modal>
        </Box>

        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Seans List
        </Typography>
        <Grid2 container spacing={3}>
          {seanses.map((seans) => (
            <Grid2 xs={12} sm={6} md={4} key={seans.id}>
              <Card
                onClick={() => handleSeansClick(seans.id)}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="body2">
                    <strong>Start:</strong> {new Date(seans.start).toLocaleString()}
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