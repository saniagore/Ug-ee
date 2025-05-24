import { useEffect } from "react";
import { useNavigation } from "./navigations";

export function useAuthVerification() {
  const { goToHomePage, goToValidando } = useNavigation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/usuario/auth/verify",
          {
            credentials: "include",
          }
        );
        if (!response.ok) goToHomePage();
        const data = await response.json();
        if (!data.user.estado) goToValidando();
      } catch (error) {
        goToHomePage();
      }
    };
    verifyAuth();
  }, [goToHomePage, goToValidando]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/usuario/logout", {
        method: "POST",
        credentials: "include",
      });
      goToHomePage();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return { handleLogout };
}