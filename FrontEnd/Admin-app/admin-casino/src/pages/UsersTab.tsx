import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonInput,
} from "@ionic/react";

const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:1010/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.ourUsersList || []);
    } catch (err) {
      console.error("Hiba a felhasználók lekérésekor", err);
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await axios.delete(`http://localhost:1010/admin/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Hiba a törlés közben", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(filter.toLowerCase()) ||
      user.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Felhasználók kezelése</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonInput
          placeholder="Szűrés név vagy email alapján"
          value={filter}
          onIonChange={(e) => setFilter(e.detail.value!)}
          className="ion-margin"
        />
        <IonList>
          {filteredUsers.map((user) => (
            <IonItem key={user.id}>
              <IonLabel>
                <h2>{user.username}</h2>
                <p>{user.email}</p>
              </IonLabel>

              <IonButton color="danger" onClick={() => deleteUser(user.id)}>
                Törlés
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default UserManagementTab;
