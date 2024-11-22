import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ToDoList from '../components/Index';
import './Home.css';

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

				<ToDoList />
			</IonContent>
		</IonPage>
	);
};

export default Home;
