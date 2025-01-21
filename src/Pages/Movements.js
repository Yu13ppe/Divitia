import React, { useState } from "react";
import { FaListAlt } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";


function Movements() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedMovement, setSelectedMovement] = useState(null);

  // Transacciones estáticas de prueba
  const userMovements = [
    { mov_id: 1, mov_type: "Transferencia", mov_status: "approved", mov_amount: "+ €50.00" },
    { mov_id: 2, mov_type: "Pago de servicio", mov_status: "approved", mov_amount: "+ €30.00" },
    { mov_id: 3, mov_type: "Compra en tienda", mov_status: "approved", mov_amount: "- €25.00" },
    { mov_id: 4, mov_type: "Depósito", mov_status: "approved", mov_amount: "+ €200.00" },
    { mov_id: 5, mov_type: "Retiro de efectivo", mov_status: "approved", mov_amount: "- €100.00" },
    { mov_id: 6, mov_type: "Transferencia", mov_status: "pending", mov_amount: "+ €20.00" },
    { mov_id: 7, mov_type: "Pago de factura", mov_status: "pending", mov_amount: "- €60.00" },
    { mov_id: 8, mov_type: "Compra online", mov_status: "pending", mov_amount: "- €15.00" },
    { mov_id: 9, mov_type: "Ingreso", mov_status: "pending", mov_amount: "+ €100.00" },
    { mov_id: 10, mov_type: "Transferencia interna", mov_status: "pending", mov_amount: "- €50.00" },
    { mov_id: 11, mov_type: "Transferencia fallida", mov_status: "rejected", mov_amount: "- €25.00" },
    { mov_id: 12, mov_type: "Pago rechazado", mov_status: "rejected", mov_amount: "- €40.00" },
    { mov_id: 13, mov_type: "Recarga no procesada", mov_status: "rejected", mov_amount: "+ €15.00" },
    { mov_id: 14, mov_type: "Compra rechazada", mov_status: "rejected", mov_amount: "- €20.00" },
    { mov_id: 15, mov_type: "Pago de factura fallido", mov_status: "rejected", mov_amount: "- €30.00" },
  ];

  const handleTabChange = (tab) => setActiveTab(tab);

  const filteredTransactions = userMovements.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.mov_status === activeTab;
  });

  const showDetails = (transaction) => setSelectedMovement(transaction);
  const closeDetails = () => setSelectedMovement(null);



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
            className={`filter-btn ${activeTab === "approved" ? "active" : ""}`}
            onClick={() => handleTabChange("approved")}
          >
            Aprobadas
          </button>
          <button
            className={`filter-btn ${activeTab === "rejected" ? "active" : ""}`}
            onClick={() => handleTabChange("rejected")}
          >
            Rechazadas
          </button>
          <button
            className={`filter-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => handleTabChange("pending")}
          >
            En Espera
          </button>
        </div>

        {/* Lista de movimientos */}
        <section className="transactions">
          <h3>
            {activeTab === "all"
              ? "Todas las Transferencias"
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </h3>
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
                    <span className={`status ${transaction.mov_status}`}>
                      {transaction.mov_status === "approved"
                        ? "Aprobada"
                        : transaction.mov_status === "pending"
                        ? "En Espera"
                        : "Rechazada"}
                    </span>
                  </div>
                  <div className="amount">{transaction.mov_amount}</div>
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
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Detalles de la Transacción</h2>
              <p>
                <strong>Tipo:</strong> {selectedMovement.mov_type}
              </p>
              <p>
                <strong>Estado:</strong> 
                {selectedMovement.mov_status === "approved"
                  ? "Aprobada"
                  : selectedMovement.mov_status === "pending"
                  ? "En Espera"
                  : "Rechazada"}
              </p>
              <p>
                <strong>Monto:</strong> {selectedMovement.mov_amount}
              </p>
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
