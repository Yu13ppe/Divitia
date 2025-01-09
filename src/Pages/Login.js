import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { useDataContext } from "../Context/dataContext";
import { toast, ToastContainer } from "react-toastify";

function Login() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [tkn, setTkn] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [touched, setTouched] = useState({
    user: false,
    password: false,
  });
  const [loading, setLoading] = useState(false); // Estado para la carga

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(
        `${url}/Auth/login/${email}/${password}`
      );
      setInfoTkn(response.data.data.access_token);
      const response2 = await axios.get(
        `${url}/Auth/findByToken/${response.data.data.access_token}`
      );
      setTkn(response2.data);
      setLogged(true);
      history.push({
        pathname: "/Changes",
        state: {
          user: tkn,
        },
      });
      return true;
    } catch (error) {
      toast.error(
        "Ocurrió un error durante el inicio de sesión. Por favor, verifica los datos e intenta nuevamente."
      );
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia el estado de carga

    try {
      const success = await fetchData(user, password);
      if (!success) {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (attemps <= 1) {
        setError("Has superado el número de intentos. Intenta más tarde.");
        setAlertVisible(true);
        setAttemps(0);
      } else {
        setAttemps(attemps - 1);
        const errorMessage = `Correo o contraseña incorrectos. Inténtalo de nuevo. Intentos restantes: ${
          attemps - 1
        }`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    } finally {
      setLoading(false); // Finaliza el estado de carga
    }
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "user":
        setUser(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  
  return (
    <div>Login</div>
  )
}

export {Login}