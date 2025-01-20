import React, { useEffect, useState, useCallback } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";

const ItemType = {
    MOVIE: "MOVIE",
    ROOM: "ROOM",
};

const DraggableItem = ({ item, itemType, children }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: itemType,
        item: { ...item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <ListItem
            ref={drag}
            sx={{
                cursor: "grab",
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: "background.paper",
                padding: 1,
                marginBottom: 1,
            }}
        >
            {children}
        </ListItem>
    );
};

const MovieElement = ({ movie }) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListItemAvatar>
            <Avatar
                variant="rounded"
                src={movie.imageUrl || "https://placehold.co/80x80"}
                alt={movie.title}
                sx={{ width: 80, height: 80, borderRadius: "8px", marginRight: 2 }}
            />
        </ListItemAvatar>
        <ListItemText
            primary={<Typography variant="subtitle1" fontWeight="bold">{movie.title}</Typography>}
            secondary={
                <>
                    <Typography variant="body2" color="text.secondary">
                        Director: {movie.director || "Unknown"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Genres: {movie.genres.map((genre) => genre.name).join(", ") || "N/A"}
                    </Typography>
                </>
            }
        />
    </Box>
);

const RoomElement = ({ room }) => (
    <Box sx={{ display: "flex", alignItems: "center" }}>
        <ListItemAvatar>
            <Avatar
                variant="rounded"
                src={"/theater.png"}
                alt={room.name}
                sx={{ width: 80, height: 80, borderRadius: "8px", marginRight: 2 }}
            />
        </ListItemAvatar>
        <ListItemText
            primary={<Typography variant="subtitle1" fontWeight="bold">{room.name}</Typography>}
            secondary={
                <Typography variant="body2" color="text.secondary">
                    Capacity: {room.capacity}
                </Typography>
            }
        />
    </Box>
);

const DropZone = ({ selected, onDrop, label, acceptType }) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: acceptType,
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    return (
        <Paper
            ref={drop}
            sx={{
                minHeight: 100,
                width: "80%",
                backgroundColor: isOver ? "lightblue" : "background.default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: 2,
                padding: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="body1">
                {selected ? (acceptType === ItemType.MOVIE ? selected.title : selected.name) : `Drop ${label} here`}
            </Typography>
        </Paper>
    );
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

    const fetchMovies = async () => {
        try {
            const response = await fetch("/api/movie", {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`Movies fetch failed: ${response.status}`);

            const data = await response.json();
            setOriginalMovies(data); // Zapisujemy oryginalną listę
            setMovies(data);
        } catch (err) {
            setError(err.message);
        }
    };

    // Pobieranie pokoi
    const fetchRooms = async () => {
        try {
            const response = await fetch("/api/room", {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error(`Rooms fetch failed: ${response.status}`);

            const data = await response.json();
            setOriginalRooms(data); // Zapisujemy oryginalną listę
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
        setMovies([...originalMovies].filter((m)=>m.id!==movie.id))
        setSelectedMovie(movie);
    };

    const handleRoomDrop = (room) => {
        console.log("Dropped room:", room);

        setRooms([...originalRooms].filter((r)=>r.id!==room.id))
        setSelectedRoom(room)
    };



    if (loading) return (<h1>Loading...</h1>);
    if (error) return (<h1>Error: {error}</h1>);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box sx={{ display: "flex", justifyContent: "space-between", padding: 3 }}>
                <Box sx={{ width: "30%" }}>
                    <Typography variant="h6">Movies</Typography>
                    <List>
                        {movies.map((movie) => (
                            <DraggableItem key={movie.id} item={movie} itemType={ItemType.MOVIE}>
                                <MovieElement movie={movie} />
                            </DraggableItem>
                        ))}
                    </List>
                </Box>

                <Box sx={{ width: "40%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h6">Seans Configuration</Typography>
                    <DropZone selected={selectedMovie} onDrop={handleMovieDrop} label="Movie" acceptType={ItemType.MOVIE} />
                    <DropZone selected={selectedRoom} onDrop={handleRoomDrop} label="Room" acceptType={ItemType.ROOM} />
                </Box>
                <Box sx={{ width: "30%" }}>
                    <Typography variant="h6">Rooms</Typography>
                    <List>
                        {rooms.map((room) => (
                            <DraggableItem key={room.id} item={room} itemType={ItemType.ROOM}>
                                <RoomElement room={room} />
                            </DraggableItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </DndProvider>
    );
};

export default SeansPanel;
