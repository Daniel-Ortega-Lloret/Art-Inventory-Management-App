/**
 * Frontend entry point
 * This file mounts the React application into the root DOM element
 * and loads the global stylesheet
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/global.css";

// Render the root application inside React StrictMode.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);