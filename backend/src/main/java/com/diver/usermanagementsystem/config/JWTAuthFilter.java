package com.diver.usermanagementsystem.config;

import com.diver.usermanagementsystem.service.JWTUtils;
import com.diver.usermanagementsystem.service.OurUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autenticación con JWT para interceptar las solicitudes HTTP,
 * extraer el token, validarlo y establecer la autenticación del usuario en el contexto de seguridad.
 */
@Component // Anotación que indica que esta clase es un componente de Spring
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired // Inyección de la utilidad para manejo de JWT
    private JWTUtils jwtUtils;

    @Autowired // Inyección del servicio que obtiene los detalles del usuario desde la base de datos
    private OurUserDetailService ourUserDetailService;

    /**
     * Método principal del filtro, intercepta solicitudes HTTP para procesar autenticación con JWT.
     *
     * @param request      Solicitud HTTP entrante.
     * @param response     Respuesta HTTP.
     * @param filterChain  Cadena de filtros para continuar la ejecución.
     * @throws ServletException En caso de error en el procesamiento.
     * @throws IOException      En caso de error de entrada/salida.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // PASO 1: Extraer el encabezado "Authorization" de la solicitud HTTP
        final String authorizationHeader = request.getHeader("Authorization");

        // Variables para almacenar el token JWT y el correo del usuario
        final String jwttoken;
        final String userEmail;

        // PASO 2: Verificar si el encabezado es nulo o vacío
        if (authorizationHeader == null || authorizationHeader.isBlank()) {
            // Si no hay token, pasa la solicitud al siguiente filtro sin hacer nada
            filterChain.doFilter(request, response);
            return;
        }

        // PASO 3: Extraer el token JWT eliminando el prefijo "Bearer "
        jwttoken = authorizationHeader.substring(7);

        // PASO 4: Extraer el nombre de usuario (correo) del token JWT
        userEmail = jwtUtils.extractUsername(jwttoken);

        // PASO 5: Verificar si el usuario existe y si aún no está autenticado en el contexto de seguridad
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // PASO 6: Cargar los detalles del usuario desde la base de datos
            UserDetails userDetails = ourUserDetailService.loadUserByUsername(userEmail);

            // PASO 7: Verificar si el token es válido y pertenece al usuario cargado
            if (jwtUtils.isTokenValid(jwttoken, userDetails)) {

                // PASO 8: Crear un contexto de seguridad vacío
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                // PASO 9: Crear un objeto de autenticación con la información del usuario
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails,  // Datos del usuario autenticado
                        null,         // No se necesita contraseña porque ya validamos con JWT
                        userDetails.getAuthorities() // Roles/permisos del usuario
                );

                // Ejemplo:
                // Si userDetails tiene:
                // userDetails.getUsername() -> "juan@example.com"
                // userDetails.getAuthorities() -> [ROLE_ADMIN]
                // Entonces el objeto 'token' contendrá:
                // token.getPrincipal() -> "juan@example.com"
                // token.getAuthorities() -> [ROLE_ADMIN]

                // PASO 10: Asignar detalles de la solicitud HTTP a la autenticación
                token.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // PASO 11: Establecer la autenticación en el contexto de seguridad
                securityContext.setAuthentication(token);
                SecurityContextHolder.setContext(securityContext);
            }
        }

        // PASO 12: Continuar con la cadena de filtros después de la autenticación
        filterChain.doFilter(request, response);
    }
}
