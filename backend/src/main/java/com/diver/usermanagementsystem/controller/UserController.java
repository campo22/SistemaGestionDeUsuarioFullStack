package com.diver.usermanagementsystem.controller;

// Importaciones necesarias para el controlador
import com.diver.usermanagementsystem.dto.ReqRes;
import com.diver.usermanagementsystem.entity.OurUsers;
import com.diver.usermanagementsystem.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

// Esta clase es un controlador REST que maneja las solicitudes relacionadas con la gestión de usuarios
@RestController
public class UserController {

    // Inyección del servicio que contiene la lógica de negocio para la gestión de usuarios
    @Autowired
    private UserManagementService usersManagementService;

    /**
     * Registro de nuevos usuarios
     * Endpoint: POST /auth/register
     * @param reg Objeto que contiene los datos del nuevo usuario
     * @return Respuesta con el estado del registro
     */
    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> regeister(@RequestBody ReqRes reg){
        return ResponseEntity.ok(usersManagementService.registerUser(reg));
    }

    /**
     * Inicio de sesión (login)
     * Endpoint: POST /auth/login
     * @param req Objeto con las credenciales del usuario (email y contraseña)
     * @return Respuesta con token JWT si las credenciales son válidas
     */
    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    /**
     * Renovación del token JWT (refresh token)
     * Endpoint: POST /auth/refresh
     * @param req Objeto que contiene el refresh token
     * @return Nuevo access token si el refresh token es válido
     */
    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req){
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    /**
     * Obtener todos los usuarios del sistema
     * Solo accesible para administradores
     * Endpoint: GET /admin/get-all-users
     * @return Lista de todos los usuarios registrados
     */
    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers(){
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    /**
     * Obtener un usuario por su ID
     * Endpoint: GET /admin/get-users/{userId}
     * @param userId ID del usuario a buscar
     * @return Datos del usuario correspondiente
     */
    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUSerByID(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.getUserById(userId));
    }

    /**
     * Actualizar los datos de un usuario
     * Endpoint: PUT /admin/update/{userId}
     * @param userId ID del usuario a actualizar
     * @param reqres Objeto con los nuevos datos del usuario
     * @return Usuario actualizado
     */
    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres){
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    /**
     * Obtener el perfil del usuario autenticado
     * Endpoint: GET /adminuser/get-profile
     * @return Datos del usuario autenticado, basado en el token JWT
     */
    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile(){
        // Obtener el usuario autenticado desde el contexto de seguridad
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // Obtener el email del usuario autenticado
        ReqRes response = usersManagementService.getMyInfo(email); // Buscar info del usuario por su email
        return  ResponseEntity.status(response.getStatus()).body(response);
    }

    /**
     * Eliminar un usuario por su ID
     * Endpoint: DELETE /admin/delete/{userId}
     * @param userId ID del usuario a eliminar
     * @return Estado de la eliminación
     */
    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUSer(@PathVariable Integer userId){
        return ResponseEntity.ok(usersManagementService.deleteteUserById(userId));
    }

}
