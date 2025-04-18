// Importamos configureStore de Redux Toolkit para configurar el store de nuestra aplicación
import { configureStore } from "@reduxjs/toolkit";

// Importamos el reducer de autenticación que maneja el estado relacionado al login, usuario, etc.
import authReducer from "../features/auth/authSlice";

// Importamos nuestro middleware personalizado (para manejo de tokens, errores, logs, etc.)
import { customMiddleware } from "../middleware/customMiddleware";

// 🔧 Configuración y creación del store de Redux
export const store = configureStore({
  // Aquí definimos los reducers que manejarán partes específicas del estado global
  reducer: {
    // 'auth' es la clave del estado, y será manejada por el reducer llamado authReducer
    auth: authReducer,
    // Puedes agregar más reducers si tienes otros slices (ej: productos, carrito, etc.)
    // ejemplo: products: productsReducer,
  },

  // ⚙️ Configuración de los middleware
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware() trae middlewares que Redux Toolkit configura por defecto, como thunk
    getDefaultMiddleware()
      // Luego agregamos nuestro middleware personalizado al final de esa lista
      .concat(customMiddleware),

  // Puedes agregar aquí otras configuraciones como:
  // devTools: true/false, preloadedState, enhancers, etc.
  // devTools: process.env.NODE_ENV !== 'production', // Ejemplo: solo activa Redux DevTools en desarrollo
});

// 🧠 Tipado del store para usarlo con TypeScript en toda la app

// 🔹 RootState: representa todo el estado global de Redux
export type RootState = ReturnType<typeof store.getState>;

// 🔹 AppDispatch: representa el tipo del método dispatch del store
export type AppDispatch = typeof store.dispatch;
