import HomePage from './views/home/homePage.js';
import WaitForValid from './views/waitForValid.js';
import Menu from './views/menu.js'
import Colaborador from './views/home/colaborador.js'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import MenuColaborador from './views/menuColaborador.js';
import GestionConductores from './views/menuColaborador/ventanasInstitucion/gestionConductores.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div className="app"><HomePage /></div>} />
        <Route path='/WaitForValid' element={<WaitForValid/>} />
        <Route path='/Menu' element={<Menu/>} />
        <Route path='/Colaborador' element={<Colaborador/>} />
        <Route path='/Colaborador/Menu' element={<MenuColaborador/>} />
        <Route path='/Colaborador/Gestion-conductores' element={<GestionConductores/>} />
      </Routes>
    </Router>
  );
}

export default App;