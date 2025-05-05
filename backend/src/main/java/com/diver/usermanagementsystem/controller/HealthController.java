package com.diver.usermanagementsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Controlador para verificar la salud del servidor
 * Este endpoint no requiere autenticación
 */
@RestController
public class HealthController {

    /**
     * Endpoint para verificar si el servidor está funcionando
     * @return Estado del servidor
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Server is running");
        return ResponseEntity.ok(response);
    }
}