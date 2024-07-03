import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Continent from "./pages/Continent";
import Country from "./pages/Country";


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route Component={Home} path='/' index />
        <Route Component={Continent} path='/continent/:continent' />
        <Route Component={Country} path='/country/:country' />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
