import { HomePage } from "@/pages/home";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./providers";
import "./styles";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found");
}

createRoot(root).render(
  <StrictMode>
    <GlobalProvider>
      <HomePage />
    </GlobalProvider>
  </StrictMode>,
);
