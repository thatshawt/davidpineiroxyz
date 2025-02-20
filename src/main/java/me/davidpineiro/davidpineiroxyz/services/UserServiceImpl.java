package me.davidpineiro.davidpineiroxyz.services;

import me.davidpineiro.davidpineiroxyz.exceptions.UserNotFoundException;
import me.davidpineiro.davidpineiroxyz.model.User;
import me.davidpineiro.davidpineiroxyz.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User createUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User user) {
        Optional<User> userInDBMaybe = userRepository.findById(user.getId());

        if(userInDBMaybe.isPresent()){
            User userInDB = userInDBMaybe.get();

            userInDB.setId(user.getId());
            userInDB.setBio(user.getBio());
            userInDB.setName(user.getName());
            userInDB.setAge(user.getAge());

            userRepository.save(userInDB);
            return userInDB;
        }else{
            throw new UserNotFoundException("user not found!");
        }
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(long userId) {
        Optional<User> userInDBMaybe = userRepository.findById(userId);

        if(userInDBMaybe.isPresent()){
            User userInDB = userInDBMaybe.get();

            userRepository.save(userInDB);
            return userInDB;
        }else{
            throw new UserNotFoundException("user not found!");
        }
    }

    @Override
    public void deleteUser(long userId) {
        Optional<User> userInDBMaybe = userRepository.findById(userId);

        if(userInDBMaybe.isPresent()){
            User userInDB = userInDBMaybe.get();

            userRepository.delete(userInDB);
        }else{
            throw new UserNotFoundException("user not found!");
        }
    }
}
