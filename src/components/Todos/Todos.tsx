import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { add, logOut as logOutIcon } from "ionicons/icons";
import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";
import todoService from "../../Services/TodoService";
import { TASKS, TODOS } from "../../Utils/Constants/Routes";
import useQuery from "../../Utils/Hooks/UseQuery";
import TodoCard from "./TodoCard";
import TodoCreationModal from "./TodoCreationModal";

export default function Todos() {
  const { currentUser, logOut } = useContext(AuthContext);
  const history = useHistory();
  const [showToast] = useIonToast();

  const { data: todos, loading: todosLoading, reRunQuery: refetchTodos } = useQuery({
    query: todoService.getByUserId,
    args: [currentUser?.uid],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  async function onTodoSubmit(name: string) {
    if (!currentUser) return;

    const res = await todoService.create({ uid: currentUser.uid, name });

    if (res) {
      refetchTodos();
    } else {
      showToast({
        message: "Error: failed to create todo",
        duration: 2000,
        color: "danger",
      });
    }
  }

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

      {/* Todo creation */}
      <TodoCreationModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSubmit={onTodoSubmit}
      />

      <IonContent className="ion-padding">
        <div className={`flex pb-2 ${currentUser ? "justify-between" : "justify-end"}`}>
          {currentUser && (
            <h1>{currentUser.displayName}'s todo list</h1>
          )}

          <IonButton onClick={() => setIsModalOpen(true)}>
            <span className="flex items-center gap-1">
              <IonIcon
                icon={add}
                className="text-lg"
              />

              Add todo
            </span>
          </IonButton>
        </div>

        {todos === undefined ? (
          todosLoading ? (
            <IonSpinner />
          ) : (
            "No"
          )
        ) : (
          todos.map(todo => (
            <TodoCard
              key={todo.id}
              todo={todo}
              onClick={() => history.push(`${TODOS}/${todo.id}${TASKS}`)}
              refetchTodos={refetchTodos}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
}
