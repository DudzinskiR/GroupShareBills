import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import UserCacheProvider from "./contexts/user-context";
import UsersCacheProvider from "./contexts/users-cache-context";
import BillsCacheProvider from "./contexts/bills-cache-context";
import UIProvider from "./contexts/ui-context";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <UsersCacheProvider>
        <UserCacheProvider>
          <BillsCacheProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </BillsCacheProvider>
        </UserCacheProvider>
      </UsersCacheProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
