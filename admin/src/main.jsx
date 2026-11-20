import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "../../src/components/ui/sonner";
import { AdminProvider } from "../../src/context/AdminContext";
import AdminDashboard from "../../src/pages/AdminDashboard";
import "../../src/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
      <Toaster position="bottom-right" />
    </AdminProvider>
  </React.StrictMode>
);
