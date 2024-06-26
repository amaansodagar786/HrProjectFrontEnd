
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './Componants/Home/Home';
import About from './Componants/About/About';
import Footer from './Componants/Footer/Footer';
import Career from './Componants/Career/Career';
import Contact from './Componants/Contact/Contact';
import Header from './Componants/Navbar/Header';
// import Slider from './Componants/Home/Slider/Slider';
import SliderComponant from './Componants/Home/Slider/Slider';

function App() {
  return (
    <>
            <BrowserRouter>
            <Header/>
            <Routes>
            <Route path='/' element= {<Home/>}/>
            <Route path='/about' element= {<About/>}/>
            <Route path='/career' element= {<Career/>}/>
            <Route path='/contact' element= {<Contact/>}/>
            <Route path='/slider' element= {<SliderComponant/>}/>

            </Routes>
            <Footer/>
            </BrowserRouter>



    </>
  );
}

export default App;
