import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import TaskList from "./components/TaskList/TaskList";
import Todos from "./components/Todos/Todos";
import { AuthContext } from "./Providers/AuthProvider";
import { LOGIN, SIGN_UP, TODOS } from "./Utils/Constants/Routes";

export default function Routing() {
  const { currentUser } = useContext(AuthContext);

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          {/* Login */}
          <Route exact path={LOGIN}>
            {currentUser === null ? (
              <Login />
            ) : (
              <Redirect to={TODOS} />
            )}
          </Route>

          {/* Sign up */}
          <Route exact path={SIGN_UP}>
            {currentUser === null ? (
              <SignUp />
            ) : (
              <Redirect to={TODOS} />
            )}
          </Route>

          {/* Task list */}
          <ProtectedRoute path={`${TODOS}/:todoId`} component={TaskList} />

          {/* Todos */}
          <ProtectedRoute exact path={TODOS} component={Todos} />

          {/* Fallback route */}
          <ProtectedRoute>
            <Redirect to={TODOS} />
          </ProtectedRoute>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
