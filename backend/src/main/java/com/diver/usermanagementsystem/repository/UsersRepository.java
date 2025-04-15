package com.diver.usermanagementsystem.repository;

import com.diver.usermanagementsystem.entity.OurUsers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<OurUsers, Integer> {

    // Metodo para buscar un usuario por su correo electrónico
    Optional<OurUsers> findByEmail(String email);

}
