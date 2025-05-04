package com.diver.usermanagementsystem.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.function.Function;

/**
 * Clase utilitaria para manejar la generación, validación y extracción de información de tokens JWT.
 */
@Component
public class JWTUtils {

    private SecretKey Key;

    // Token de acceso: 1 minuto
    private static final long ACCESS_EXPIRATION_TIME = 1000 * 60 ; 

    // Refresh token: 7 días
    private static final long REFRESH_EXPIRATION_TIME = 1000 * 60 * 60 * 24 * 7;



    /**
     * Constructor que inicializa la clave secreta usada para firmar los JWTs.
     */
    public JWTUtils() {
        // Clave secreta codificada en Base64
        String secretString = "843567893696976453275974432697R634976R738467TR678T34865R6834R8763T478378637664538745673865783678548735687R3";
        try {
            byte[] keyBytes = Base64.getDecoder().decode(secretString.getBytes(StandardCharsets.UTF_8));
            this.Key = new SecretKeySpec(keyBytes, "HmacSHA256");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Error al decodificar la clave secreta", e);
        }
    }

    /**
     * Genera un token JWT para el usuario proporcionado.
     *
     * @param userDetails Detalles del usuario (usualmente provistos por Spring Security).
     * @return Un token JWT firmado.
     */
    public String generateToken(UserDetails userDetails) {
        try {
            return Jwts.builder()
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date(System.currentTimeMillis())) // Fecha de emisión del token
                    .expiration(new Date(System.currentTimeMillis() + ACCESS_EXPIRATION_TIME))//el currentTimeMillis() + 1000 * 60 * 60)) // Fecha de expiración del token
                    .signWith(Key) // Firma con la clave secreta
                    .compact(); // Compone el token JWT
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el token JWT", e);
        }
    }

    /**
     * Genera un token de refresco JWT con información adicional.
     *
     * @param claims Información adicional que se incluirá en el token (ej., roles).
     * @param userDetails Detalles del usuario.
     * @return Un token JWT de refresco firmado.
     */
    public String generateRefreshToken(HashMap<String, Object> claims, UserDetails userDetails) {
        try {
            return Jwts.builder()
                    .claims(claims) // Incluye los reclamos adicionales
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date(System.currentTimeMillis()))
                    .expiration(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME))
                    .signWith(Key)
                    .compact();
        } catch (Exception e) {
            throw new RuntimeException("Error al generar el token de refresco", e);
        }
    }

    /**
     * Extrae el nombre de usuario de un token JWT.
     *
     * @param token El token JWT.
     * @return El nombre de usuario extraído del token.
     */
    public String extractUsername(String token) {
        try {
            return extractClaims(token, Claims::getSubject); // Extrae el nombre de usuario (subject) del token
        } catch (Exception e) {
            throw new RuntimeException("Error al extraer el nombre de usuario del token", e);
        }
    }

    /**
     * Método genérico para extraer cualquier tipo de reclamo del token JWT.
     *
     * @param token El token JWT.
     * @param claimsTFunction Función que define qué reclamo extraer (ej., nombre de usuario, fecha de expiración, etc.).
     * @param <T> El tipo del valor del reclamo.
     * @return El valor del reclamo extraído.
     */
    private <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        try {
            // Analiza el token y extrae los reclamos
            return claimsTFunction.apply(Jwts.parser()
                    .verifyWith(Key).build()
                    .parseSignedClaims(token)
                    .getPayload());

        } catch (Exception e) {
            throw new RuntimeException("Error al extraer los reclamos del token", e);
        }
    }

    /**
     * Valida si el token JWT es válido.
     *
     * @param token El token JWT.
     * @param userDetails Detalles del usuario (para comparar el nombre de usuario).
     * @return Verdadero si el token es válido, falso en caso contrario.
     */
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try {
            final String username = extractUsername(token); // Extrae el nombre de usuario del token
            // Compara el nombre de usuario y verifica si el token no ha expirado
            return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            throw new RuntimeException("Error al validar el token", e);
        }
    }

    /**
     * Verifica si el token JWT ha expirado.
     *
     * @param token El token JWT.
     * @return Verdadero si el token ha expirado, falso en caso contrario.
     */
    public boolean isTokenExpired(String token) {
        try {
            return extractClaims(token, Claims::getExpiration).before(new Date()); // Verifica si la fecha de expiración es anterior a la fecha actual
        } catch (Exception e) {
            throw new RuntimeException("Error al verificar la expiración del token", e);
        }
    }
}
