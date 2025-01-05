package pl.agh.droptable.multiplex.dto;

import pl.agh.droptable.multiplex.model.User;

public record UserDTO(long id, String email, String firstname, String lastname) {

    public static UserDTO fromUser(User user) {
        return new UserDTO(user.getId(), user.getEmail(), user.getFirstName(), user.getLastName());
    }

    public User toUser() {
        var user = new User();
        user.setId(id);
        user.setEmail(email);
        user.setFirstName(firstname);
        user.setLastName(lastname);
        return user;
    }
}
