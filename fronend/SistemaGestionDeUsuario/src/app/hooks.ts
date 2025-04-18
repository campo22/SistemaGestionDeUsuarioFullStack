import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./store";

// Custom hook para usar el dispatch de Redux con el tipo correcto
// Esto es útil para evitar errores de tipado al usar dispatch en componentes
// y para que TypeScript pueda inferir correctamente los tipos de las acciones.
// En lugar de usar 'dispatch' directamente, usamos 'useAppDispatch' para obtener el dispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Custom hook para usar el selector de Redux con el tipo correcto para el estado global
// por ejemplo 'useAppSelector(state => state.auth.user)'
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
