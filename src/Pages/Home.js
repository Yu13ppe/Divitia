import React, { useState, useEffect, useCallback } from "react";
import { clearLocalStorage } from "../Hooks/useLocalStorage";
import { Link } from "react-router-dom";
import { FaGlobe, FaBolt, FaShieldAlt, FaMoneyBillWave, FaCheckCircle } from "react-icons/fa";
import { FiArrowRight } from "react-icons/fi";
import Logo from "../Assets/Images/Logo.png";
import peru from "../Assets/Images/peru.png";
import venezuela from "../Assets/Images/venezuela.png";
import colombia from "../Assets/Images/colombia.png";
//import ecuador from "../Assets/Images/ecuador.png";
import panama from "../Assets/Images/panama.png";
import chile from "../Assets/Images/chile.png";

function Home() {
  clearLocalStorage();

  const [amount, setAmount] = useState('');
  const [country, setCountry] = useState('');
  const [rate, setRate] = useState(7.5); // Tasa ejemplo
  const [fee, setFee] = useState(5); // Tarifa ejemplo
  const [total, setTotal] = useState(0);

  const handleCalculate = (e) => {
    e.preventDefault();
    const receivedAmount = amount * rate - fee;
    setTotal(receivedAmount > 0 ? receivedAmount : 0);
  };

  return (
    <div className="home-container">
      {/* Sección 1: Encabezado */}
      <header className="header">
      <div className="logo-slogan">
  <div className="logo">
    <img src={Logo} alt="Divitia Cambios" />
  </div>
  <h1>
    <span className="highlight">Rápido</span>, <span className="highlight">Seguro</span>, y{" "}
    <span className="highlight">Confiable</span>.
  </h1>
  <p>Envía dinero desde Europa a América Latina al instante.</p>
  <button className="register-button">Regístrate</button>
</div>


      <div className="calculator-container">
  <div className="exchange-rate-header">
    <h3>Tipo de cambio</h3>
    <p>
      1 EUR = <span>{rate.toFixed(2)} VEF</span>
    </p>
  </div>
  <form onSubmit={handleCalculate} className="calculator-form">
    {/* Input "Envías" */}
    <div className="form-group">
      <div className="input-wrapper">
        <input
          type="number"
          id="sendAmount"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select>
          <option value="eur">
            <img src="../Assets/Images/venezuela.png" alt="Euro" /> EUR
          </option>
          <option value="usd">
            <img src="../Assets/Images/estadosunidos.png" alt="USD" /> USD
          </option>
        </select>
      </div>
    </div>

    {/* Input "Recibe" */}
    <div className="form-group">
      <div className="input-wrapper">
        <input
          type="text"
          id="receiveAmount"
          placeholder="0.00"
          value={total.toFixed(2)}
          readOnly
        />
        <select>
          <option value="vef">
            <img src={venezuela} alt="Venezuela" className="flag" />
          </option>
          <option value="colombia">
            <img src="../Assets/Images/colombia.png" alt="Colombia" /> COP
          </option>
          <option value="ecuador">
            <img src="../Assets/Images/ecuador.png" alt="Ecuador" /> USD
          </option>
          <option value="panama">
            <img src="../Assets/Images/panama.png" alt="Panamá" /> PAB
          </option>
          <option value="peru">
            <img src={peru} /> PEN
          </option>
          <option value="chile">
            <img src="../Assets/Images/chile.png" alt="Chile" /> CLP
          </option>
        </select>
      </div>
    </div>

    {/* Resumen */}
    <div className="summary">
      <div className="summary-item">
        <span>Cargo</span>
        <span>+ {fee.toFixed(2)} EUR</span>
      </div>
      <div className="summary-item">
        <span>Cantidad a pagar</span>
        <span>{total.toFixed(2)} EUR</span>
      </div>
    </div>

    {/* Botón principal */}
    <button type="submit" className="submit-button">
      Enviar ahora
    </button>
  </form>
</div>

    </header>

      {/* Sección 3: Países a los que enviamos */}
      <section className="countries">
        <h2>Enviamos a toda América Latina</h2>
        <p>Conéctate con tus seres queridos en cualquier parte de América Latina.</p>
        <div className="map">
          {/* Agregar mapa o imagen aquí */}
        </div>
      </section>

      {/* Sección 4: Nuestro Producto */}
      <section className="product">
        <h2>¿Por qué elegir Divitia Cambios?</h2>
        <div className="features">
          <div className="feature">
            <FaBolt className="icon" />
            <h3>Rápido</h3>
            <p>Transferencias en minutos.</p>
          </div>
          <div className="feature">
            <FaShieldAlt className="icon" />
            <h3>Seguro</h3>
            <p>Protección de datos y transacciones.</p>
          </div>
          <div className="feature">
            <FaGlobe className="icon" />
            <h3>Fácil</h3>
            <p>Plataforma intuitiva y sin complicaciones.</p>
          </div>
          <div className="feature">
            <FaMoneyBillWave className="icon" />
            <h3>Económico</h3>
            <p>Tarifas competitivas.</p>
          </div>
        </div>
      </section>

      {/* Sección 5: Beneficios */}
      <section className="benefits">
        <h2>Miles de personas confían en nosotros porque:</h2>
        <ul>
          <li><FaCheckCircle className="icon" /> Transparencia total en las tarifas.</li>
          <li><FaCheckCircle className="icon" /> Servicio al cliente 24/7.</li>
          <li><FaCheckCircle className="icon" /> Actualizaciones en tiempo real sobre el estado de tus transferencias.</li>
        </ul>
      </section>

      {/* Sección 6: Cómo enviar dinero */}
      <section className="how-to-send">
        <h2>Enviar dinero nunca ha sido tan fácil</h2>
        <ol>
          <li>Crea una cuenta gratuita: Solo necesitas un correo electrónico.</li>
          <li>Calcula el envío: Ingresa el monto y elige el método de entrega.</li>
          <li>Proporciona los datos del destinatario: Nombre, cuenta bancaria o dirección de retiro.</li>
          <li>Selecciona el método de pago: Tarjeta de débito/crédito, transferencia bancaria, etc.</li>
          <li>Envía y sigue tu transferencia: Recibe notificaciones por correo y SMS.</li>
        </ol>
      </section>

      {/* Sección 7: Testimonios */}
      <section className="testimonials">
        <h2>Lo que dicen nuestros clientes</h2>
        <div className="testimonial">
          <p>"Excelente servicio, mi familia recibe el dinero en minutos."</p>
          <span>– Juan, México</span>
        </div>
        <div className="testimonial">
          <p>"Las mejores tasas de cambio que he encontrado."</p>
          <span>– María, Colombia</span>
        </div>
        <div className="testimonial">
          <p>"Súper confiable y fácil de usar."</p>
          <span>– Pedro, Argentina</span>
        </div>
      </section>

    </div>
  );
}

export { Home };
