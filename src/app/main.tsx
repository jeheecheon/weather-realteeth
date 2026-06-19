import { HomePage } from "@/pages/home";
import { ensure } from "@/shared/lib";
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./providers";
import "./styles";

const root = ensure(document.getElementById("root"), "Root element #root not found");

const StrictModeBoundary = import.meta.env.VITE_STRICT_MODE === "true" ? StrictMode : Fragment;

createRoot(root).render(
  <StrictModeBoundary>
    <GlobalProvider>
      <HomePage />
    </GlobalProvider>
  </StrictModeBoundary>,
);
