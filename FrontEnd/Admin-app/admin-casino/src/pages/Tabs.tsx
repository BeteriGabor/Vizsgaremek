import React from "react";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import { people, image, cash } from "ionicons/icons";
import { Redirect, Route } from "react-router-dom";
import UserManagementTab from "./UsersTab";
import AgeVerificationTab from "./AgeVerificationTab";
import TransactionTab from "./UsersTab";

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route path="/tabs/users" component={UserManagementTab} exact />
        <Route
          path="/tabs/age-verification"
          component={AgeVerificationTab}
          exact
        />
        <Route path="/tabs/transactions" component={TransactionTab} exact />
        <Redirect exact from="/tabs" to="/tabs/users" />
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="users" href="/tabs/users">
          <IonIcon icon={people} />
          <IonLabel>Felhasználók</IonLabel>
        </IonTabButton>
        <IonTabButton tab="age-verification" href="/tabs/age-verification">
          <IonIcon icon={image} />
          <IonLabel>Életkor ellenőrzés</IonLabel>
        </IonTabButton>
        <IonTabButton tab="transactions" href="/tabs/transactions">
          <IonIcon icon={cash} />
          <IonLabel>Tranzakciók</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
