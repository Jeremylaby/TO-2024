import {useDrag} from "react-dnd";
import {ListItem} from "@mui/material";
import React from "react";

const DraggableItem = ({item, itemType, children}) => {
    const [{isDragging}, drag] = useDrag(() => ({
        type: itemType,
        item: {...item},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <ListItem
            ref={drag}
            sx={{
                cursor: "grab",
                opacity: isDragging ? 0.9 : 1,
                backgroundColor: "background.paper",
                padding: 1,
                marginBottom: 1,
                transition: "background-color 0.3s ease",
                "&:hover": {
                    backgroundColor: "#555",
                },
            }}
        >
            {children}
        </ListItem>
    );
};export default DraggableItem;