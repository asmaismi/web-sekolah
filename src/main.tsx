// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { useAuth } from "@/store/auth";
import { useSettings } from "@/store/settings"; // ← TAMBAH INI

await useAuth.getState().init();
await useSettings.getState().init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
