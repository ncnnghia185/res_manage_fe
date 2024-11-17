"use client";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-photo-view/dist/react-photo-view.css";
import { Provider } from "react-redux";
import { store, persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
