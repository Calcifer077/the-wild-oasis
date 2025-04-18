import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ui/ErrorFallback.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* 'ErrorBoundary' will come into effect whenever our app runs into any kind of error during react-rendering. For example whenever a white screen comes up during development. In such cases below 'FallbackComponent' will be rendered. This componenet will have a error object associated to it. */}
    {/* 'onReset' will reset the state of the app. In our case it will go to homepage */}
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.replace("/")}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
