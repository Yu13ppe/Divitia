import React, { useState, useEffect, useCallback } from "react";
import { FaEye } from "react-icons/fa";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
} from "reactstrap";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";

import { FaListAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

function Movements() {
  useAxiosInterceptors();
  const { infoTkn, url } = useDataContext();
  const [activeTab, setActiveTab] = useState("all");
  const [userMovements, setUserMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });

      const responseMovements = await axios.get(
        `${url}/Movements/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserMovements(responseMovements.data);
      console.log(responseMovements.data);
    } catch (error) {
      console.log(error);
    }
  }, [infoTkn, url]);

  // Transacciones estáticas de prueba
  // const userMovements = [
  //   {
  //     mov_id: 1,
  //     mov_type: "Transferencia",
  //     mov_status: "approved",
  //     mov_amount: "+ €50.00",
  //   },
  //   {
  //     mov_id: 2,
  //     mov_type: "Pago de servicio",
  //     mov_status: "approved",
  //     mov_amount: "+ €30.00",
  //   },
  //   {
  //     mov_id: 3,
  //     mov_type: "Compra en tienda",
  //     mov_status: "approved",
  //     mov_amount: "- €25.00",
  //   },
  //   {
  //     mov_id: 4,
  //     mov_type: "Depósito",
  //     mov_status: "approved",
  //     mov_amount: "+ €200.00",
  //   },
  //   {
  //     mov_id: 5,
  //     mov_type: "Retiro de efectivo",
  //     mov_status: "approved",
  //     mov_amount: "- €100.00",
  //   },
  //   {
  //     mov_id: 6,
  //     mov_type: "Transferencia",
  //     mov_status: "pending",
  //     mov_amount: "+ €20.00",
  //   },
  //   {
  //     mov_id: 7,
  //     mov_type: "Pago de factura",
  //     mov_status: "pending",
  //     mov_amount: "- €60.00",
  //   },
  //   {
  //     mov_id: 8,
  //     mov_type: "Compra online",
  //     mov_status: "pending",
  //     mov_amount: "- €15.00",
  //   },
  //   {
  //     mov_id: 9,
  //     mov_type: "Ingreso",
  //     mov_status: "pending",
  //     mov_amount: "+ €100.00",
  //   },
  //   {
  //     mov_id: 10,
  //     mov_type: "Transferencia interna",
  //     mov_status: "pending",
  //     mov_amount: "- €50.00",
  //   },
  //   {
  //     mov_id: 11,
  //     mov_type: "Transferencia fallida",
  //     mov_status: "rejected",
  //     mov_amount: "- €25.00",
  //   },
  //   {
  //     mov_id: 12,
  //     mov_type: "Pago rechazado",
  //     mov_status: "rejected",
  //     mov_amount: "- €40.00",
  //   },
  //   {
  //     mov_id: 13,
  //     mov_type: "Recarga no procesada",
  //     mov_status: "rejected",
  //     mov_amount: "+ €15.00",
  //   },
  //   {
  //     mov_id: 14,
  //     mov_type: "Compra rechazada",
  //     mov_status: "rejected",
  //     mov_amount: "- €20.00",
  //   },
  //   {
  //     mov_id: 15,
  //     mov_type: "Pago de factura fallido",
  //     mov_status: "rejected",
  //     mov_amount: "- €30.00",
  //   },
  // ];

  const handleTabChange = (tab) => setActiveTab(tab);

  const filteredTransactions = userMovements.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.mov_status === activeTab;
  });

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  const showDetails = (transaction) => setSelectedMovement(transaction);
  const closeDetails = () => setSelectedMovement(null);

  const getCurrencySymbol = (currency) => {
    switch (currency) {
      case "Eur":
        return "€";
      case "Usd":
        return "$";
      default:
        return currency;
    }
  };

  return (
    <div className="main-container">
      <div className="movements-container">
        <header className="movements-header">
          {/* Botón para regresar */}
          <div className="back-button">
            <Link to="/changes" className="back-button">
              <FaArrowLeft className="back-icon" />
            </Link>
          </div>
          <h2>
            <FaListAlt /> Movimientos
          </h2>
        </header>

        {/* Botones de filtro */}
        <div className="filter-buttons">
          <button
            className={`filter-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => handleTabChange("all")}
          >
            Todas
          </button>
          <button
            className={`filter-btn ${activeTab === "V" ? "active" : ""}`}
            onClick={() => handleTabChange("V")}
          >
            Aprobadas
          </button>
          <button
            className={`filter-btn ${activeTab === "R" ? "active" : ""}`}
            onClick={() => handleTabChange("R")}
          >
            Rechazadas
          </button>
          <button
            className={`filter-btn ${activeTab === "E" ? "active" : ""}`}
            onClick={() => handleTabChange("E")}
          >
            En Espera
          </button>
        </div>

        {/* Lista de movimientos */}
        <section className="transactions">
          <h3>
            {activeTab === "all"
              ? "Todas las Transferencias"
              : activeTab === "V"
              ? "Aprobada"
              : activeTab === "E"
              ? "En espera"
              : activeTab === "R"
              ? "Rechazada"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
          <br />
          <ul>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <li
                  key={transaction.mov_id}
                  className={`transaction ${transaction.mov_status}`}
                  onClick={() => showDetails(transaction)}
                >
                  <div className="details">
                    <span className="type">{transaction.mov_type}</span>
                    <span
                      className={`status ${
                        transaction.mov_status === "V"
                          ? "approved"
                          : transaction.mov_status === "E"
                          ? "pending"
                          : "rejected"
                      }`}
                    >
                      {transaction.mov_status === "V"
                        ? "Aprobada"
                        : transaction.mov_status === "E"
                        ? "En Espera"
                        : "Rechazada"}
                    </span>
                  </div>
                  <div className="amount">
                    {transaction.mov_type === "Deposito"
                      ? `+ ${getCurrencySymbol(transaction.mov_currency)} ${
                          transaction.mov_amount
                        }`
                      : `- ${getCurrencySymbol(transaction.mov_currency)} ${
                          transaction.mov_amount
                        }`}
                  </div>
                </li>
              ))
            ) : (
              <p>No hay transacciones en esta categoría.</p>
            )}
          </ul>
        </section>

        {/* RECUERDA PONERLE DENTRO EL BENEFICIARIO Y LA IMAGEN */}

        {/* Modal de detalles */}
        {selectedMovement && (
          <div className="modal-overlay" onClick={closeDetails}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Detalles de la Transacción</h2>
              <p>
                <strong>Tipo:</strong> {selectedMovement.mov_type}
              </p>
              <p>
                <strong>Fecha:</strong> {selectedMovement.mov_date}
              </p>
              <p>
                <strong>Monto:</strong> {selectedMovement.mov_amount}
              </p>
              <p>
                <strong>Estado:</strong>
                {selectedMovement.mov_status === "V"
                  ? "Aprobada"
                  : selectedMovement.mov_status === "E"
                  ? "En Espera"
                  : "Rechazada"}
              </p>
              {selectedMovement.AccountsBsUser &&
              selectedMovement.mov_typeOutflow === "transferencia" ? (
                <>
                  <p>
                    <strong>Banco:</strong>{" "}
                    {selectedMovement.AccountsBsUser.accbsUser_bank}
                  </p>
                  <p>
                    <strong>Propietario:</strong>{" "}
                    {selectedMovement.AccountsBsUser.accbsUser_owner}
                  </p>
                  <p>
                    <strong>Número de cuenta o Pago Móvil:</strong>{" "}
                    {selectedMovement.AccountsBsUser.accbsUser_number ||
                      selectedMovement.AccountsBsUser.accbsUser_phone}
                  </p>
                  <p>
                    <strong>DNI:</strong>{" "}
                    {selectedMovement.AccountsBsUser.accbsUser_dni}
                  </p>
                </>
              ) : (
                <p
                  dangerouslySetInnerHTML={{
                    __html: selectedMovement.mov_comment
                      ? selectedMovement.mov_comment.replace(/\n/g, "<br/>")
                      : "Sin comentarios disponibles.",
                  }}
                />
              )}
              {selectedMovement.mov_img &&
                !selectedMovement.mov_img.toLowerCase().includes(".pdf") && (
                  <img
                    className="modal-image"
                    alt="ImageMovement"
                    src={`${url}/Movements/image/${selectedMovement.mov_img}`}
                  />
                )}
              {!selectedMovement.mov_img && <p>No hay documento adjunto.</p>}
              <button className="btn close-btn" onClick={closeDetails}>
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export { Movements };
