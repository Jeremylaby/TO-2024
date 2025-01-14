import React, {useState, useEffect} from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Container, 
  Typography, 
  Alert,
  Box,
  LinearProgress,
  Tooltip
} from '@mui/material';
import { Projector, CircleDollarSign } from 'lucide-react';
import NavBar from "../components/NavBar.jsx";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [maxRevenue, setMaxRevenue] = useState(0);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch("api/analytics/movies", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch analytics.");
        }
        const data = await response.json();
        setData(data);
        const max = data.reduce((max, record) => Math.max(max, record.revenue), 0);
        setMaxRevenue(max);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMovies();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <NavBar />
      <Container className="py-8">
        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        {!error && (
          <>
            <div className="mb-6 flex items-center">
              <Projector className="mr-2" />
              <Typography variant="h4" component="h1">
                Movie Revenue Analytics
              </Typography>
            </div>

            <Grid container spacing={3}>
              {data.map((record, index) => {
                const movie = record.movie;
                const revenue = record.revenue;
                const progress = (revenue / maxRevenue) * 100;

                return (
                  <Grid item xs={12} md={6} key={movie.id}>
                    <Card className="h-full">
                      <CardContent>
                        <Typography variant="h6" className="mb-2">
                          {movie.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" className="mb-1">
                          Director: {movie.director}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" className="mb-3">
                          Duration: {movie.duration} minutes
                        </Typography>

                        <div className="flex items-center mb-2">
                          <CircleDollarSign className="mr-1" size={20} />
                          <Typography variant="h6" color="primary">
                            {formatCurrency(revenue)}
                          </Typography>
                        </div>

                        <Tooltip title={`${progress.toFixed(1)}% of highest revenue`}>
                          <Box className="w-full">
                            <LinearProgress 
                              variant="determinate" 
                              value={progress}
                              className="h-2 rounded"
                            />
                          </Box>
                        </Tooltip>
                      </CardContent>
                    </Card>
                  </Grid>
                )})}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
};

export default Analytics;