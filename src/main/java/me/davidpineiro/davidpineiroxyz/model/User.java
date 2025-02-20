package me.davidpineiro.davidpineiroxyz.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import javax.validation.constraints.Size;

import java.util.Date;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @Column(name = "name")
    private String name;

    @Size(min = 0, max = 255, message = "biography constraint, between 0 and 255")
    @Column(name = "bio")
    private String bio;

    @Column(name = "age")
    private int age;

    @CreationTimestamp
    private Date createdAt;

}
