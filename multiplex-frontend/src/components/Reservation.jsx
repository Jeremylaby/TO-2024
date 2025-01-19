import {Box, Grid2, TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

const Reservation = ({reservation, onClick}) => {
    const date = new Date(reservation.start);

    // Formatowanie daty
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(date);

    // Formatowanie czasu
    const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
    return (
        <TableRow onClick={onClick}>
            <TableCell >
                <Grid2 container columns={12} spacing={2} sx={{
                    backgroundColor: "#f8f6f1",
                    color:"black",
                    borderRadius: 2,
                    overflow: "hidden",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: 4,
                        },
                }}>
                    <Grid2 size={{sm: 3, xs: 12}}>
                        <Box
                            component="img"
                            src={reservation.movie.imageUrl || "https://placehold.co/320x400"}
                            alt={reservation.movie.title}
                            sx={{
                                height: "100%",
                                width: "100%",
                            }}
                        />
                    </Grid2>


                    <Grid2 item size={{sm: 5, xs: 12}} sx={{
                        padding: 2,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}>
                        <Grid2 size={12}>
                            <Typography variant="subtitle2" color="textSecondary">
                                MOVIE TICKET
                            </Typography>
                            <Typography variant="h2" sx={{
                                fontWeight: "bold",
                                whiteSpace: "normal",
                                wordWrap: "break-word",
                            }}>
                                {reservation.movie.title}
                            </Typography>
                            <Typography variant="subtitle2" color="textSecondary">
                                Director: {reservation.movie.director || "Unknown"}
                            </Typography>
                            <Typography variant="body2" sx={{mt: 1, mb: 2}}>
                                123 Alekino St., Krakow
                            </Typography>
                            <Typography variant="caption" sx={{mt: 1, mb: 2}}>
                                Owner: {reservation.firstName} {reservation.lastName}
                            </Typography>
                            <Box sx={{
                                pt:1,
                                display:"flex",
                                flexDirection: {
                                    xs: "column",
                                    sm: "row",
                                },
                            }}>
                                <Typography variant="body2" color="black">
                                    Genres: {reservation.movie.genres.map((genre)=>genre.name).join(", ") || "N/A"}
                                </Typography>
                            </Box>

                            {!reservation.paid&&(<Typography color={"error"} variant="body1" sx={{mt: 1, mb: 2}}>
                                Not paid
                            </Typography>)}
                        </Grid2>
                        <Grid2 container size={12} spacing={1} sx={{
                            mt: 1, mb: 2,
                            display: "flex",
                            flexDirection: {xs:"column",sm:"row"},
                            justifyContent: "space-between",
                        }}>
                            {[`Date: ${formattedDate}`, `Time: ${formattedTime}`, `PRICE: $${reservation.price}`].map((text, index) => (
                                <Grid2 item xs={4} key={index}>
                                    <Box
                                        sx={{
                                            border: "2px solid black",
                                            borderRadius: "12px",
                                            textAlign: "center",
                                            padding: 1,
                                        }}
                                    >
                                        <Typography variant="body2" sx={{
                                            fontWeight: "bold",
                                        }}>{text}</Typography>
                                    </Box>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Grid2>
                    <Grid2 size ={1}>
                    </Grid2>
                    <Grid2
                        size={{sm: 1, xs: 12}}
                        sx={{
                            borderLeft: {sm: "2px dashed"},
                            borderTop: {xs: "2px dashed", sm: "0px"},
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Box
                            component="img"
                            src="/barcodeplaceholder.png"
                            sx={{
                                transform: {sm: "rotate(-90deg)"},
                                width: {xs: "200px", sm: "150px"}
                            }}
                        />
                    </Grid2>
                    <Grid2 container size={{sm: 1, xs: 12}} spacing={0} columns={12} sx={{
                        pl: {sm: 0, xs: 4},
                        pr: {sm: 0, xs: 4},
                        pt: {sm: 4},
                        pb: {sm: 4},
                    }}>


                        {/* Drugi Grid z "Seat", "Row", "Room" */}
                        <Grid2
                            item
                            size={{ xs: 12, sm: 6 }}
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "row", sm: "column" },
                                justifyContent: "space-between",
                                alignItems: "center", // Wyśrodkowanie elementów
                            }}
                        >
                            {[
                                { label: "Row", value: reservation.row },
                                { label: "Seat", value: reservation.seatNumber },
                                { label: "Room", value: reservation.roomName },
                            ].map((item, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        transform: { sm: "rotate(180deg)" }, // Obrót całego Boxa
                                        writingMode: { sm: "vertical-rl" }, // Tekst w trybie pionowym
                                    }}
                                >
                                    <Typography variant="body2" >
                                        {item.label}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: "bold" }}>{item.value}</Typography>
                                </Box>
                            ))}
                        </Grid2>

                    </Grid2>
                    <Grid2
                        item
                        size={{xs: 12, sm: 1}}
                        sx={{
                            backgroundColor: "#080707",
                            color: "white",
                            display: "flex",
                            flexDirection: {xs: "row-reverse", sm: "column"},
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                transform: {sm: "rotate(180deg)"},
                                writingMode: {sm: "vertical-rl"},
                            }}
                        >
                            {reservation.id}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                mt: {sm: 5},
                                mr: {xs: 5, sm: 0},
                                transform: {sm: "rotate(180deg)"},
                                writingMode: {sm: "vertical-rl"},
                            }}
                        >
                            Reservation ID:
                        </Typography>
                    </Grid2>


                </Grid2>
            </TableCell>
        </TableRow>)
};
export default Reservation