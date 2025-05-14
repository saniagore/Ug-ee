import { useNavigate } from 'react-router-dom';

/**
 * Custom Navigation Hook
 * 
 * @function useNavigation
 * @description Provides centralized navigation functions for common routes
 * 
 * @returns {Object} Navigation methods:
 * - goToHomePage: Navigates to the home page
 * - goToWaitForValid: Navigates to the validation waiting page
 * - goToMenu: Navigates to the main menu
 * - goToColaborador: Navigates to the collaborator section
 * 
 * @example
 * // Usage in components:
 * const { goToHomePage } = useNavigation();
 * 
 * function handleClick() {
 *   goToHomePage();
 * }
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  
  /**
   * Navigates to the home page
   * @function goToHomePage
   */
  const goToHomePage = () => {
    navigate('/');
  };
  
  /**
   * Navigates to the validation waiting page
   * @function goToWaitForValid
   */
  const goToWaitForValid = () => {
    navigate('/WaitForValid');
  };

  /**
   * Navigates to the main menu
   * @function goToMenu
   */
  const goToMenu = () => {
    navigate('/Menu');
  };
  
  /**
   * Navigates to the collaborator section
   * @function goToColaborador
   */
  const goToColaborador = () => {
    navigate('/Colaborador');
  };
  
  return { 
    goToHomePage, 
    goToWaitForValid, 
    goToMenu, 
    goToColaborador 
  };
};