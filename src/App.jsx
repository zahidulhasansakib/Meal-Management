import React from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import Home from "./Components/pages/Home/Home";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <Toaster position="top-right" />
     <Home></Home>
    </div>
  );
}

export default App;
