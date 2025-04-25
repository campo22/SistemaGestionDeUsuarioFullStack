package com.diver.usermanagementsystem.service;

import com.diver.usermanagementsystem.dto.ReqRes;
import com.diver.usermanagementsystem.entity.OurUsers;
import com.diver.usermanagementsystem.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UserManagementService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtils jwtUtils;

    /**
     * Registra un nuevo usuario en el sistema
     */
    public ReqRes registerUser(ReqRes registrationRequest) {
        try {
            if (emailExists(registrationRequest.getEmail())) {
                return errorResponse(400, "El correo electrónico ya está registrado.");
            }

            // Mapeo de los datos del request al modelo OurUsers
            OurUsers userToSave = mapToUser(registrationRequest);
            userToSave.setRole("USER");

            // Guardar usuario en la base de datos
            OurUsers savedUser = usersRepository.save(userToSave);

            if (savedUser.getId() > 0) {
                ReqRes response = successResponse("Usuario registrado exitosamente");
                response.setOurUsers(savedUser);
                return response;
            } else {
                return errorResponse(500, "Error al guardar el usuario");
            }

        } catch (Exception e) {
            return errorResponse(500, "Error al registrar el usuario: " + e.getMessage());
        }
    }

    /**
     * Autentica un usuario y genera token JWT
     */
    public ReqRes login(ReqRes rep) {
        try {
            // Verifica las credenciales del usuario
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(rep.getEmail(), rep.getPassword())
            );

            OurUsers user = usersRepository.findByEmail(rep.getEmail()).orElse(null);

            if (user != null) {
                // Genera token de acceso y refresh token
                String token = jwtUtils.generateToken(user);
                String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

                rep.setStatus(200);
                rep.setMessage("Usuario autenticado con éxito");
                rep.setToken(token);
                rep.setRefreshToken(refreshToken);
                rep.setExpirationToken("1h");

                return rep;
            } else {
                return errorResponse(404, "El usuario no existe con este correo electrónico");
            }

        } catch (BadCredentialsException e) {
            return errorResponse(401, "Credenciales incorrectas");
        } catch (Exception e) {
            return errorResponse(500, "Error al iniciar sesión: " + e.getMessage());
        }
    }

    /**
     * Refresca el token de acceso si el refresh token es válido
     */
    public ReqRes refreshToken(ReqRes refresh) {
        ReqRes res = new ReqRes();
        try {
            // Validamos con el refreshToken, NO con el accessToken
            String email = jwtUtils.extractUsername(refresh.getRefreshToken());
            OurUsers user = usersRepository.findByEmail(email).orElseThrow();

            if (jwtUtils.isTokenValid(refresh.getRefreshToken(), user)) {
                String jwt = jwtUtils.generateToken(user);

                res.setStatus(200);
                res.setToken(jwt);
                res.setRefreshToken(refresh.getRefreshToken());
                res.setExpirationToken("1h"); // o lo que definas
                res.setMessage("Token refrescado con éxito");
            } else {
                return errorResponse(401, "Refresh token inválido o expirado");
            }

        } catch (Exception e) {
            return errorResponse(500, "Error al refrescar el token: " + e.getMessage());
        }
        return res;
    }


    /**
     * Obtiene todos los usuarios
     */
    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepository.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatus(200);
                reqRes.setMessage("Usuarios encontrados exitosamente");
            } else {
                reqRes.setStatus(404);
                reqRes.setMessage("No se encontraron usuarios");
            }
            return reqRes;
        } catch (Exception e) {
            return errorResponse(500, "Error al obtener usuarios: " + e.getMessage());
        }
    }

    /**
     * Obtiene un usuario por su ID
     */
    public ReqRes getUserById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers userById = usersRepository.findById(id).orElseThrow();
            reqRes.setOurUsers(userById);
            reqRes.setStatus(200);
            reqRes.setMessage("Usuario con ID " + id + " encontrado exitosamente");
        } catch (Exception e) {
            return errorResponse(500, "Error al obtener usuario: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Elimina un usuario por su ID
     */
    public ReqRes deleteteUserById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userById = usersRepository.findById(id);
            if (userById.isPresent()) {
                usersRepository.deleteById(id);
                reqRes.setStatus(200);
                reqRes.setMessage("Usuario eliminado con éxito");
            } else {
                reqRes.setStatus(404);
                reqRes.setMessage("Usuario no encontrado en la base de datos");
            }
        } catch (Exception e) {
            return errorResponse(500, "Error al eliminar el usuario: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Actualiza un usuario existente
     */
    public ReqRes updateUser(Integer id, OurUsers updateUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userById = usersRepository.findById(id);

            if (userById.isPresent()) {
                OurUsers existingUser = userById.get();

                // Verifica si el correo ya está en uso por otro usuario
                if (!existingUser.getEmail().equals(updateUser.getEmail())) {
                    Optional<OurUsers> emailOwner = usersRepository.findByEmail(updateUser.getEmail());
                    if (emailOwner.isPresent() && !emailOwner.get().getId().equals(existingUser.getId())) {
                        return errorResponse(400, "Este correo ya está en uso por otro usuario.");
                    }
                }

                // Actualiza los campos del usuario
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                existingUser.setCity(updateUser.getCity());
                existingUser.setRole(updateUser.getRole());

                // Si se proporciona nueva contraseña, la encripta
                if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }

                OurUsers savedUser = usersRepository.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatus(200);
                reqRes.setMessage("Usuario actualizado con éxito");

            } else {
                return errorResponse(404, "Usuario no encontrado en la base de datos");
            }

        } catch (Exception e) {
            return errorResponse(500, "Error al actualizar el usuario: " + e.getMessage());
        }
        return reqRes;
    }

    /**
     * Obtiene la información de un usuario por su email
     */
    public ReqRes getMyInfo(String email) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatus(200);
                reqRes.setMessage("Información del usuario obtenida exitosamente");
            } else {
                return errorResponse(404, "Usuario no encontrado");
            }
        } catch (Exception e) {
            return errorResponse(500, "Error al obtener la información del usuario: " + e.getMessage());
        }
        return reqRes;
    }

    // ----------------------
    // Métodos auxiliares
    // ----------------------

    /**
     * Verifica si ya existe un usuario con ese correo
     */
    private boolean emailExists(String email) {
        return usersRepository.findByEmail(email).isPresent();
    }

    /**
     * Mapea un DTO ReqRes al modelo OurUsers
     */
    private OurUsers mapToUser(ReqRes req) {
        OurUsers user = new OurUsers();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setCity(req.getCity());
        return user;
    }

    /**
     * Devuelve una respuesta exitosa con mensaje
     */
    private ReqRes successResponse(String message) {
        ReqRes res = new ReqRes();
        res.setStatus(200);
        res.setMessage(message);
        return res;
    }

    /**
     * Devuelve una respuesta de error con estado y mensaje
     */
    private ReqRes errorResponse(int status, String errorMsg) {
        ReqRes res = new ReqRes();
        res.setStatus(status);
        res.setError(errorMsg);
        return res;
    }
}
