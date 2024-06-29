import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Continent from "./pages/Continent";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route Component={Home} path='/' index />
        <Route Component={Continent} path='/:continent' index />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
