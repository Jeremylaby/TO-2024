import React, {useEffect, useState} from "react";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";

import Checkbox from "@mui/material/Checkbox";
import NavBar from "../components/NavBar.jsx";

const MovieCreationPanel = () => {
    const inputProps = {
        inputLabel: {style: {color: "gray"}},
        input: {style: {color: "gray"}}
    }
    const [title, setTitle] = useState("");
    const [director, setDirector] = useState("");
    const [duration, setDuration] = useState(0);
    const [imageUrl, setImageUrl] = useState("");
    const [genres, setGenres] = useState([]);
    const [submited, setSubmited] = useState(false)
    const [availableGenres, setAvailableGenres] = useState([]);
    const [isValid, setValid] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const handleImageChange = (e) => {
        const url = e.target.value;
        setImageUrl(url);
        if (url.match(/\.(jpeg|jpg|gif|png|webp|bmp)$/i)) {
            setValid(true);
        } else {
            setValid(false);
        }
    }
    const addMovie = (movieData) => {
        return fetch("/api/movie", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(movieData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => {
                console.log("Movie added successfully:", result);
                setErrorMessage(null)
                setSuccessMessage(`Movie" "${movieData.title}" added successfully`)
                return result;
            })
            .catch((error) => {
                console.error("Error adding movie:", error);
                setErrorMessage(`Error adding movie: ${error}`)
                setSuccessMessage(null)
            })

    };
    useEffect(() => {


        const fetchGenres = async () => {
            try {
                const response = await fetch("/api/genre");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setAvailableGenres(data);
            } catch (error) {
                console.error("Error fetching genres", error);
            }
        };

        fetchGenres()
    }, []);


    const handleGenreChange = (event) => {
        const {
            target: {value},
        } = event;
        setGenres(typeof value === "string" ? value.split(",") : value);

    };
    const handleSubmit = async () => {
        const movieData = {
            title,
            director,
            duration,
            genreIds: genres,
        };
        if (!title || !director || !imageUrl || !genres || duration === 0 || genres.length === 0) {
            setSubmited(true)
            return
        }
        console.log("Movie data:", movieData);
        addMovie(movieData).then(() => {
            setTitle("");
            setDirector("");
            setDuration(0);
            setImageUrl("");
            setGenres([]);
            setSubmited(false)
        });

    };

    return (
        <Box>
            <NavBar/>
            <Box sx={{
                maxWidth: {sm: 600, xs: "100%"},
                mx: {sm: "auto", xs: 3},
                mt: {sm: 5, xs: 2},
            }}>
                <Typography variant="h4" gutterBottom>
                    Movie Panel
                </Typography>
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {imageUrl && isValid && (<img
                        style={{
                            display: "block",
                            width: "100%",
                            height: "auto",
                            marginTop: "16px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                        src={`${imageUrl}`}
                        loading="lazy"
                        alt={"movie-picture"}/>
                )
                }
                <TextField
                    fullWidth
                    error={!title && submited}
                    helperText={!title && submited ? "Title is required!" : ""}
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    slotProps={
                        inputProps
                    }

                />

                <TextField
                    fullWidth
                    error={!director && submited}
                    helperText={!director && submited ? "Director expected!" : ""}
                    label="Director"
                    value={director}
                    onChange={(e) => setDirector(e.target.value)}
                    margin="normal"
                    slotProps={
                        inputProps
                    }


                />

                <TextField
                    fullWidth
                    error={(duration <= 0 || duration > 300) && submited}
                    helperText={
                        duration <= 0 && submited
                            ? "Duration must be greater than zero!"
                            : duration > 300 && submited
                                ? "Duration cannot be more than 300 minutes!"
                                : ""
                    }
                    label="Duration (minutes)"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))
                    }
                    margin="normal"
                    slotProps={{
                        ...inputProps,
                        input: {
                            ...inputProps.input,
                            min: 1,
                            max: 300,
                            step: 1
                        }
                    }}
                />


                <TextField
                    fullWidth
                    error={!imageUrl && submited}
                    helperText={!imageUrl && submited ? "Image URL expected" : ""}
                    label="Image URL"
                    value={imageUrl}
                    onChange={handleImageChange}
                    margin="normal"
                    slotProps={
                        inputProps
                    }

                />

                <FormControl fullWidth margin="normal" error={genres.length === 0 && submited}>
                    <InputLabel sx={{color: "gray"}}>Genres</InputLabel>
                    <Select
                        sx={{color: "gray"}}
                        variant="outlined"
                        label={"Genres"}
                        multiple
                        value={genres}
                        onChange={handleGenreChange}
                        renderValue={(selected) =>
                            selected
                                .map(
                                    (id) =>
                                        availableGenres.find((genre) => genre.id === id)?.name || ""
                                )
                                .join(", ")
                        }
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    maxHeight: 200,
                                    backgroundColor: "#0",
                                    color: "gray",
                                },
                            },
                        }}
                    >
                        {availableGenres.map((genre) => (
                            <MenuItem key={genre.id} value={genre.id}>
                                <Checkbox checked={genres.indexOf(genre.id) > -1}/>
                                <ListItemText sx={{color: "gray"}} primary={genre.name}/>
                            </MenuItem>
                        ))}
                    </Select>
                    {genres.length === 0 && submited && (
                        <FormHelperText>Choose at least one genre</FormHelperText>
                    )}
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{mt: 3}}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </Box>

    )
        ;
};

export default MovieCreationPanel;
