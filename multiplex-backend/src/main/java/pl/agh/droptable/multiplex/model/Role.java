package pl.agh.droptable.multiplex.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.List;

public enum Role {
    NORMAL_USER(0),
    EMPLOYEE(1),
    MANAGER(2),
    ADMINISTRATOR(3);

    private final int value;

    Role(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static Role fromInt(int value) {
        for (Role role : Role.values()) {
            if (role.getValue() == value) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown value: " + value);
    }

    public static List<GrantedAuthority> getAuthoritiesUpTo(int permissionLevel) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : Role.values()) {
            if (role.getValue() <= permissionLevel) {
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
            }
        }
        return authorities;
    }
}