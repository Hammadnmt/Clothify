import { useNavigate } from "react-router";

export default function useAuth() {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("userInfo");

  const requireAuth = (path) => {
    if (!isAuthenticated) {
      navigate(path || "/account");
    }
  };

  return { isAuthenticated, requireAuth };
}
