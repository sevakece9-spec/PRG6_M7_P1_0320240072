import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { CameraView, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AboutScreen() {

  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const cameraRef = useRef(null);

  const STORAGE_KEY = '@profile_photo';

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {
    loadProfilePhoto();
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();

      console.log('Camera Permission:', status);

      setHasPermission(status === 'granted');
    } catch (error) {
      console.log(error);
    }
  };

  const loadProfilePhoto = async () => {
    try {
      const savedPhotoUri = await AsyncStorage.getItem(STORAGE_KEY);

      if (savedPhotoUri !== null) {
        setProfilePhoto(savedPhotoUri);
      }
    } catch (error) {
      console.log('Gagal memuat foto profil', error);
    }
  };

  // =========================
  // FOTO
  // =========================
  const takePicture = async () => {
    try {

      if (!cameraRef.current) {
        Alert.alert('Error', 'Kamera belum siap');
        return;
      }

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
        skipProcessing: true,
      });

      setProfilePhoto(photo.uri);

      await AsyncStorage.setItem(STORAGE_KEY, photo.uri);

      setIsCameraOpen(false);

      Alert.alert(
        'Berhasil',
        'Foto profil berhasil diperbarui!'
      );

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Error',
        'Gagal mengambil foto.'
      );
    }
  };

  // =========================
  // HALAMAN KAMERA
  // =========================
  if (isCameraOpen) {

    if (hasPermission === null) {
      return (
        <View style={styles.container}>
          <Text>Meminta izin kamera...</Text>
        </View>
      );
    }

    if (hasPermission === false) {
      return (
        <View style={styles.container}>

          <Text style={styles.infoText}>
            Izin kamera ditolak
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={requestCameraPermission}
          >
            <Text style={styles.buttonText}>
              Izinkan Kamera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonDanger}
            onPress={() => setIsCameraOpen(false)}
          >
            <Text style={styles.buttonText}>
              Batal
            </Text>
          </TouchableOpacity>

        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>

        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing="front"
        />

        <View style={styles.cameraOverlay}>

          <View style={styles.captureContainer}>

            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
            >
              <Text style={styles.captureButtonText}>
                Jepret
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsCameraOpen(false)}
            >
              <Text style={styles.buttonText}>
                Batal
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </View>
    );
  }

  // =========================
  // HALAMAN ABOUT
  // =========================
  return (
    <View style={styles.container}>

      <View style={styles.profileCard}>

        <View style={styles.imageContainer}>

          {profilePhoto ? (
            <Image
              source={{ uri: profilePhoto }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>
                Belum Ada Foto
              </Text>
            </View>
          )}

        </View>

        <Text style={styles.nameText}>
          Roshela Amelia Sari
        </Text>

        <Text style={styles.nimText}>
          NIM: 0320240072
        </Text>

        <Text style={styles.programText}>
          Manajemen Informatika
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setIsCameraOpen(true)}
        >
          <Text style={styles.buttonText}>
            {profilePhoto
              ? 'Ganti Foto Profil'
              : 'Ambil Foto Profil'}
          </Text>
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FAF6F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: 'white',
    width: '85%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',

    elevation: 5,

    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  imageContainer: {
    marginBottom: 20,
  },

  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#805603',
  },

  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,

    backgroundColor: '#9eecef',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 3,
    borderColor: '#6edd6a',
    borderStyle: 'dashed',
  },

  placeholderText: {
    color: '#67576f',
    fontWeight: 'bold',
  },

  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },

  nimText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },

  programText: {
    fontSize: 14,
    color: '#005b63',
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },

  button: {
    backgroundColor: '#005b63',

    paddingVertical: 12,
    paddingHorizontal: 25,

    borderRadius: 10,

    width: '100%',
    alignItems: 'center',
  },

  buttonDanger: {
    backgroundColor: '#dc3545',

    paddingVertical: 12,
    paddingHorizontal: 25,

    borderRadius: 10,

    width: '100%',
    alignItems: 'center',

    marginTop: 10,
  },

  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  infoText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },

  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 40,
  },

  captureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  captureButton: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    elevation: 5,
  },

  captureButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },

  cancelButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },

});