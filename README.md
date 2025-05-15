# 🌐 Sistema de Gestión de Usuarios - Full Stack App

## 🎯 Descripción
Proyecto Full Stack desarrollado con **Spring Boot y React** para gestionar usuarios, roles y autenticación mediante tokens JWT. Ideal como base para aplicaciones que requieran control de acceso por roles (ADMIN, USER).

---

## 🛠️ Tecnologías Utilizadas

### Backend ⚙️
- Java + Spring Boot
- Spring Security + JWT
- JPA + Hibernate
- MySQL / PostgreSQL
- Maven

### Frontend 💻
- React + Vite
- React Router DOM
- TailwindCSS
- Axios
- Redux

---

## 🔐 Funcionalidades del Backend
- ✔️ Registro y Login de usuarios
- ✔️ Autenticación basada en JWT
- ✔️ Gestión de roles (ROLE_ADMIN, ROLE_USER)
- ✔️ Encriptación de contraseñas con BCrypt
- ✔️ Endpoints protegidos según rol
- ✔️ Configuración de CORS para el consumo desde frontend

## 💡 Funcionalidades del Frontend
- ✔️ Registro e inicio de sesión
- ✔️ Dashboard personalizado por rol
- ✔️ Visualización y edición de perfil
- ✔️ Administración de usuarios (solo para admins)
- ✔️ Diseño moderno y responsivo

---



---

## 🚀 Cómo Iniciar el Proyecto
1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/user-management-system.git
   ```
2. **Configura el Backend:**
   - Ajusta las propiedades de conexión a la base de datos en el archivo `application.yml` o `application.properties`.
   - Ejecuta el backend con:
     ```bash
     mvn spring-boot:run
     ```


---

## 📬 Documentación de la API
```json
{
  "name": "User Management System API",
  "description": "API para gestión de usuarios y roles",
  "version": "1.0.0",
  "endpoints": [
    {
      "method": "POST",
      "url": "/auth/register",
      "description": "Registro de nuevos usuarios",
      "requestBody": {
        "email": "string",
        "password": "string",
        "name": "string",
        "role": "string (ROLE_ADMIN o ROLE_USER)"
      },
      "response": {
        "status": 200,
        "body": {
          "message": "Usuario registrado exitosamente",
          "userId": "integer"
        }
      }
    },
    {
      "method": "POST",
      "url": "/auth/login",
      "description": "Inicio de sesión y obtención del token JWT",
      "requestBody": {
        "email": "string",
        "password": "string"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "string",
          "refreshToken": "string",
          "expiresIn": "integer (segundos)"
        }
      }
    },
    {
      "method": "POST",
      "url": "/auth/refresh",
      "description": "Renovación del token JWT usando refresh token",
      "requestBody": {
        "refreshToken": "string"
      },
      "response": {
        "status": 200,
        "body": {
          "accessToken": "string",
          "expiresIn": "integer (segundos)"
        }
      }
    },
    {
      "method": "GET",
      "url": "/admin/get-all-users",
      "description": "Obtener todos los usuarios (solo ADMIN)",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "response": {
        "status": 200,
        "body": [
          {
            "id": "integer",
            "email": "string",
            "name": "string",
            "roles": ["ROLE_ADMIN", "ROLE_USER"]
          }
        ]
      }
    },
    {
      "method": "GET",
      "url": "/admin/get-users/{userId}",
      "description": "Obtener usuario por ID (solo ADMIN)",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "integer",
          "email": "string",
          "name": "string",
          "roles": ["ROLE_ADMIN", "ROLE_USER"]
        }
      }
    },
    {
      "method": "PUT",
      "url": "/admin/update/{userId}",
      "description": "Actualizar datos de usuario (solo ADMIN)",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "requestBody": {
        "email": "string",
        "name": "string",
        "roles": ["ROLE_ADMIN", "ROLE_USER"]
      },
      "response": {
        "status": 200,
        "body": {
          "message": "Usuario actualizado exitosamente"
        }
      }
    },
    {
      "method": "DELETE",
      "url": "/admin/delete/{userId}",
      "description": "Eliminar usuario por ID (solo ADMIN)",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "response": {
        "status": 200,
        "body": {
          "message": "Usuario eliminado exitosamente"
        }
      }
    },
    {
      "method": "GET",
      "url": "/adminuser/get-profile",
      "description": "Obtener perfil del usuario autenticado",
      "headers": {
        "Authorization": "Bearer {token}"
      },
      "response": {
        "status": 200,
        "body": {
          "id": "integer",
          "email": "string",
          "name": "string",
          "roles": ["ROLE_ADMIN", "ROLE_USER"]
        }
      }
    }
  ]
}

```

---

## 🌄 Imágenes del Proyecto
<img width="1388" alt="Captura de Pantalla 2025-05-14 a la(s) 11 39 41 a m" src="https://github.com/user-attachments/assets/96a036f7-fc61-4572-8502-4139cc8c4d40" />
<img width="1392" alt="Captura de Pantalla 2025-05-14 a la(s) 11 03 16 a m" src="https://github.com/user-attachments/assets/12c16305-93ba-4939-bb45-27a3d2cb6cbf" />
<img width="1388" alt="Captura de Pantalla 2025-05-14 a la(s) 11 03 03 a m" src="https://github.com/user-attachments/assets/19658c30-0c24-48aa-9794-7a3428d5bd52" />
<img width="1376" alt="Captura de Pantalla 2025-05-14 a la(s) 11 02 43 a m" src="https://github.com/user-attachments/assets/7464d78d-754a-44df-b960-40bba6838a29" />
<img width="1433" alt="Captura de Pantalla 2025-05-14 a la(s) 11 02 13 a m" src="https://github.com/user-attachments/assets/f4688673-1dc2-4f28-b3ba-efa11960e7ea" />







---

## 👋 Contribuciones
Toda contribución es bienvenida. Puedes enviar un pull request o abrir un issue para sugerencias y mejoras.

## 📅 Estado del Proyecto
En desarrollo ✨

## 📖 Licencia
Este proyecto está bajo la licencia MIT.
