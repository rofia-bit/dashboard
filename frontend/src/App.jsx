import { Routes, Route } from "react-router-dom";
import Login from "./presentation/pages/Login";
import Dashboard from "./presentation/pages/Dashboard";
import Edit from "./presentation/pages/Edit";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/edit" element={<Edit />} />
    </Routes>
  );
}

export default App;