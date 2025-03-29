import { BrowserRouter, Route, Routes } from "react-router";
import PaymentPage from "./routes/(app)";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<PaymentPage />} />
        <Route path="*" element={<>not-found</>} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
