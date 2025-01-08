import { IonRouterOutlet } from "@ionic/react";
import { Route, RouteComponentProps } from "react-router-dom";
import TaskCreationModal from "../components/TaskCreationModal";
import TaskList from "../components/TaskList";

export default function Home({ match }: RouteComponentProps) {
	return (
		<IonRouterOutlet>
			<Route exact path={match.url} component={TaskList} />

			<Route path={`${match.url}/create`} component={TaskCreationModal} />
		</IonRouterOutlet>
	);
};
