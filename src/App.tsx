import { IonApp, setupIonicReact } from "@ionic/react";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Ionic Dark Palette */
import '@ionic/react/css/palettes/dark.system.css';

// Tailwind / general styling
import "./theme/index.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import "@ionic/react/css/palettes/dark.always.css"; */
/* import "@ionic/react/css/palettes/dark.class.css"; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

// Authentification
import AuthProvider from "./Providers/AuthProvider";
// Global todo management
import TodoProvider from "./Providers/TodoProvider";
// Routes
import Routing from "./Routing";

setupIonicReact({
  innerHTMLTemplatesEnabled: true,
});

export default function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <IonApp>
          <Routing />
        </IonApp>
      </TodoProvider>
    </AuthProvider>
  );
}
