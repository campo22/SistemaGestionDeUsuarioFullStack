package com.diver.usermanagementsystem.controller;

import com.diver.usermanagementsystem.dto.ReqRes;
import com.diver.usermanagementsystem.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Autowired
    private UserManagementService userManagementService;

   @PostMapping("/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg) {
        return ResponseEntity.ok(userManagementService.registerUser(reg));
    }

    @PostMapping("/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes login) {
       return ResponseEntity.ok(userManagementService.login(login));
   }

    @PostMapping("/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes refreshToken) {
        return ResponseEntity.ok(userManagementService.refreshToken(refreshToken));
    }

}
