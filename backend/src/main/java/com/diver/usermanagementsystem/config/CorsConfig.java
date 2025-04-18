package com.diver.usermanagementsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    // Aquí puedes configurar CORS si es necesario
    // Por ejemplo, puedes permitir solicitudes de ciertos orígenes, métodos, etc.
    // Si no necesitas configuraciones específicas, puedes dejarlo vacío o eliminar esta clase.

    // Este metodo permite todas las solicitudes CORS desde cualquier origen
    @Bean
    public WebMvcConfigurer webMvcConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/**")
                        .allowedOrigins("http://localhost:5173") // Limitar los orígenes
                        .allowedMethods("GET", "POST", "PUT", "DELETE") // Métodos más específicos
                        .allowedHeaders("Authorization", "Content-Type") // Solo los encabezados que necesitas
                        .allowCredentials(true); // Permite el envío de cookies (si necesario)
            }
        };
    }

}
