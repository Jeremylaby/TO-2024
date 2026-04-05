import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar.jsx";
import {
  Container,
  TextField,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Pagination,
  Divider,
  Tabs,
  Tab
} from '@mui/material';
import { Search, Clock } from 'lucide-react';

const Movies = () => {
  const [currentMovies, setCurrentMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  
  const [searchCriteria, setSearchCriteria] = useState({
    title: '',
    director: '',
    genres: ''
  });

  // Fetch currently playing movies
  useEffect(() => {
    const fetchCurrentMovies = async () => {
      try {
        const response = await fetch("/api/seans/currently-playing", {
          credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to fetch current movies.");
        const data = await response.json();
        setCurrentMovies(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCurrentMovies();
  }, []);

  // Fetch genres for the dropdown
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch('/api/genre', {
          credentials: 'include'
        });
        if (!response.ok) throw new Error('Failed to fetch genres');
        const data = await response.json();
        setGenres(data);
      } catch (err) {
        setError('Failed to load genres');
      }
    };
    
    fetchGenres();
  }, []);

  // Search movies
  const searchMovies = async () => {
    if (!searchCriteria.title && !searchCriteria.director && !searchCriteria.genres) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: '8'
      });
      
      if (searchCriteria.title) params.append('title', searchCriteria.title);
      if (searchCriteria.director) params.append('director', searchCriteria.director);
      if (searchCriteria.genres) params.append('genres', searchCriteria.genres);
      
      const response = await fetch(`/api/movie/search?${params}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch movies');
      
      const data = await response.json();
      setSearchResults(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to search movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1) {
      searchMovies();
    }
  }, [page, searchCriteria, activeTab]);

  const handleCriteriaChange = (field) => (event) => {
    setSearchCriteria(prev => ({
      ...prev,
      [field]: event.target.value
    }));
    setPage(0);
  };

  const MovieCard = ({ movie }) => (
    <Grid item xs={12} sm={6} md={3}>
      <Link
        to={`/movie-details/${movie.id}`}
        state={{ movie }}
        style={{ textDecoration: "none" }}
      >
        <Card
          sx={{
            height: '100%',
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
              borderRadius: "8px 8px 0 0",
            }}
          />
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              {movie.title}
            </Typography>
            {activeTab === 1 && (
              <>
                <Typography variant="body2" color="text.secondary">
                  {movie.director}
                </Typography>
                <Typography variant="body2" className="flex items-center mt-1">
                  <Clock size={16} className="mr-1" />
                  {movie.duration} min
                </Typography>
              </>
            )}
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );

  return (
    <>
      <NavBar />
      <Container sx={{ py: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
            <Tab label="Currently Playing" />
            <Tab label="Search Movies" />
          </Tabs>
        </Box>

        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

        {activeTab === 0 && (
          <>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
              Currently playing movies
            </Typography>
            <Grid container spacing={3}>
              {currentMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </Grid>
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: "bold" }}>
                Search Movies
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={searchCriteria.title}
                    onChange={handleCriteriaChange('title')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Director"
                    value={searchCriteria.director}
                    onChange={handleCriteriaChange('director')}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Genre</InputLabel>
                    <Select
                      value={searchCriteria.genres}
                      label="Genre"
                      onChange={handleCriteriaChange('genres')}
                    >
                      <MenuItem value="">All Genres</MenuItem>
                      {genres.map(genre => (
                        <MenuItem key={genre.id} value={genre.id}>
                          {genre.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            {loading ? (
              <Box className="flex justify-center my-8">
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={3}>
                  {searchResults.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </Grid>

                {searchResults.length === 0 && !loading && (
                  <Typography className="text-center mt-6" color="text.secondary">
                    No movies found matching your criteria
                  </Typography>
                )}

                {totalPages > 1 && (
                  <Box className="flex justify-center mt-6">
                    <Pagination 
                      count={totalPages} 
                      page={page + 1} 
                      onChange={(_, newPage) => setPage(newPage - 1)}
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default Movies;