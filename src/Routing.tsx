import { IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { useContext } from "react";
import { Redirect, Route } from "react-router-dom";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import TaskList from "./components/TaskList/TaskList";
import Todos from "./components/Todos/Todos";
import { AuthContext } from "./Providers/AuthProvider";
import { LOGIN, SIGN_UP, TASKS, TODOS } from "./Utils/Constants/Routes";
import useQuery from "./Utils/Hooks/UseQuery";
import useTodoService from "./Utils/Hooks/UseServices/UseTodoService";

export default function Routing() {
  const { currentUser } = useContext(AuthContext);

  const todoService = useTodoService();

  const { data: todos, loading: todosLoading, reRunQuery: refetchTodos } = useQuery({
    query: todoService?.getCurrentUserTodos,
    args: [],
  });

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

        <Route exact path={SIGN_UP}>
          {currentUser === null ? (
            <SignUp />
          ) : (
            <Redirect to={TODOS} />
          )}
        </Route>

        {/* Todos */}
        <ProtectedRoute exact path={TODOS}>
          <Todos
            todos={todos}
            todoService={todoService}
            todosLoading={todosLoading}
            refetchTodos={refetchTodos}
          />
        </ProtectedRoute>

        {/* Task list */}
        <ProtectedRoute exact path={`${TODOS}/:todoId${TASKS}`}>
          <TaskList refetchTodos={refetchTodos} />
        </ProtectedRoute>

        {/* Fallback route */}
        <ProtectedRoute exact>
          <Redirect to={TODOS} />
        </ProtectedRoute>
      </IonRouterOutlet>
    </IonReactRouter>
  );
}
