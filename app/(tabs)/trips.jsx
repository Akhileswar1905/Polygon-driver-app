import {
  View,
  Text,
  ScrollView,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import { v4 as uuid } from "uuid";
import TripCard from "../../components/TripCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Trips = () => {
  const { user } = useGlobalContext();
  const [trips, setTrips] = useState(null);
  const fetchDetails = async () => {
    try {
      console.log(user);
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      const res = await axios.get(
        `https://polygon-project.onrender.com/driver/${phoneNumber}`
      );
      setTrips(res.data.tripDetails);
      console.log(res.data.tripDetails);
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

  console.log(user?.tripDetails);
  return (
    <SafeAreaView className=" h-full">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              console.log("refreshing....");
              onRefresh();
            }}
          />
        }
      >
        {trips?.length === 0 ? (
          <>
            <View className="items-center justify-center">
              <Image
                source={images.empty}
                className="w-[75%]"
                resizeMode="contain"
              />
              <Text className="text-2xl font-psemibold">No Trips Found</Text>
              <Text className="text-base font-pregular mt-0.5">
                Add your First Trip
              </Text>
              <CustomButton
                title={"Click here to add a new trip"}
                btnStyles={"w-[75%] mt-7"}
                handleOnPress={() => router.push("/newtrip")}
              />
            </View>
          </>
        ) : (
          // Using flatlist to display the trips
          <>
            <View className="px-4 my-2 space-y-2">
              <Text className="text-3xl font-pmedium mt-6 mb-6">
                Trip Details
              </Text>
              <View className="w-full items-center justify-center shadow-sm shadow-black-200 rounded-sm">
                <View className="w-full p-5">
                  <Text className="font-psemibold text-xl">
                    Current Contract:
                  </Text>
                  <Text className="text-xl font-pmedium mt-0.5">
                    {user?.contractDetails.length > 0
                      ? user.contractDetails[user.contractDetails.length - 1]
                          .company
                      : "No Contracts until now"}
                  </Text>
                </View>
              </View>
            </View>
            <FlatList
              data={trips}
              keyExtractor={(trip) => trip.tripID}
              renderItem={({ item }) => (
                <>
                  <TripCard otherStyles={"mt-5"} trip={item} />
                </>
              )}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Trips;
