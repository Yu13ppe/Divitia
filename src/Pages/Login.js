import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useDataContext } from "../Context/dataContext";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import Logo from "../Assets/Images/Logo.png";

function Login() {
  const history = useHistory();
  const { setLogged, setInfoTkn, url } = useDataContext(); // Incluido el DataContext
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attemps, setAttemps] = useState(3);
  const [alertVisible, setAlertVisible] = useState(false);
  const [touched, setTouched] = useState({
    user: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);

  const fetchData = async (email, password) => {
    try {
      const response = await axios.get(
        `${url}/Auth/login/${email}/${password}`
      );
      setInfoTkn(response.data.data.access_token);
      setLogged(true);
      history.push("/Changes");
    } catch (error) {
      toast.error("Ocurrió un error. Verifica tus datos e intenta nuevamente.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        const errorMessage = `Correo o contraseña incorrectos. Intentos restantes: ${
          attemps - 1
        }`;
        setError(errorMessage);
        setAlertVisible(true);
      }
    } finally {
      setLoading(false);
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
    <div className="login-container">
      <div className="login-card">
        <img src={Logo} alt="Logo" className="logo" />

        {alertVisible && (
          <div className="alert-modern">
            <span className="alert-text">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="user">Correo Electrónico</label>
            <div className="input-wrapper">
              <FaUser className="input-icon" />
              <input
                type="text"
                id="user"
                name="user"
                value={user}
                placeholder="Correo"
                onChange={(e) => handleChange("user", e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, user: true }))}
                className={touched.user && !user ? "input-error" : ""}
              />
            </div>
            {touched.user && !user && (
              <span className="error-text">Este campo es obligatorio</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                placeholder="Contraseña"
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                className={
                  touched.password && password.length < 8 ? "input-error" : ""
                }
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {touched.password && password.length < 8 && (
              <span className="error-text">
                La contraseña debe tener al menos 8 caracteres
              </span>
            )}
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Cargando..." : "Iniciar Sesión"}
          </button>

          <Link to="/Register" className="register-button">
            Regístrate
          </Link>
        </form>
        <div className="extra-links">
          <Link to="/Recover">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export { Login };