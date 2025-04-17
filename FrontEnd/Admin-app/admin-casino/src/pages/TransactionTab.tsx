import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonButtons,
} from "@ionic/react";
import axios from "axios";

const TransactionTab: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filterAmount, setFilterAmount] = useState("");
  const [filterType, setFilterType] = useState("");
  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const [txRes, userRes] = await Promise.all([
        axios.get("http://localhost:1010/transactions/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:1010/admin/get-all-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const usersList = userRes.data.ourUsersList || [];
      setUsers(usersList);

      const sorted = txRes.data.sort(
        (a: any, b: any) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setTransactions(sorted);
    } catch (err) {
      console.error("Hiba az adatok lekérésekor", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getUsernameById = (userId: number) => {
    console.log("Searching for userId:", userId, "in users:", users);
    const user = users.find((u) => u.id === userId);
    return user ? user.username : `#${userId}`;
  };
  
  

  const filtered = transactions.filter((t) => {
    const matchesAmount = filterAmount
      ? t.amount.toString().includes(filterAmount)
      : true;
    const matchesType = filterType ? t.transactionType === filterType : true;
    return matchesAmount && matchesType;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tranzakciók</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={fetchTransactions}>🔄 Frissítés</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInput
          placeholder="Szűrés összeg alapján"
          value={filterAmount}
          onIonChange={(e) => setFilterAmount(e.detail.value!)}
          className="ion-margin-bottom"
        />
        <IonSelect
          value={filterType}
          placeholder="Típus szűrése"
          onIonChange={(e) => setFilterType(e.detail.value)}
          className="ion-margin-bottom"
        >
          <IonSelectOption value="">Mind</IonSelectOption>
          <IonSelectOption value="DEPOSIT">Befizetés</IonSelectOption>
          <IonSelectOption value="WITHDRAW">Kivét</IonSelectOption>
        </IonSelect>

        <IonList>
          {filtered.map((t) => (
            <IonItem key={t.id}>
              <IonLabel>
                <h2>{t.transactionType}</h2>
                <p><strong>Felhasználó:</strong> {getUsernameById(t.userId)}</p>
                <p><strong>Összeg:</strong> {t.amount} credits</p>
                <p><strong>Dátum:</strong> {new Date(t.timestamp).toLocaleString()}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TransactionTab;
