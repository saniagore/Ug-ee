import HomePage from './views/homePage.js';
import WaitForValid from './views/waitForValid.js';
import './css/App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<div className="app"><HomePage /></div>} />
        <Route path='/WaitForValid' element={<WaitForValid/>} />
      </Routes>
    </Router>
  );
}

export default App;