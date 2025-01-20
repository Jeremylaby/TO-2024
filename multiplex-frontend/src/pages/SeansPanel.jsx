import React, {useEffect, useState} from "react";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import {Alert, Box, Button, List} from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from '@mui/material/InputAdornment';
import DropZone from "../components/SeansPanel/DropZone.jsx";
import DraggableItem from "../components/SeansPanel/DraggableItem.jsx";
import MovieElement from "../components/SeansPanel/MovieElement.jsx";
import RoomElement from "../components/SeansPanel/RoomElement.jsx";
import NavBar from "../components/NavBar.jsx";

const ItemType = {
    MOVIE: "MOVIE",
    ROOM: "ROOM",
};


const SeansPanel = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [originalMovies, setOriginalMovies] = useState([]);
    const [originalRooms, setOriginalRooms] = useState([]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [start, setStart] = useState("");
    const [price, setPrice] = useState("");

    const fetchMovies = async () => {
        try {
            const response = await fetch("/api/movie", {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) throw new Error(`Movies fetch failed: ${response.status}`);

            const data = await response.json();
            setOriginalMovies(data);
            setMovies(data);
        } catch (err) {
            setError(err.message);
        }
    };


    const fetchRooms = async () => {
        try {
            const response = await fetch("/api/room", {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'},
            });

            if (!response.ok) throw new Error(`Rooms fetch failed: ${response.status}`);

            const data = await response.json();
            setOriginalRooms(data);
            setRooms(data);
        } catch (err) {
            setError(err.message);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            await Promise.all([fetchMovies(), fetchRooms()]);
            setSelectedRoom(null)
            setSelectedMovie(null)
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleMovieDrop = (movie) => {
        console.log("Dropped movie:", movie);

        movie ? setMovies([...originalMovies].filter((m) => m.id !== movie.id)) : setMovies([...originalMovies])
        setSelectedMovie(movie);
    };

    const handleRoomDrop = (room) => {
        console.log("Dropped room:", room);

        room ? setRooms([...originalRooms].filter((r) => r.id !== room.id)) : setRooms([...originalRooms])
        setSelectedRoom(room)
    };
    const addSeans = (seansData) => {
        return fetch("/api/seans", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(seansData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => {
                console.log("Seans added successfully:", result);
                setErrorMessage(null)
                setSuccessMessage(`Seans added successfully`)
                return result;
            })
            .catch((error) => {
                console.error("Error adding seans:", error);
                setErrorMessage(`Error adding seans: ${error}`)
                setSuccessMessage(null)
            })

    };
    const handleSubmit = async () => {

        if (!start || !price || !selectedRoom || !selectedMovie || price <= 0) {
            setErrorMessage("Some data is missing")
            return;
        }
        const formattedStart = new Date(start).toISOString();
        const formattedPrice = parseFloat(price).toFixed(2);
        const seansData = {
            movieId: selectedMovie.id,
            roomId: selectedRoom.id,
            start: formattedStart,
            price: formattedPrice
        }
        addSeans(seansData)
    }
    const handleReset = () => {
        setErrorMessage(null)
        setSuccessMessage(null)
        setPrice("")
        setStart("")
        handleMovieDrop(null)
        handleRoomDrop(null)
    }


    if (loading) return (<h1>Loading...</h1>);
    if (error) return (<h1>Error: {error}</h1>);

    return (
        <DndProvider backend={HTML5Backend}>
            <NavBar/>
            <Box sx={{display: "flex", justifyContent: "space-between", padding: 3}}>
                <Box sx={{width: "30%"}}>
                    <Typography variant="h6">Movies</Typography>
                    <List sx={{maxHeight: "80vh", overflowY: "auto"}}>
                        {movies.map((movie) => (
                            <DraggableItem key={movie.id} item={movie} itemType={ItemType.MOVIE}>
                                <MovieElement movie={movie}/>
                            </DraggableItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{width: "40%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <Typography variant="h4" gutterBottom>
                        Seans Panel
                    </Typography>
                    {successMessage && <Alert severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                    <TextField
                        label="Start Time"
                        type="datetime-local"
                        margin={"normal"}
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        sx={{width: "80%"}}
                        slotProps={{inputLabel: {shrink: true}}}
                        required
                    />
                    <TextField
                        label="Price"
                        type="number"
                        margin="normal"
                        sx={{width: "80%"}}
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        slotProps={{
                            input: {
                                min: 0,
                                max: 100,
                                step: 0.01,
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }
                        }}


                    />


                    <DropZone selected={selectedMovie} onDrop={handleMovieDrop} acceptType={ItemType.MOVIE}>
                        {selectedMovie ? <MovieElement movie={selectedMovie}/> :
                            <Typography variant="body1">Drop Movie Here</Typography>}
                    </DropZone>
                    <DropZone selected={selectedRoom} onDrop={handleRoomDrop} acceptType={ItemType.ROOM}>
                        {selectedRoom ? <RoomElement room={selectedRoom}/> :
                            <Typography variant="body1">Drop Room Here</Typography>}
                    </DropZone>
                    <Button
                        variant="contained"
                        color="secoundary"

                        sx={{mt: 3, width: "80%"}}
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"

                        sx={{mt: 3, width: "80%"}}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </Box>
                <Box sx={{width: "30%"}}>
                    <Typography variant="h6">Rooms</Typography>
                    <List sx={{maxHeight: "80vh", overflowY: "auto"}}>
                        {rooms.map((room) => (
                            <DraggableItem key={room.id} item={room} itemType={ItemType.ROOM}>
                                <RoomElement room={room}/>
                            </DraggableItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default SeansPanel;
