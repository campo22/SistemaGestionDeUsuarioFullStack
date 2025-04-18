import { Middleware, isRejectedWithValue } from "@reduxjs/toolkit"; // Importa Middleware y la función isRejectedWithValue desde @reduxjs/toolkit
import { logout } from "../features/auth/authSlice"; // Importa la acción logout desde el slice de autenticación

// Define una función 'type guard' para verificar si una acción es un objeto con una propiedad 'type'
// Esto ayuda a TypeScript a inferir el tipo de la acción más adelante.
function isActionWithType(
  action: unknown // La acción puede ser de cualquier tipo al principio
): action is { type: string; payload?: any; error?: any } {
  // Retorna true si la acción coincide con la estructura de un objeto con 'type'
  // Verifica si la acción es un objeto, no es null y tiene la propiedad 'type'
  return typeof action === "object" && action !== null && "type" in action;
}

// Define el middleware personalizado. Un middleware de Redux tiene la firma (store) => (next) => (action)
export const customMiddleware: Middleware = (store) => (next) => (action) => {
  console.log("Middleware ejecutado", action); // Línea opcional para ver todas las acciones que pasan

  // Verifica si la acción es válida usando el type guard definido antes
  if (!isActionWithType(action)) {
    // Si no es una acción válida (por ejemplo, puede ser una función o un promesa si usas otros middlewares como thunk),
    // simplemente la pasa al siguiente middleware o al reducer.
    return next(action);
  }

  // 💬 Log de la acción recibida (opcional, útil para depuración)
  console.log("[Middleware] Acción recibida:", action.type);

  // ✅ Guardar token si la acción de login fue exitosa (fulfilled)
  // Comprueba si el tipo de acción coincide con el caso fulfilled de la acción 'login' (asumiendo que es una thunk)
  if (action.type === "auth/login/fulfilled") {
    // Accede al payload de la acción para obtener el token (asumiendo que el token está en action.payload.token)
    const token = action.payload?.token;
    // Si se encontró un token en el payload
    if (token) {
      // Guarda el token en el almacenamiento local del navegador
      localStorage.setItem("token", token);
      console.log("✅ Token guardado en localStorage"); // Log de confirmación
    }
  }

  // 🧹 Limpiar token si la acción es la de 'logout'
  // Usa logout.match(action) que es una utilidad de Redux Toolkit para verificar si la acción coincide con la acción 'logout'
  if (logout.match(action)) {
    // Elimina el token del almacenamiento local
    localStorage.removeItem("token");
    console.log("🚪 Usuario cerró sesión. Token eliminado"); // Log de confirmación
  }

  // 🚨 Mostrar error global si alguna acción fue rechazada (rejected)
  // isRejectedWithValue es una utilidad de Redux Toolkit que verifica si la acción fue rechazada Y tiene un payload de error
  if (isRejectedWithValue(action)) {
    console.warn("⚠️ Acción fallida:", action.type); // Advierte que una acción falló
    // Muestra el payload del error o el mensaje de error, si existen
    console.warn("Mensaje:", action.payload || action.error?.message);
  }

  // Pasa la acción al siguiente middleware en la cadena o al reducer si es el último middleware
  return next(action);
};
