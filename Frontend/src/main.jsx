import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import SignupForm from "./Component/Register.jsx";
import LoginForm from "./Component/Login.jsx";
import Home from "./Component/Home.jsx";
import { AppContextProvider } from "./Context/AppContext.jsx";
import EmailVerified from "./Component/EmailVerified.jsx";
import ResetPwd from "./Component/ResetPwd.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="register" element={<SignupForm />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="verify-email" element={<EmailVerified />} />
      <Route path="reset-password" element={<ResetPwd />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContextProvider>
      <RouterProvider router={router} />
    </AppContextProvider>
  </StrictMode>
);
