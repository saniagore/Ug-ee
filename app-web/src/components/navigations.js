import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();
  
  const goToHomePage = () => {
    navigate('/');
  };
  
  const goToWaitForValid = () => {
    navigate('/WaitForValid');
  };
  
  return { goToHomePage, goToWaitForValid };
};