package me.davidpineiro.davidpineiroxyz.controller;

import me.davidpineiro.davidpineiroxyz.model.User;
import me.davidpineiro.davidpineiroxyz.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/api/user")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @GetMapping("/api/user/{id}")
    public ResponseEntity<User> getUserById(@PathVariable long id){
        return ResponseEntity.ok().body(userService.getUserById(id));
    }

    @PostMapping("/api/user")
    public ResponseEntity<User> createUser(@RequestBody User user){
        return ResponseEntity.ok().body(userService.createUser(user));
    }

    @PutMapping("/api/user/{id}")
    public ResponseEntity<User> updateUser(@PathVariable long id, @RequestBody User user){
        user.setId(id);
        return ResponseEntity.ok().body(userService.updateUser(user));
    }

    @DeleteMapping("/api/user/{id}")
    public HttpStatus deleteUser(@PathVariable long id){
        userService.deleteUser(id);
        return HttpStatus.OK;
    }

}
