import React, {useState} from "react";
import {Alert, Box, Button, Grid2} from "@mui/material"
import NavBar from "../components/NavBar.jsx";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";


const RoomPanel = () => {
    const [rows, setRows] = useState(5);
    const [seatsPerRow, setSeatsPerRow] = useState(
        Array.from({length: rows}, () => 5)
    );
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [roomName, setRoomName] = useState("")
    const handleSeatChange = (rowIndex, value) => {
        const newSeats = [...seatsPerRow];
        newSeats[rowIndex] = value;
        setSeatsPerRow(newSeats);
    };
    const addRoom = (roomData) => {
        return fetch("/api/room/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(roomData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => {
                console.log("room added successfully:", result);
                setErrorMessage(null)
                setSuccessMessage(`Room "${roomName}" added successfully`)
                return result;
            })
            .catch((error) => {
                console.error("Error adding room:", error);
                setErrorMessage(`Error adding room: ${error}`)
                setSuccessMessage(null)
            })

    };
    const handleSubmit = async () => {
        if (!rows || rows <= 0) {
            setErrorMessage("Add at least one row");
            setSuccessMessage(null);
            return
        }
        if (!roomName) {
            setErrorMessage("Room Name required!");
            setSuccessMessage(null);
            return
        }
        if (!seatsPerRow || seatsPerRow.slice(0, rows).some((row) => row.length === 0)) {
            setErrorMessage("At least one row is empty!");
            setSuccessMessage(null);
            return
        }
        const seats = seatsPerRow
            .slice(0, rows)
            .flatMap((seatCount, rowIndex) =>
                Array.from({length: seatCount}, (_, seatIndex) => ({
                    row: rowIndex,
                    seatNumber: seatIndex
                }))
            );
        console.log(seats);
        const roomData = {
            roomName: roomName,
            seats: seats
        }

        addRoom(roomData);
    }
    return (
        <Box>
            <NavBar/>
            <Box padding={3}>
                <Typography variant="h4" gutterBottom>
                    Room Panel
                </Typography>
                <Box sx={{display: "flex", justifyContent: "center"}}>
                    {successMessage && <Alert sx={{width: "30%"}} severity="success">{successMessage}</Alert>}
                    {errorMessage && <Alert sx={{width: "30%"}} severity="error">{errorMessage}</Alert>}
                </Box>

                <Box>

                    <TextField
                        label="Nuber of Rows"
                        type="number"
                        margin="normal"
                        sx={{width: "60%"}}
                        value={rows}
                        onChange={(e) => setRows(parseInt(e.target.value))}
                        required
                        slotProps={{
                            input: {
                                min: 0,
                                max: 20,
                                step: 1,
                            }
                        }}


                    />
                    <TextField
                        sx={{width: "60%"}}
                        label="Room Name"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        margin="normal"
                        s

                    />

                </Box>
                <Box>
                    {Array.from({length: rows}, (_, row) => (
                        <Box key={row} sx={{mb: 2, display: "flex", alignItems: "center"}}>
                            <Typography
                                variant="body2"
                                sx={{width: 50, textAlign: "center", fontWeight: "bold"}}
                            >
                                Row {row}
                            </Typography>
                            <Grid2
                                container
                                spacing={1}
                                sx={{
                                    flex: 1,
                                    justifyContent: "center",
                                }}
                            >
                                {Array.from({length: seatsPerRow[row]}, (_, seat) =>
                                    (
                                        <Grid2
                                            item
                                            key={seat}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box

                                                sx={{
                                                    width: 30,
                                                    height: 30,
                                                    borderRadius: "4px",
                                                    backgroundColor: "gray",
                                                    cursor: "not-allowed",
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    fontSize: "10px",
                                                    color: "white",
                                                    transition: "transform 0.2s, box-shadow 0.2s",
                                                    "&:hover":

                                                        {
                                                            transform: "scale(1.1)",
                                                            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                                                        },
                                                }}
                                            >
                                                {seat}
                                            </Box>
                                        </Grid2>
                                    ))}

                            </Grid2>
                            <TextField
                                select
                                label="Seats"
                                value={seatsPerRow[row]}
                                onChange={(e) => handleSeatChange(row, parseInt(e.target.value))}
                                sx={{width: 80, mr: 2}}
                                size="small"
                            >
                                {[...Array(20).keys()].map((num) => (
                                    <MenuItem key={num} value={num + 1}>
                                        {num + 1}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    ))}

                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{mt: 3, width: "60%"}}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    )
};
export default RoomPanel;