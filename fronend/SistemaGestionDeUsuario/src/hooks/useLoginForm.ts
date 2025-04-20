import { useState } from "react";

export const useLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validate = () => {
    const errors: typeof formErrors = {};
    if (!email) {
      errors.email = "El email es requerido.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Formato de email inválido.";
    }
    if (!password) {
      errors.password = "La contraseña es requerida.";
    }
    setFormErrors(errors);
    // el método Object.keys devuelve un array con las propiedades del objeto
    // y la longitud de ese array nos indica si hay errores
    // si la longitud es 0, significa que no hay errores
    // y por lo tanto el formulario es válido
    // si hay errores, la longitud será mayor a 0
    // y por lo tanto el formulario no es válido
    return Object.keys(errors).length === 0;
  };
  return {
    email,
    setEmail,
    password,
    setPassword,
    formErrors,
    setFormErrors,
    validate,
    reset: () => {
      setEmail("");
      setPassword("");
      setFormErrors({});
    },
  };
};
