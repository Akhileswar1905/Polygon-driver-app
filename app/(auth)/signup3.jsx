import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ResizeMode, Video } from "expo-av";
import { icons } from "../../constants";
import CustomButton from "../../components/CustomButton";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

const SignUp3 = () => {
  // Constants
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    vehiclePhotos: null,
    vehicleVideo: null,
    DrivingLicense: null,
    vehicleRC: null,
  });

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

  // Files uploading to the app
  const openPicker = async (selectType, name) => {
    const res = await DocumentPicker.getDocumentAsync("*/*");

    console.log(name, res.assets[0]);

    if (!res.canceled) {
      if (name === "carPic") {
        setForm({
          ...form,
          vehiclePhotos: res.assets[0],
        });
      } else if (name === "dlPic") {
        setForm({
          ...form,
          DrivingLicense: res.assets[0],
        });
      } else if (name === "rcPic") {
        setForm({
          ...form,
          vehicleRC: res.assets[0],
        });
      }
      if (name === "carVideo") {
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

  const handleNext = async () => {
    console.log(form);
    if (
      form.vehiclePhotos === null ||
      form.vehicleVideo === null ||
      form.DrivingLicense === null ||
      form.vehicleRC === null
    ) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const user = {
      username: form.username,
      dob: form.dob,
      phoneNumber: form.phoneNumber,
      email: form.email,
      Aadhar: form.Aadhar,
      PAN: form.PAN,
      IFSC: form.IFSC,
      AccNumber: form.AccNumber,
      vehicleNumber: form.vehicleNumber,
      vehicleRC: form.vehicleRC,
      DrivingLicense: form.DrivingLicense,
      vehiclePhotos: form.vehiclePhotos,
      vehicleVideo: form.vehicleVideo,
    };
    await AsyncStorage.setItem("user", JSON.stringify(user));
    router.push("/signup4");
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl font-psemibold">Upload Files</Text>

        {/* Car Photo */}
        <View className="mt-10 space-y-2">
          <Text className="text-base font-pmedium">Upload Car Photo</Text>
          <TouchableOpacity onPress={() => openPicker("image", "carPic")}>
            {form.vehicleVideo ? (
              <Image
                source={{
                  uri: form.vehiclePhotos.uri || form.vehiclePhotos,
                }}
                resizeMode="contain"
                className="w-full h-16"
              />
            ) : (
              <View className="w-full h-10 border-2 border-[#5882ff] flex-row space-x-2 bg-[#5882ff] px-4 items-center justify-center rounded-xl">
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

        {/* Driving Licence Photo */}
        <View className="mt-10 space-y-2">
          <Text className="text-base font-pmedium">Upload Driving License</Text>
          <TouchableOpacity onPress={() => openPicker("image", "dlPic")}>
            {form.vehicleVideo ? (
              <Image
                source={{
                  uri: form.DrivingLicense.uri || form.DrivingLicense,
                }}
                resizeMode="contain"
                className="w-full h-16"
              />
            ) : (
              <View className="w-full h-10 border-2 border-[#5882ff] flex-row space-x-2 bg-[#5882ff] px-4 items-center justify-center rounded-xl">
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

        {/* Car RC Photo */}
        <View className="mt-10 space-y-2">
          <Text className="text-base font-pmedium">Upload Car RC Photo</Text>
          <TouchableOpacity onPress={() => openPicker("image", "rcPic")}>
            {form.vehicleVideo ? (
              <Image
                source={{
                  uri: form.vehicleRC.uri || form.vehicleRC,
                }}
                resizeMode="contain"
                className="w-full h-16"
              />
            ) : (
              <View className="w-full h-10 border-2 border-[#5882ff] flex-row space-x-2 bg-[#5882ff] px-4 items-center justify-center rounded-xl">
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

        {/* Car Video */}
        <View className="mt-7 space-y-2">
          <Text className="text-base font-pmedium">Upload Car Video</Text>
          <TouchableOpacity onPress={() => openPicker("video", "carVideo")}>
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
              <View className="w-full h-40 bg-[#5882ff] px-4 items-center justify-center rounded-xl">
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
          title={"Next"}
          btnStyles={"mt-7"}
          handleOnPress={() => handleNext()}
          onLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp3;
