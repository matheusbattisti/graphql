import React from "react";
import NavbarComponent from "./components/NavbarComponent";
import AppRoutes from "./routes";
import { Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes>
        <NavbarComponent />
      </AppRoutes>
    </AuthProvider>
  );
}

export default App;
