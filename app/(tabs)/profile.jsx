import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import Label from "../../components/Label";
import { useGlobalContext } from "../../context/GlobalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router } from "expo-router";
import axios from "axios";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const [driver, setDriver] = useState(null);
  const fetchDetails = async () => {
    const phoneNumber = await AsyncStorage.getItem("phoneNumber");
    if (!phoneNumber) {
      <Redirect href={"/"} />;
    }
    try {
      const res = await axios.get(
        `https://polygon-project.onrender.com/driver/${phoneNumber}`
      );
      setDriver(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchDetails();
  }, []);

  const onRefresh = () => {
    fetchDetails();
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    console.log("Logged out");
    setUser(null);
    setIsLoggedIn(false);
    router.push("/");
    BackHandler.exitApp();
  };

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => onRefresh()} />
        }
      >
        <View className="w-full min-h-[85vh] justify-center my-1">
          <View className="w-full flex-row items-end justify-end p-4">
            <TouchableOpacity
              onPress={() => {
                handleLogout();
              }}
            >
              <Image
                source={icons.logout}
                className="w-4 h-9"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View className="w-full items-center justify-center">
            <Image
              source={driver?.photo || images.profile}
              className="w-[115px] h-[115px] my-4 rounded-xl border-2"
              resizeMode="contain"
            />

            <View className="w-[55%] flex-row justify-between p-4">
              <View className="items-center">
                <Text className="font-psemibold text-xl">
                  {driver?.tripDetails.length}
                </Text>
                <Text className="font-pmedium text-base">Trips</Text>
              </View>
              <View className="items-center">
                <Text className="font-psemibold text-xl">
                  {driver?.contractDetails.length}
                </Text>
                <Text className="font-pmedium text-base">Contracts</Text>
              </View>
            </View>

            <View className="w-full items-start my-2">
              <View className="w-full items-center p-5 ">
                <Label
                  title="Name"
                  value={driver?.username}
                  otherStyles={"mb-4"}
                />
                <Label
                  title="Phone Number"
                  value={driver?.phoneNumber}
                  otherStyles={"mb-4"}
                />
                <Label
                  title="Email"
                  value={driver?.vehicleNumber}
                  otherStyles={"mb-4"}
                />

                <Label
                  title="Aadhar"
                  value={driver?.Aadhar}
                  otherStyles={"mb-4"}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
