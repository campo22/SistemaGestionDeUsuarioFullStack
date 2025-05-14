# 🌐 Sistema de Gestión de Usuarios - Full Stack App

🎯 **Proyecto Full Stack** desarrollado con **Spring Boot** y **React** para gestionar usuarios, roles y autenticación mediante tokens **JWT**. Ideal como base para aplicaciones que requieran control de acceso por roles (`ADMIN`, `USER`).

---

## 🛠️ Tecnologías Utilizadas

| Backend ⚙️ | Frontend 💻 |
|------------|--------------|
| Java + Spring Boot | React + Vite  |
| Spring Security + JWT | React Router DOM |
| JPA + Hibernate | TailwindCSS  |
| MySQL / PostgreSQL | Axios |
| Maven |   Redux  |

---

## 🔐 Funcionalidades Backend

- ✔️ Registro y Login de usuarios
- ✔️ Autenticación basada en **JWT**
- ✔️ Gestión de roles (`ROLE_ADMIN`, `ROLE_USER`)
- ✔️ Encriptación de contraseñas con **BCrypt**
- ✔️ Endpoints protegidos según rol
- ✔️ Configuración de **CORS** para el consumo desde frontend

---

## 💡 Funcionalidades previstas en el Frontend

- [ ] Registro e inicio de sesión
- [ ] Dashboard personalizado por rol
- [ ] Visualización y edición de perfil
- [ ] Administración de usuarios (solo para admins)
- [ ] Diseño moderno y responsivo

---

## 📂 Estructura del Proyecto

```
📆 user-management-system
├── backend/
│   ├── src/main/java/com/diver/usermanagementsystem
│   └── ...
├── frontend/
│   └── src/
│       └── components, pages, services, etc.
```

---

## 🚀 Cómo iniciar el proyecto

1. Clona el repositorio:  
   ```bash
   git clone https://github.com/tuusuario/user-management-system.git
   ```

2. 📦 Entra al backend y configúralo con tu base de datos local

3. 💻 Inicia el frontend con:  
   ```bash
   npm install && npm run dev
   ```

4. 📬 Prueba los endpoints con Postman o desde el frontend una vez terminado

---

## 👋 Contribuciones

Toda contribución es bienvenida. Puedes enviar un pull request o abrir un issue para sugerencias y mejoras.

---

## 📅 Estado del Proyecto

> En desarrollo ✨

---

## 📖 Licencia

Este proyecto está bajo la licencia MIT.

