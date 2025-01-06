import { IonRouterOutlet } from "@ionic/react";
import { Route, RouteComponentProps } from "react-router-dom";
import TodoItemCreation from "../components/TodoItemCreation";
import TodoList from "../components/TodoList";
import "./Home.css";

export default function Home({ match }: RouteComponentProps) {
	return (
		<IonRouterOutlet>
			<Route exact path={match.url} component={TodoList} />

			<Route path={`${match.url}/create`} component={TodoItemCreation} />
		</IonRouterOutlet>
	);
};
