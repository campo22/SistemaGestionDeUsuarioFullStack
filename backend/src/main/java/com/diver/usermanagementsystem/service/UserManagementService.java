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

    // Inyectamos el repositorio de usuarios
    @Autowired
    private UsersRepository usersRepository;

    // Inyectamos el codificador de contraseñas
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JWTUtils jwtUtils;

    // Metodo principal para registrar usuarios
    public ReqRes registerUser(ReqRes registrationRequest) {
        try {
            if (emailExists(registrationRequest.getEmail())) {
                return errorResponse(400, "El correo electrónico ya está registrado.");
            }

            OurUsers userToSave = mapToUser(registrationRequest);
            userToSave.setRole(registrationRequest.getRole()); // Asignar rol si no lo incluye el mapper

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

    public ReqRes login(ReqRes rep) {
        try {
            // Autenticar con email y contraseña
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(rep.getEmail(), rep.getPassword())
            );

            // Obtener el usuario de la base de datos
            OurUsers user = usersRepository.findByEmail(rep.getEmail()).orElse(null);

            // Verificar si existe (aunque ya lo autenticaste, es por seguridad)
            if (user != null) {
                // Generar el token
                String token = jwtUtils.generateToken(user);
                String refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);

                // Armar respuesta exitosa
                rep.setStatus(200);
                rep.setMessage("Usuario autenticado con éxito");
                rep.setToken(token);
                rep.setRefreshToken(refreshToken);
                rep.setExpirationToken("24h");
                rep.setMessage("Usuario autenticado con éxito");

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
    public ReqRes refreshToken( ReqRes refresh) {
        ReqRes res = new ReqRes();
        try {
            String ourEmail= jwtUtils.extractUsername(refresh.getToken());
            OurUsers users= usersRepository.findByEmail(ourEmail).orElseThrow();
            if(jwtUtils.isTokenValid(refresh.getToken(), users)) {
            var jwt= jwtUtils.generateToken(users);
            res.setStatus(200);
            res.setToken(jwt);
            res.setRefreshToken(refresh.getToken());
            res.setExpirationToken("24h");
            res.setMessage("Token refrescado con éxito");

            }
            res.setStatus(200);
            return res;

        }catch (Exception e) {
            res.setStatus(500);
            res.setError("Error al refrescar el token: " + e.getMessage());
            return res;
        }
    }
    // Metodo para obtener todos los usuarios
    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepository.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatus(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatus(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatus(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }
    // Metodo para obtener un usuario por ID
    public ReqRes getUserById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers userById = usersRepository.findById(id).orElseThrow();
            reqRes.setOurUsers(userById);
            reqRes.setStatus(200);
            reqRes.setMessage("este es el id:"+ id +"  found successfully");

        }catch (Exception e) {
            reqRes.setStatus(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());

        }
        return reqRes;
    }

    public ReqRes deleteteUserById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers>userById= usersRepository.findById(id);
            if(userById.isPresent()){
                usersRepository.deleteById(id);
                reqRes.setStatus(200);
                reqRes.setMessage("Usuario eliminado con éxito");
            }else{
                reqRes.setStatus(404);
                reqRes.setMessage("Usuario no encontrado en la base de datos");
            }

        }catch (Exception e) {
            reqRes.setStatus(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }
    public ReqRes updateUser(Integer id, OurUsers updateUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userById = usersRepository.findById(id);

            if (userById.isPresent()) {
                // Obtener el usuario existente
                OurUsers existingUser = userById.get();

                // Verificar si el nuevo email ya está en uso por otro usuario
                if (!existingUser.getEmail().equals(updateUser.getEmail())) {
                    Optional<OurUsers> emailOwner = usersRepository.findByEmail(updateUser.getEmail());
                    if (emailOwner.isPresent() && !emailOwner.get().getId().equals(existingUser.getId())) {
                        reqRes.setStatus(400);
                        reqRes.setMessage("Este correo ya está en uso por otro usuario.");
                        return reqRes;
                    }
                }

                // Actualizar datos
                existingUser.setEmail(updateUser.getEmail());
                existingUser.setName(updateUser.getName());
                existingUser.setCity(updateUser.getCity());
                existingUser.setRole(updateUser.getRole());

                if (updateUser.getPassword() != null && !updateUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updateUser.getPassword()));
                }

                OurUsers savedUser = usersRepository.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatus(200);
                reqRes.setMessage("Usuario actualizado con éxito");

            } else {
                reqRes.setStatus(404);
                reqRes.setMessage("Usuario no encontrado en la base de datos");
            }

        } catch (Exception e) {
            reqRes.setStatus(500);
            reqRes.setMessage("Error al actualizar el usuario: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepository.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatus(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatus(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatus(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }

    // Verifica si ya existe un usuario con el mismo correo
    private boolean emailExists(String email) {
        return usersRepository.findByEmail(email).isPresent();
    }

    // Mapea los datos del DTO (ReqRes) a la entidad OurUsers para registrar un nuevo usuario
    private OurUsers mapToUser(ReqRes req) {
        OurUsers user = new OurUsers();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword())); // Encripta la contraseña
        user.setCity(req.getCity());
        return user;
    }

    // Crea una respuesta de éxito con mensaje personalizado
    private ReqRes successResponse(String message) {
        ReqRes res = new ReqRes();
        res.setStatus(200);
        res.setMessage(message);
        return res;
    }

    // Crea una respuesta de error con código de estado y mensaje de error
    private ReqRes errorResponse(int status, String errorMsg) {
        ReqRes res = new ReqRes();
        res.setStatus(status);
        res.setError(errorMsg);
        return res;
    }
}
