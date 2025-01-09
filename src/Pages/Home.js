import React from "react";
import { clearLocalStorage } from "../Hooks/useLocalStorage";

function Home() {
    clearLocalStorage();
  return (
    <div>Home</div>
  )
}

export {Home}