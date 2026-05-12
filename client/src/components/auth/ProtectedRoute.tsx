import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

const ProtectedRoute = ({
  children
}: Props) => {

  const token = localStorage.getItem("token");

  if (!token) {
    return (<Navigate
      to="/auth/login"
      state={{
        message: "You need to login to view your tasks"
      }}
    />
  )};

  return children;
};

export default ProtectedRoute;
