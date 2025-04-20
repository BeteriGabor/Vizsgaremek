import React, { useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonLabel,
  IonModal,
} from "@ionic/react";
import axios from "axios";

const AgeVerificationTab: React.FC = () => {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  const fetchImages = async () => {
    try {
      const res = await axios.get("http://localhost:1010/admin/getAllImages", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const allImages = res.data || [];
      const validImages = [];

      for (const img of allImages) {
        try {
          const userRes = await axios.get(`http://localhost:1010/admin/get-users/${img.userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.data.ourUsers) {
            validImages.push(img);
          }
        } catch (e) {
          console.log(`Skip image ${img.id} — user not found`);
        }
      }

      setImages(validImages);
    } catch (err) {
      console.error("Hiba a képek lekérésekor", err);
    }
  };

  const fetchUserInfo = async (userId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:1010/admin/get-users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data.ourUsers;
    } catch (err) {
      console.error("Hiba a felhasználó adatainak lekérésekor", err);
      return null;
    }
  };

  const acceptVerification = async (userId: number) => {
    try {
      await axios.put(
        `http://localhost:1010/admin/accept-age-verification/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      closeModalAndRefresh();
    } catch (err) {
      console.error("Hiba az életkor elfogadása közben", err);
    }
  };

  const deleteImageOnly = async (imageId: number) => {
    try {
      await axios.delete(`http://localhost:1010/admin/delete-image/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeModalAndRefresh();
    } catch (err) {
      console.error("Hiba a kép törlésekor", err);
    }
  };

  const deleteUserAndImage = async (userId: number) => {
    try {
      await axios.delete(`http://localhost:1010/admin/delete/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      closeModalAndRefresh();
    } catch (err) {
      console.error("Hiba a törlés közben", err);
    }
  };

  const closeModalAndRefresh = () => {
    setShowModal(false);
    setSelectedImage(null);
    setUserInfo(null);
    fetchImages();
  };

  const handleImageClick = async (imageData: any) => {
    const info = await fetchUserInfo(imageData.userId);
    if (info) {
      setSelectedImage(imageData);
      setUserInfo(info);
      setShowModal(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Életkor ellenőrzés</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" onClick={fetchImages}>
          Képek betöltése
        </IonButton>
        <IonGrid>
          <IonRow>
            {images.map((img, index) => (
              <IonCol
                size="6"
                key={index}
                onClick={() => handleImageClick(img)}
              >
                <IonImg src={`data:image/jpeg;base64,${img.imageBase64}`} />
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>

        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Kép előnézet</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {selectedImage && (
              <>
                <IonImg
                  src={`data:image/jpeg;base64,${selectedImage.imageBase64}`}
                />
                {userInfo && (
                  <div className="ion-margin-top">
                    <IonLabel>
                      <h2>Felhasználó adatai</h2>
                      <p>Név: {userInfo.username}</p>
                      <p>Email: {userInfo.email}</p>
                      <p>Szerep: {userInfo.role}</p>
                    </IonLabel>

                    <IonButton
                      expand="block"
                      color="success"
                      onClick={() => acceptVerification(userInfo.id)}
                    >
                      Elfogadás
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="warning"
                      onClick={() => deleteImageOnly(selectedImage.id)}
                    >
                      Csak kép törlése
                    </IonButton>
                    <IonButton
                      expand="block"
                      color="danger"
                      onClick={() => deleteUserAndImage(userInfo.id)}
                    >
                      Kép ÉS felhasználó törlése
                    </IonButton>
                  </div>
                )}
              </>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AgeVerificationTab;
