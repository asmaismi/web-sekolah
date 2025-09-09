import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";

const container = document.getElementById("root")!;
createRoot(container).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
