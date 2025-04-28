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

  const fetchData = async () => {
    try {
      const [txRes, userRes] = await Promise.all([
        axios.get("http://localhost:1010/transactions/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:1010/admin/get-all-users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setTransactions(txRes.data);
      setUsers(userRes.data.ourUsersList || []);
    } catch (err) {
      console.error("Hiba a lekérés során:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUsername = (userId: number) => {
    const user = users.find((u: any) => u.id === userId);
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
            <IonButton onClick={fetchData}>🔄 Frissítés</IonButton>
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
          <IonSelectOption value="BET">Fogadás</IonSelectOption>
        </IonSelect>

        <IonList>
          {filtered.map((t) => (
            <IonItem key={t.id}>
              <IonLabel>
                <h2>{t.transactionType}</h2>
                <p>
                  <strong>Tranzakció ID:</strong> #{t.id}
                </p>

                <p>
                  <strong>Összeg:</strong> {t.amount} credits
                </p>
                <p>
                  <strong>Dátum:</strong>{" "}
                  {new Date(t.timestamp).toLocaleString("hu-HU")}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TransactionTab;
