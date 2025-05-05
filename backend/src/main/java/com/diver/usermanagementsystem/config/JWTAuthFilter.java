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
 * Acepta el token tanto en el header Authorization como en el query param 'token'.
 */
@Component
public class JWTAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private OurUserDetailService ourUserDetailService;

    /**
     * Método principal del filtro, intercepta solicitudes HTTP para procesar autenticación con JWT.
     * Acepta el token tanto en el header Authorization como en el query param 'token'.
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

        String jwtToken = null;
        final String userEmail;

        // PASO 1: Intentar extraer el token del header Authorization
        final String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && !authorizationHeader.isBlank() && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
        }

        // PASO 2: Si no hay token en el header, intentar extraerlo del query param
        if (jwtToken == null) {
            jwtToken = request.getParameter("token");
        }

        // PASO 3: Si no hay token en ninguna parte, continuar con la cadena de filtros
        if (jwtToken == null) {
            filterChain.doFilter(request, response);
            return;
        }

        // PASO 4: Extraer el nombre de usuario (correo) del token JWT
        userEmail = jwtUtils.extractUsername(jwtToken);

        // PASO 5: Verificar si el usuario existe y si aún no está autenticado en el contexto de seguridad
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // PASO 6: Cargar los detalles del usuario desde la base de datos
            UserDetails userDetails = ourUserDetailService.loadUserByUsername(userEmail);

            // PASO 7: Verificar si el token es válido y pertenece al usuario cargado
            if (jwtUtils.isTokenValid(jwtToken, userDetails)) {

                // PASO 8: Crear un contexto de seguridad vacío
                SecurityContext securityContext = SecurityContextHolder.createEmptyContext();

                // PASO 9: Crear un objeto de autenticación con la información del usuario
                UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                        userDetails,  // Datos del usuario autenticado
                        null,         // No se necesita contraseña porque ya validamos con JWT
                        userDetails.getAuthorities() // Roles/permisos del usuario
                );

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