import { useContext, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { AuthContext } from "./Providers/AuthProvider";
import { LIST, LOGIN } from "./Utils/Constants/Routes";
import Login from "./components/Login";
import TaskDetails from "./components/TaskList/TaskDetails";
import TaskList from "./components/TaskList/TaskList";

export default function Routing() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    console.log('currentUser:', currentUser);
  }, [currentUser]);

  return currentUser === null ? (
    <>
      {/* Login */}
      <Route exact path={LOGIN} component={Login} />

      {/* Redirect if not logged in */}
      <Redirect to={LOGIN} />
    </>
  ) : (
    <>
      {/* Login */}
      <Route exact path={LOGIN} component={Login} />

      {/* Task list */}
      <Route exact path={LIST} component={TaskList} />

      {/* Task details */}
      <Route
        path={`${LIST}/:id`}
        render={({ match }) => <TaskDetails id={Number(match.params.id)} />}
      />

      {/* Fallback route */}
      <Route render={() => <Redirect to={LIST} />} />
    </>
  );
}
