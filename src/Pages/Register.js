import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, Redirect, useHistory } from "react-router-dom";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Register() {
  const history = useHistory();
  const { logged, url } = useDataContext();

  const [use_name, setUse_name] = useState("");
  const [use_lastName, setUse_lastName] = useState("");
  const [use_email, setUse_email] = useState("");
  const [use_password, setUse_password] = useState("");
  const [use_confirm, setUse_confirm] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Estado para manejar la carga

  const [errors, setErrors] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const [touched, setTouched] = useState({
    name: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
    priv: false,
  });

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!use_name) newErrors.name = "Este campo es obligatorio";
    if (!use_lastName) newErrors.lastName = "Este campo es obligatorio";
    if (!use_email) newErrors.email = "Este campo es obligatorio";
    if (use_password.length > 0 && use_password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    }
    if (use_confirm && use_confirm !== use_password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }
    if (!termsAccepted) newErrors.terms = "Debes aceptar los términos y condiciones";

    setErrors(newErrors);
  }, [use_name, use_lastName, use_email, use_password, use_confirm, termsAccepted]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (field, value) => {
    switch (field) {
      case 'name':
        setUse_name(value);
        break;
      case 'lastName':
        setUse_lastName(value);
        break;
      case 'email':
        setUse_email(value);
        break;
      case 'password':
        setUse_password(value);
        break;
      case 'confirmPassword':
        setUse_confirm(value);
        break;
      default:
        break;
    }

    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);  // Activar el estado de carga

    try {
      await axios.post(`${url}/Auth/register`, {
        use_name,
        use_lastName,
        use_dni: "",
        use_email,
        use_password,
        use_verif: "N",
        use_img: "",
      });

      await axios.post(`${url}/Mailer/EmailWelcome/${use_email}`);

      toast.success("¡Registro exitoso! Te hemos enviado un correo de bienvenida.");
      setTimeout(() => history.push("/Login"), 2000);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error durante el registro. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);  // Desactivar el estado de carga
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div>Register</div>
  )
}

export {Register}