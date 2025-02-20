package me.davidpineiro.davidpineiroxyz.services;

import me.davidpineiro.davidpineiroxyz.model.User;

import java.util.List;

public interface UserService {

    User createUser(User user);

    User updateUser(User user);

    List<User> getAllUsers();

    User getUserById(long userId);

    void deleteUser(long userId);

}
