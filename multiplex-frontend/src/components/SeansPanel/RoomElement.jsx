import {Avatar, Box, ListItemAvatar, ListItemText} from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

const RoomElement = ({room}) => (
    <Box sx={{display: "flex", alignItems: "center"}}>
        <ListItemAvatar>
            <Avatar
                variant="rounded"
                src={"/theater.png"}
                alt={room.name}
                sx={{width: 80, height: 80, borderRadius: "8px", marginRight: 2}}
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
);export default RoomElement