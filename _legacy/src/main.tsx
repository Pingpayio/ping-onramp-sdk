import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "@coinbase/onchainkit/styles.css";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
