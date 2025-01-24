import { useContext } from "react";
import { Redirect, Route, RouteProps } from "react-router";
import { AuthContext } from "../../Providers/AuthProvider";
import { LOGIN } from "../../Utils/Constants/Routes";

export default function ProtectedRoute({ ...routeProps }: RouteProps) {
  const { currentUser } = useContext(AuthContext);

  return currentUser === null ? <Redirect to={LOGIN} /> : <Route {...routeProps} />;
}
