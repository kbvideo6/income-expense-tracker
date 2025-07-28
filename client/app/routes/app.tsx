import { BrowserRouter, Routes, Route } from "react-router-dom";
import login from "~/components/forms/login";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<login />} />
      </Routes>
    </BrowserRouter>
  );
}
