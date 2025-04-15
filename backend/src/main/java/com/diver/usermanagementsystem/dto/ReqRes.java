package com.diver.usermanagementsystem.dto;

import com.diver.usermanagementsystem.entity.OurUsers;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

/**
 * Clase DTO (Data Transfer Object) para manejar respuestas y solicitudes
 * relacionadas con los usuarios en el sistema.
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL) // No incluir en la respuesta JSON los campos que sean nulos.
@JsonIgnoreProperties(ignoreUnknown = true) // Ignorar cualquier campo desconocido al deserializar JSON.
public class ReqRes {

    /** Código de estado de la respuesta */
    private int status;

    /** Mensaje de error en caso de fallo */
    private String error;

    /** Mensaje general de la respuesta */
    private String message;

    /** Token de autenticación generado para el usuario */
    private String token;

    /** Token de actualización para renovar el token de acceso */
    private String refreshToken;

    /** Tiempo de expiración del token */
    private String expirationToken;


    /** Nombre del usuario */
    private String name;

    /** Ciudad del usuario */
    private String city;

    /** Rol del usuario en el sistema (ejemplo: ADMIN, USER) */
    private String role;

    /** Correo electrónico del usuario */
    private String email;

    /** Contraseña del usuario (NO debería exponerse en respuestas) */
    private String password;

    /** Objeto de usuario asociado a la respuesta */
    private OurUsers ourUsers;

    /** Lista de usuarios, útil para respuestas con múltiples usuarios */
    private List<OurUsers> ourUsersList;
}
