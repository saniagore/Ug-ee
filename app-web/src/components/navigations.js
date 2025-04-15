import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  
  const goToHomePage = () => {
    navigate('/');
  };
  
  const goToWaitForValid = () => {
    navigate('/WaitForValid');
  };

  const goToMenu = () => {
    navigate('/Menu');
  };
  
  return { goToHomePage, goToWaitForValid, goToMenu };
};