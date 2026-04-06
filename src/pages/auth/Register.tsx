import { Navigate } from "react-router-dom";

// Register shares the combined Login/Register page
export default function Register() {
  return <Navigate to="/login" replace />;
}
