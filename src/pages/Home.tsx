import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import TodoList from "../components/TodoList";
import "./Home.css";

const Home: React.FC = () => {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonTitle>Todo list</IonTitle>
				</IonToolbar>
			</IonHeader>

			<IonContent fullscreen>
				<IonHeader collapse="condense">
					<IonToolbar>
						<IonTitle size="large">
							Todo list
						</IonTitle>
					</IonToolbar>
				</IonHeader>

				<TodoList />
			</IonContent>
		</IonPage>
	);
};

export default Home;
