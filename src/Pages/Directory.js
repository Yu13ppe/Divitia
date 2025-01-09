import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";
import { useDataContext } from "../Context/dataContext";

function Directory() {
  useAxiosInterceptors();
  const { url, infoTkn } = useDataContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DATOS PARA BENEFICIARIO
  const [accbsUser_bank, setAccbsUser_bank] = useState("");
  const [accbsUser_owner, setAccbsUser_owner] = useState("");
  const [accbsUser_number, setAccbsUser_number] = useState("");
  const [accbsUser_dni, setAccbsUser_dni] = useState("");
  const [accbsUser_phone, setAccbsUser_phone] = useState("");
  const [accbsUser_type, setAccbsUser_type] = useState("");
  const [accbsUser_country, setAccbsUser_country] = useState("");
  const [accbsUser_email, setAccbsUser_email] = useState("");

  // Estado para editar beneficiario
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);

  // Estado para validaciones
  const [errors, setErrors] = useState({});

  // Estado del usuario
  const [user, setUser] = useState([]);
  const [userDirectory, setUserDirectory] = useState([]);

  // Prefijos para teléfono
  // const [telefonoPrefix, setTelefonoPrefix] = useState("");

  // Alternar modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Fetch de datos del usuario
  const fetchDataUser = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/Auth/findByToken/${infoTkn}`, {
        headers: {
          Authorization: `Bearer ${infoTkn}`,
        },
      });
      setUser(response.data);

      const responseDirectory = await axios.get(
        `${url}/AccBsUser/user/${response.data.use_id}`,
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );
      setUserDirectory(responseDirectory.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUser, infoTkn, url]);

  // Validación de formulario
  const validateForm = () => {
    const newErrors = {};

    if (!accbsUser_country) {
      newErrors.accbsUser_country = "El país es requerido.";
    }

    if (!accbsUser_owner) {
      newErrors.accbsUser_owner = "El nombre es requerido.";
    }

    if (accbsUser_type === "Pago Movil") {
      const fullPhone = accbsUser_phone;
      if (!accbsUser_phone) {
        newErrors.accbsUser_phone = "El número telefónico es requerido.";
      } else if (!/^\d+$/.test(fullPhone)) {
        newErrors.accbsUser_phone =
          "El número telefónico solo puede contener dígitos.";
      }
      else if (accbsUser_phone<11 || accbsUser_phone>11) {
        newErrors.accbsUser_phone =
          "El número telefónico debe tener 11 dígitos.";
      }
    } else if (accbsUser_type === "Cuenta Bancaria" && !accbsUser_number) {
      newErrors.accbsUser_number = "El número de cuenta bancaria es requerido.";
    } else if (accbsUser_type === "Cuenta Bancaria" && (accbsUser_number < 20 || accbsUser_number > 20)) {
      newErrors.accbsUser_number = "El número de cuenta debe tener 20 dígitos.";
    } else if (
      accbsUser_type === "Zelle" &&
      (!accbsUser_email || accbsUser_country !== "Estados Unidos")
    ) {
      newErrors.accbsUser_email =
        "El correo electrónico es requerido para Zelle.";
    }

    if (!accbsUser_bank) {
      newErrors.accbsUser_bank = "El banco es requerido.";
    }

    setErrors(newErrors);
    console.log(errors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddAccountSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Si accbsUser_dni es nulo o vacío, asignar "NA"
    const finalDni = accbsUser_dni ? accbsUser_dni : "NA";

    try {
      await axios.post(
        `${url}/AccBsUser/create`,
        {
          accbsUser_bank,
          accbsUser_owner,
          accbsUser_number,
          accbsUser_dni: finalDni, // Usamos el DNI con "NA" si está vacío
          accbsUser_phone, // Aquí usamos el número concatenado
          accbsUser_type,
          accbsUser_status: "Activo",
          accbsUser_userId: user.use_id,
          accbsUser_country,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      window.location.reload();

      toast.success("Cuenta agregada con éxito!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("Error al agregar la cuenta:", error.response || error);
      toast.error("Error al agregar la cuenta", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleEdit = async (event) => {
    event.preventDefault();

    try {
      await axios.put(
        `${url}/AccBsUser/${selectedBeneficiary.accbsUser_id}`,
        {
          accbsUser_owner: accbsUser_owner
            ? accbsUser_owner
            : selectedBeneficiary.accbsUser_owner,
          accbsUser_bank: accbsUser_bank
            ? accbsUser_bank
            : selectedBeneficiary.accbsUser_bank,
          accbsUser_number: accbsUser_number
            ? accbsUser_number
            : selectedBeneficiary.accbsUser_number,
          accbsUser_dni: accbsUser_dni
            ? accbsUser_dni
            : selectedBeneficiary.accbsUser_dni,
          accbsUser_phone, // Aquí se concatena el prefijo y el número de teléfono
          accbsUser_type: accbsUser_type
            ? accbsUser_type
            : selectedBeneficiary.accbsUser_type,
        },
        {
          headers: {
            Authorization: `Bearer ${infoTkn}`,
          },
        }
      );

      closeEditModal();
      window.location.reload();

      toast.success("Beneficiario editado con éxito!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al editar el beneficiario", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleStatus = async (beneficiario) => {
    try {
      if (beneficiario.accbsUser_status === "Inactivo") {
        await axios.put(
          `${url}/AccBsUser/${beneficiario.accbsUser_id}`,
          {
            accbsUser_status: "Activo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      } else {
        await axios.put(
          `${url}/AccBsUser/${beneficiario.accbsUser_id}`,
          {
            accbsUser_status: "Inactivo",
          },
          {
            headers: {
              Authorization: `Bearer ${infoTkn}`,
            },
          }
        );
      }

      window.location.reload();

      toast.success("Cuenta desactivada con éxito!", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log(error);
      toast.error("Error al desactivar la cuenta", {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const openEditModal = (beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSelectedBeneficiary(null);
    setIsEditModalOpen(false);
  };

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);
  return (
    <div>Directory</div>
  )
}

export {Directory}