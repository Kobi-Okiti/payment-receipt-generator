import { BrowserRouter, Route, Routes } from "react-router";
import PaymentPage from "./routes/(app)";
import AdminLogin from "./routes/(auth)";
import AdminDashboard from "@/features/admin/AdminDashboard";
import ReceiptPage from "@/features/admin/ReceiptPage";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PaymentPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/receipt/:transactionID" element={<ReceiptPage />} />
        <Route path="*" element={<>not-found</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
