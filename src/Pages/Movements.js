import React, { useState, useEffect, useCallback } from "react";
import { useDataContext } from "../Context/dataContext";
import axios from "axios";
import { useAxiosInterceptors } from "../Hooks/useAxiosInterceptors";


function Movements() {
  useAxiosInterceptors();
  const { infoTkn, url } = useDataContext();

  const [activeTab, setActiveTab] = useState("all");
  const [userMovements, setUserMovements] = useState([]);
  const [selectedMovement, setSelectedMovement] = useState(null);

  const handleTabChange = (tab) => setActiveTab(tab);

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

  const filteredTransactions = userMovements.filter((transaction) => {
    if (activeTab === "all") return true;
    return transaction.mov_status === activeTab;
  });

  useEffect(() => {
    fetchDataUser();
  }, [fetchDataUser]);

  const showDetails = (transaction) => setSelectedMovement(transaction);
  const closeDetails = () => setSelectedMovement(null);
  
  return (
    <div>Movements</div>
  )
}

export {Movements}