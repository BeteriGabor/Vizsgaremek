import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonToast,
} from "@ionic/react";
import axios from "axios";

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:1010/auth/login", {
        username,
        password,
      });

      const { token } = response.data;

      if (token) {
        localStorage.setItem("token", token);

        const profileRes = await axios.get(
          "http://localhost:1010/auth/get-profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(profileRes.data);

        const user = profileRes.data.ourUsers;

        if (user.role === "ADMIN") {
          window.location.href = "/tabs";
        } else {
          localStorage.removeItem("token");
          setToastMessage("Csak admin felhasználók léphetnek be.");
          setShowToast(true);
        }
      } else {
        setToastMessage("Hibás válasz a bejelentkezéskor.");
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage("Sikertelen bejelentkezés.");
      setShowToast(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Admin Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="floating">Felhasználónév</IonLabel>
          <IonInput
            value={username}
            onIonChange={(e) => setUsername(e.detail.value!)}
          />
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Jelszó</IonLabel>
          <IonInput
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value!)}
          />
        </IonItem>

        <IonButton
          expand="block"
          onClick={handleLogin}
          className="ion-margin-top"
        >
          Bejelentkezés
        </IonButton>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default AdminLogin;
