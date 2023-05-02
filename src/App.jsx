import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainHeader from "./components/MainHeader";
import Home from "./pages/Home";
import Host from "./pages/Host";
import Active from "./pages/Active";

const App = () =>{
  return(

    <BrowserRouter>
    <MainHeader/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/dashboard" element={<div>Dashboard</div>}/>
      <Route path="/host" element={<Host/>}/>
      <Route path="/active" element={<Active/>}/>
    </Routes>
    </BrowserRouter>
  )
}
export default App;