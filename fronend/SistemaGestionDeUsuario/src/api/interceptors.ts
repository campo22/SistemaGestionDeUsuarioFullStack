// Este archivo ahora simplemente re-exporta desde api.ts para mantener compatibilidad
import api, { testDirectRequest } from "./api";

export { testDirectRequest };
export default api;
