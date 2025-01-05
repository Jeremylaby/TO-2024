package pl.agh.droptable.multiplex.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import pl.agh.droptable.multiplex.model.Room;

public record RoomDTO(@Nullable Long id,
                      @NotNull String name,
                      @NotNull int capacity) {
    public Room toRoom() {
        var room = new Room();
        room.setId(id);
        room.setName(name);
        room.setCapacity(capacity);
        return room;
    }
}
