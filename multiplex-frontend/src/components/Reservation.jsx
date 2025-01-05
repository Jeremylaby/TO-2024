import {Box, Grid2, TableCell, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";

const Reservation = ({reservation}) => {
    const date = new Date(reservation.start);

    // Formatowanie daty
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        month: "short", // Skrót miesiąca
        day: "numeric", // Dzień
        year: "numeric", // Rok
    }).format(date);

    // Formatowanie czasu
    const formattedTime = new Intl.DateTimeFormat("en-US", {
        hour: "numeric", // Godzina
        minute: "2-digit", // Minuty
        hour12: true, // Format 12-godzinny (AM/PM)
    }).format(date);
    return (
        <TableRow>
            <TableCell>
                <Grid2 container columns={12} spacing={2} sx={{
                    backgroundColor: "#f8f6f1",
                    borderRadius: 2,
                    overflow: "hidden",
                }}>
                    <Grid2 size={{sm: 3, xs: 12}}>
                        <Box
                            component="img"
                            src="https://placehold.co/320x400"
                            alt="Event"
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
                                Director: {reservation.movie.director}
                            </Typography>
                            <Typography variant="body2" sx={{mt: 1, mb: 2}}>
                                123 Alekino St., Krakow
                            </Typography>
                            <Typography variant="caption" sx={{mt: 1, mb: 2}}>
                                Owner: {reservation.firstName} {reservation.lastName}
                            </Typography>

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
                            size={{xs: 12, sm: 6}}
                            sx={{
                                display: "flex",
                                flexDirection: {xs: "row", sm: "column"},
                                justifyContent: "space-between",
                                alignItems:"end"

                            }}
                        >
                            {["Seat", "Row", "Room"].map((label, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        transform: {sm: "rotate(180deg)"},
                                        writingMode: {sm: "vertical-rl"},
                                    }}
                                >
                                    {label}
                                </Typography>
                            ))}
                        </Grid2>

                        {/* Trzeci Grid z danymi rezerwacji */}
                        <Grid2
                            item
                            size={{xs: 12, sm: 6}}
                            sx={{
                                pt: {sm: 1},
                                pb: {sm: 1},
                                pl: {sm: 0, xs: 1},
                                pr: {sm: 0, xs: 1},
                                display: "flex",
                                flexDirection: {xs: "row", sm: "column"},
                                justifyContent: "space-between",
                            }}
                        >
                            {[reservation.row, reservation.seatNumber, reservation.roomName].map((label, index) => (
                                <Typography
                                    key={index}
                                    variant="h5"
                                    sx={{
                                        transform: {sm: "rotate(180deg)"},
                                        writingMode: {sm: "vertical-rl"},
                                        fontWeight: "bold",
                                    }}
                                >
                                    {label}
                                </Typography>
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