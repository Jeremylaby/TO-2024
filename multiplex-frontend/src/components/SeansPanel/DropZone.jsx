import {useDrop} from "react-dnd";
import {ListItem, Paper} from "@mui/material";
import React from "react";

const DropZone = ({selected, onDrop, acceptType, children}) => {
    const [{isOver}, drop] = useDrop(() => ({
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
            <ListItem sx={{justifyContent: !selected && "center",}}>
                {children}
            </ListItem>
        </Paper>
    );
};export default DropZone;