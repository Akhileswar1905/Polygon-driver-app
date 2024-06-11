import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera, CameraType } from "expo-camera/legacy";
import { router } from "expo-router";
import axios from "axios";
import { useGlobalContext } from "../../context/GlobalContext";
import {
  getDownloadURL,
  uploadBytesResumable,
  ref as storageRef,
} from "firebase/storage";
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

import CustomButton from "../../components/CustomButton";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhSYSkYEz6uh7DO1k9DBItGDxkXPITtp0",
  authDomain: "driversync-b0b4c.firebaseapp.com",
  projectId: "driversync-b0b4c",
  storageBucket: "driversync-b0b4c.appspot.com",
  messagingSenderId: "712749584983",
  appId: "1:712749584983:web:6ab0b5370172b210628912",
};

// Initialize Firebase
if (!getApps().length) {
  initializeApp(firebaseConfig);
}
const storage = getStorage();

const SignUp3 = () => {
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    photo: null,
    DrivingLicense: null,
    vehicleRC: null,
    vehiclePhotos: null,
    vehicleVideo: null,
  });
  const [upload, setUpload] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const cameraRef = useRef(null);

  // Get the user from async storage
  useEffect(() => {
    const getUser = async () => {
      const res = await AsyncStorage.getItem("user");
      setForm({
        ...form,
        ...JSON.parse(res),
      });
    };
    getUser();
  }, []);

  // Camera Reference
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    })();
  }, []);

  // Take Picture
  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      photo.mimeType = "image/jpg";
      photo.size = (photo.height * photo.width) / 1000;
      photo.name = photo.uri.split("/").pop();
      setForm({ ...form, photo: photo });
    }
  };

  // Helper function to upload a file to Firebase
  const uploadFile = async (file) => {
    if (!file) return null;

    const response = await fetch(file.uri);
    const blob = await response.blob();
    const ref = storageRef(storage, `uploads/${file.name}`);

    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(ref, blob);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log(
            "Progress",
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(resolve).catch(reject);
        }
      );
    });
  };

  // Uploading to the database
  const submit = async () => {
    if (
      !form.photo ||
      !form.DrivingLicense ||
      !form.vehicleRC ||
      !form.vehiclePhotos ||
      !form.vehicleVideo
    ) {
      return Alert.alert("Fill all the fields");
    }

    setUploading(true);

    try {
      const uploadPromises = [
        uploadFile(form.photo),
        uploadFile(form.DrivingLicense),
        uploadFile(form.vehicleRC),
        uploadFile(form.vehiclePhotos),
        uploadFile(form.vehicleVideo),
      ];

      const [
        photoURL,
        drivingLicenseURL,
        vehicleRCURL,
        vehiclePhotosURL,
        vehicleVideoURL,
      ] = await Promise.all(uploadPromises);

      setForm({
        ...form,
        photo: photoURL,
        DrivingLicense: drivingLicenseURL,
        vehicleRC: vehicleRCURL,
        vehiclePhotos: vehiclePhotosURL,
        vehicleVideo: vehicleVideoURL,
      });

      setUpload(true);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  // Signup method
  const handleSignUp = async () => {
    try {
      setUploading(true);
      console.log(form);
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/signup",
        {
          username: form.username,
          dob: form.dob,
          phoneNumber: form.phoneNumber,
          email: form.email,
          Aadhar: form.Aadhar,
          PAN: form.PAN,
          IFSC: form.IFSC,
          AccNumber: form.AccNumber,
          vehicleNumber: form.vehicleNumber,
          DrivingLicense: form.DrivingLicense,
          vehicleRC: form.vehicleRC,
          photo: form.photo,
          vehiclePhotos: form.vehiclePhotos,
          vehicleVideo: form.vehicleVideo,
        }
      );
      console.log("res", res.data.driver);

      if (res.status === 200) {
        await AsyncStorage.setItem("phoneNumber", res.data.driver.phoneNumber);
        Alert.alert("Success", "User Signed up successfully");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setForm({});
      setUploading(true);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl font-psemibold">Upload Files</Text>

        {/* User Photo */}
        <Text className="text-base font-pmedium mt-7">User Photo</Text>
        {form.photo ? (
          <Image
            source={{ uri: form.photo.uri || form.photo }}
            resizeMode="contain"
            className="w-72 h-72 my-4"
          />
        ) : (
          <View className="w-full items-center">
            <Camera
              style={{ width: 300, height: 300 }}
              ref={cameraRef}
              type={CameraType.front}
            />
            <TouchableOpacity
              className="bg-gray-200 p-4 rounded-xl w-full items-center justify-center mt-4"
              onPress={takePicture}
            >
              <Text className="text-small text-black-100 font-pregular">
                Take Selfie
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          onPress={submit}
          className="bg-[#5882ff] p-4 rounded-xl w-full items-center justify-center mt-4 mb-4"
          disabled={upload || uploading}
        >
          <Text className="text-small text-white font-pregular ">
            Upload Files
          </Text>
        </TouchableOpacity>

        {uploading && (
          <ActivityIndicator size="large" color="#0000ff" className="mt-7" />
        )}

        {upload && (
          <CustomButton
            title="Sign Up"
            handleOnPress={handleSignUp}
            otherStyles="mt-7"
            loading={uploading}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp3;
