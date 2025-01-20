import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "./Providers/AuthProvider";
import { LOGIN, TASKS, TODOS } from "./Utils/Constants/Routes";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Login from "./components/Login";
import TaskDetails from "./components/TaskList/TaskDetails";
import TaskList from "./components/TaskList/TaskList";
import Todos from "./components/Todos/Todos";

export default function Routing() {
  const { currentUser } = useContext(AuthContext);

  return (
    <IonReactRouter>
      <IonRouterOutlet>
        {/* Login */}
        <Route exact path={LOGIN}>
          {currentUser === null ? (
            <Login />
          ) : (
            <Redirect to={TODOS} />
          )}
        </Route>

        {/* Todos */}
        <ProtectedRoute exact path={TODOS}>
          <Todos />
        </ProtectedRoute>

        {/* Task list */}
        <ProtectedRoute exact path={`${TODOS}/:todoId${TASKS}`}>
          <TaskList />
        </ProtectedRoute>

        {/* Task details */}
        <ProtectedRoute exact path={`${TODOS}/:todoId${TASKS}/:taskId`}>
          <TaskDetails />
        </ProtectedRoute>

        {/* Fallback route */}
        <ProtectedRoute exact>
          <Redirect to={TODOS} />
        </ProtectedRoute>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
