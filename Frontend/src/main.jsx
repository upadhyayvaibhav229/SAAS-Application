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
// import Home from "./Component/Home.jsx";
import { AppContextProvider } from "./Context/AppContext.jsx";
import EmailVerified from "./Component/EmailVerified.jsx";
import ResetPwd from "./Component/ResetPwd.jsx";
import PrivateRoute from "./Component/PrivateRoute.jsx";
import ProfilePage from "./Component/Profile.jsx";
// import DashBoard from "./Pages/DashBoard.js";
import DashboardPage from "./Pages/DashboardPage.jsx";
import Customer from "./Pages/Customer.jsx";
import Invoices from "./Pages/invoices.jsx";
import Payment from "./Pages/Payment.jsx";
import Items from "./Pages/Items.jsx";
import Orders from "./Pages/Orders.jsx";
import User from "./Pages/User.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route
        index
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      
      {/* admin Route */}
      <Route path="dashboard" element={<DashboardPage/>}/>
      <Route path="customers" element={<Customer/>}/>
      <Route path="orders" element={<Orders/>}/>
      <Route path="invoices" element={<Invoices/>}/>
      <Route path="items" element={<Items/>}/>
      <Route path="payments" element={<Payment/>}/>
      <Route path="users" element={<User/>}/>
      

      {/* Public routes */}
      <Route path="register" element={<SignupForm />} />
      <Route path="login" element={<LoginForm />} />
      <Route path="verify-email" element={<EmailVerified />} />
      <Route path="reset-password" element={<ResetPwd />} />
      <Route path="/profile" element= {<ProfilePage/>}/>
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
