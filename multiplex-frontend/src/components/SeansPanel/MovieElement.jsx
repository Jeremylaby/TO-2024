import {Avatar, Box, ListItemAvatar, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

const MovieElement = ({movie}) => (
    <Box sx={{display: "flex", alignItems: "center",
    }} >
        <ListItemAvatar>
            <Avatar
                variant="rounded"
                src={movie.imageUrl || "https://placehold.co/80x80"}
                alt={movie.title}
                sx={{width: 80, height: 80, borderRadius: "8px", marginRight: 2}}
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
);export default MovieElement