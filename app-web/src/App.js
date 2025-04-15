import HomePage from './views/homePage.js';
import WaitForValid from './views/waitForValid.js';
import Menu from './views/menu.js'
import './css/App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div className="app"><HomePage /></div>} />
        <Route path='/WaitForValid' element={<WaitForValid/>} />
        <Route path='/Menu' element={<Menu/>} />
      </Routes>
    </Router>
  );
}

export default App;