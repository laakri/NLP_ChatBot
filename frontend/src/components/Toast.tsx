import React from "react";
import { Toaster } from "react-hot-toast";

const Toast: React.FC = () => {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "var(--bg-color)",
          color: "var(--text-color)",
        },
        success: {
          duration: 3000,
        },
        error: {
          duration: 5000,
        },
      }}
    />
  );
};

export default Toast;
