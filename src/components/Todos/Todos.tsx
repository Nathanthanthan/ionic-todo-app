import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonPage,
  IonProgressBar,
  IonTitle,
  IonToolbar
} from "@ionic/react";
import { logOut as logOutIcon } from "ionicons/icons";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthProvider";
import { TASKS, TODOS } from "../../Utils/Constants/Routes";
import Todo, { getTodoProgress } from "../../Utils/Types/Todo";
import { useHistory } from "react-router-dom";

export default function Todos() {
  const { currentUser, logOut } = useContext(AuthContext);
  const history = useHistory();

  function goToTasks(todoId: number) {
    history.push(`${TODOS}/${todoId}${TASKS}`);
  }

  const test: Todo[] = [
    {
      id: 1,
      index: 0,
      name: "Test 1",
      tasks: [],
    },
    {
      id: 2,
      index: 0,
      name: "Test 2",
      tasks: [
        { id: 0, index: 0, name: "", checked: true },
        { id: 1, index: 1, name: "", checked: true },
        { id: 2, index: 2, name: "", checked: true },
        { id: 3, index: 3, name: "", checked: true },
        { id: 4, index: 4, name: "", checked: true },
        { id: 5, index: 5, name: "", checked: true },
        { id: 6, index: 6, name: "", checked: true },
        { id: 7, index: 7, name: "", checked: true },
        { id: 8, index: 8, name: "", checked: true },
        {
          id: 9,
          index: 9,
          name: "",
          checked: false,
          subTasks: [
            { id: 10, index: 10, name: "", checked: true },
            {
              id: 11,
              index: 11,
              name: "",
              checked: false,
              subTasks: [
                { id: 11, index: 11, name: "", checked: true },
                { id: 12, index: 12, name: "", checked: false },
              ],
            },
          ]
        },
      ],
    },
    {
      id: 3,
      index: 0,
      name: "Test 3",
      tasks: [],
    },
    {
      id: 4,
      index: 0,
      name: "Test 4",
      tasks: [],
    },
    {
      id: 5,
      index: 0,
      name: "Test 5",
      tasks: [],
    },
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="primary">
            <IonButton
              className="pr-5"
              onClick={logOut}
            >
              Logout

              <IonIcon
                slot="end"
                icon={logOutIcon}
              />
            </IonButton>
          </IonButtons>

          <IonTitle>Todos</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {currentUser && (
          <h1 className="pb-4">
            {currentUser.displayName}'s todo list
          </h1>
        )}

        {test.map(todo => {
          const progress = getTodoProgress(todo);

          return (
            <button
              className="text-left w-full m-1.5"
              onClick={() => goToTasks(todo.id)}
            >
              <IonCard className="m-0">
                <IonCardHeader className="p-2">
                  <IonCardTitle>
                    <IonInput
                      onClick={e => e.stopPropagation()}
                      value={todo.name}
                      className="discreet w-fit"
                    />
                  </IonCardTitle>
                </IonCardHeader>

                <IonCardContent className="flex flex-col gap-1 pb-2">
                  <span className="text-base">
                    Progress:
                  </span>

                  <div>
                    <IonProgressBar value={progress / 100} />

                    {progress}%
                  </div>
                </IonCardContent>
              </IonCard>
            </button>
          );
        })}
      </IonContent>
    </IonPage>
  );
}
