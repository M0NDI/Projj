import { NextUIProvider } from "@nextui-org/react";
import { Routes, Route, useParams } from "react-router-dom";
import "./App.css";
import NavigationBar from "./Components/NavigationBar";
import { useNavigate } from "react-router-dom";
import Projects from "./Pages/Projects";
import Project from "./Pages/Project";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Features from "./Pages/Features";
import Signup from "./Pages/Signup";

function App() {
  const navigate = useNavigate();

  return (
    // navigate is passed as a prop to to allow NextUI Link components to preventDefault behaviour
    <NextUIProvider navigate={navigate} className="light h-screen">
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/features" element={<Features />} />
        <Route path="/project/:projectId" element={<Project />} />
      </Routes>
    </NextUIProvider>
  );
}

export default App;
