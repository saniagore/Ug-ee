import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import HomePage from './views/home/homePage.js';
import Validando from './views/validando.js';
import Menu from './views/user/menu.jsx';
import Colaborador from './views/home/colaborador.js';

import VerificarColaborador from './views/verificarColaborador.js';
import GestionConductores from './views/menuColaborador/ventanasInstitucion/gestionConductores.jsx';
import GestionVehiculos from './views/menuColaborador/ventanasInstitucion/gestionVehiculos.jsx';
import GestionReportes from './views/menuColaborador/ventanasInstitucion/gestionReportes.jsx';
import RegistroVehiculo from './views/menuColaborador/ventanasConductor/registrarVehiculo.js';
import EstadisticasViajes from './views/menuColaborador/ventanasInstitucion/estadisticas.jsx';

/**
 * Main application component that handles routing and navigation.
 * 
 * @component
 * @name App
 * @description The root component of the application that sets up all the routes
 * using React Router. It renders different components based on the current URL path.
 * 
 * @returns {React.Component} Returns the router configuration with all defined routes.
 * 
 * @example
 * // Basic usage
 * function Root() {
 *   return (
 *     <App />
 *   );
 * }
 */
function App() {
  return (
    <Router>
      <Routes>
        {/**
         * Route for the home page
         * @route /
         * @description The main entry point of the application
         */}
        <Route 
          path='/' 
          element={
            <div className="app">
              <HomePage />
            </div>
          } 
        />
        
        {/**
         * Route for the validation waiting page
         * @route /Validando
         * @description Displays a waiting screen during validation processes
         */}
        <Route 
          path='/Validando' 
          element={<Validando />} 
        />
        
        {/**
         * Route for the main menu
         * @route /Menu
         * @description The primary navigation menu of the application
         */}
        <Route 
          path='/Menu' 
          element={<Menu />} 
        />
        
        {/**
         * Route for the collaborator portal
         * @route /Colaborador
         * @description Entry point for collaborator-specific functionality
         */}
        <Route 
          path='/Colaborador' 
          element={<Colaborador />} 
        />
        
        {/**
         * Route for the collaborator menu
         * @route /Colaborador/Menu
         * @description Specialized menu with collaborator-specific options
         */}
        <Route 
          path='/Colaborador/Menu' 
          element={<VerificarColaborador />} 
        />
        
        {/**
         * Route for driver management (institution view)
         * @route /Colaborador/Gestion-conductores
         * @description Interface for managing drivers within an institution
         */}
        <Route 
          path='/Colaborador/Gestion-conductores' 
          element={<GestionConductores />} 
        />
        <Route
          path='/Colaborador/Gestion-vehiculos'
          element={<GestionVehiculos/>}
        />
        <Route 
          path='/Colaborador/Registrar-vehiculo'
          element={<RegistroVehiculo/>}
        />
        <Route
          path='/Colaborador/Gestion-reportes'
          element={<GestionReportes/>}
        />
        <Route
          path='/Colaborador/Estadisticas'
          element={<EstadisticasViajes/>}
        />
      </Routes>
    </Router>
  );
}

/**
 * Home page component
 * @module HomePage
 * @description The main landing page of the application
 * @see {@link ./views/home/homePage.js}
 */

/**
 * Validation waiting component
 * @module Validando
 * @description Displays a waiting state during validation processes
 * @see {@link ./views/Validando.js}
 */

/**
 * Main menu component
 * @module Menu
 * @description Primary navigation interface for the application
 * @see {@link ./views/menu.js}
 */

/**
 * Collaborator portal component
 * @module Colaborador
 * @description Entry point for collaborator-specific features
 * @see {@link ./views/home/colaborador.js}
 */

/**
 * Collaborator menu component
 * @module VerificarColaborador
 * @description Specialized menu with additional options for collaborators
 * @see {@link ./views/menuColaborador.js}
 */

/**
 * Driver management component
 * @module GestionConductores
 * @description Interface for institutions to manage their drivers
 * @see {@link ./views/menuColaborador/ventanasInstitucion/gestionConductores.jsx}
 */

export default App;