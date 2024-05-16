import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode, Video } from "expo-av";
import { icons, images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";
import { createDriver } from "../../lib/appwrite";
import { Camera } from "expo-camera";
import axios from "axios";
import { useGlobalContext } from "../../context/GlobalContext";
// import { CameraType } from "expo-camera/build/legacy/Camera.types";

const SignUp3 = () => {
  // Constants
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    vehiclePhotos: null,
    vehicleVideo: null,
    photo: null,
  });
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const cameraRef = useRef(null);

  // Lets
  let photo = null;
  let vehiclePhotos = null;
  let vehicleVideo = null;

  // Get the user from the async storage
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

  // Files uploading to the app
  const openPicker = async (selectType) => {
    const res = await DocumentPicker.getDocumentAsync({
      type:
        selectType === "image"
          ? ["image/png", "image/jpg", "image/jpeg"]
          : ["video/mp4", "video/gif"],
    });

    if (!res.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          vehiclePhotos: res.assets[0],
        });
      }
      if (selectType === "video") {
        setForm({
          ...form,
          vehicleVideo: res.assets[0],
        });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document picked", JSON.stringify(res, null, 2));
      }, 100);
    }
  };

  // Take Picture
  const takePicture = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync();
      // console.log(photo);
      photo.mimeType = "image/jpg";
      photo.size = photo.height * photo.width;
      photo.name = photo.uri.split("/")[photo.uri.split("/").length - 1];
      setForm({
        ...form,
        photo: photo,
      });
    }
  };

  // Uploading to the database
  const submit = async () => {
    if (!form.vehiclePhotos || !form.vehicleVideo) {
      return Alert.alert("Fill all the fields");
    }

    setUploading(true);
    const res = await createDriver(form);

    // console.log(res);

    setForm({
      ...form,
      photo: res.profilePic,
      vehiclePhotos: res.VehiclePics,
      vehicleVideo: res.VehicleVideo,
    });
    photo = res.profilePic;
    vehiclePhotos = res.VehiclePics;
    vehicleVideo = res.VehicleVideo;

    try {
      console.log(form);
      // router.push("/login");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSignUp = async () => {
    await submit();
    try {
      const res = await axios.post(
        "https://polygon-project.onrender.com/driver/signup",
        {
          username: form.username,
          dob: form.dob,
          phoneNumber: form.phoneNumber,
          email: form.email,
          Aadhar: form.Aadhar,
          PAN: form.PAN,
          DrivingLicense: form.DrivingLicense,
          IFSC: form.IFSC,
          AccNumber: form.AccNumber,
          vehicleNumber: form.vehicleNumber,
          photo: photo,
          vehiclePhotos: vehiclePhotos,
          vehicleVideo: vehicleVideo,
        }
      );
      console.log("res");
      console.log(res.data.driver);
      if (res.status === 200) {
        await AsyncStorage.setItem("phoneNumber", res.data.driver.phoneNumber);
        Alert.alert("Success", "User Signed up successfully");
        router.push("/home");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setForm({});
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl font-psemibold">Upload Files</Text>

        {/* Car Photo */}
        <View className="mt-10 space-y-2">
          <Text className="text-base font-pmedium">Upload Car Photo</Text>
          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.vehicleVideo ? (
              <Image
                source={{
                  uri: form.vehiclePhotos.uri || form.vehiclePhotos,
                }}
                resizeMode="contain"
                className="w-full h-16"
              />
            ) : (
              <View className="w-full h-16 border-2 border-gray-300 flex-row space-x-2 bg-gray-300 px-4 items-center justify-center rounded-xl">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-small text-black-100 font-pregular">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* User Photo */}
        <Text className="text-base font-pmedium mt-7">User Photo</Text>
        {form.photo ? (
          <Image
            source={{ uri: form.photo.uri || form.photo }}
            resizeMode="contain"
            className="w-36 h-36 my-4"
          />
        ) : (
          // Camera from Expo-Camera
          <View className="w-full items-center">
            <Camera
              style={{ width: 100, height: 100 }}
              ref={cameraRef}
              type={Camera.Constants.Type.front}
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

        {/* Car Video */}
        <View className="mt-7 space-y-2">
          <Text className="text-base font-pmedium">Upload Car Video</Text>
          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.vehicleVideo ? (
              <Video
                source={{
                  uri: form.vehicleVideo.uri || form.vehicleVideo,
                }}
                resizeMode={ResizeMode.CONTAIN}
                className="w-full h-40"
                isLooping
                useNativeControls
              />
            ) : (
              <View className="w-full h-40 bg-gray-300 px-4 items-center justify-center rounded-xl">
                <View className="w-14 h-14 border border-dashed border-secondary-100 items-center justify-center ">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <CustomButton
          title={"Sign Up"}
          btnStyles={"mt-7"}
          handleOnPress={() => handleSignUp()}
          onLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp3;
