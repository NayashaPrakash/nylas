import "../App.css";
import Sidebar from "../components/Sidebar";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Read from "../pages/Read";
import Schedule from "../Schedule";
import Send from "../pages/Send";
// import SentimentAnalysis from "../SentimentAnalysis.ejs/sentimentAnalysis";

function SideNav() {
  return (
    <Router>
      <Sidebar />
      
      <Routes>
        <Route path='/' exact element={<Schedule/>} />
        <Route path='/read' element={<Read/>} />
        <Route path='/events' element={<Schedule/>} />
        <Route path='/send' element={<Send/>} />
        {/* <Route path='/sentiment-analysis' element={<SentimentAnalysis />} /> */}
        </Routes>
    </Router>
    


  );
}
   
export default SideNav;