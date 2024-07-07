import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../../lib/utils";
import { FlatList } from "react-native";
import EarningCard from "../../components/EarningCard";
import { Redirect } from "expo-router";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchUser = async () => {
    const ph = await AsyncStorage.getItem("phoneNumber");
    if (!ph) {
      <Redirect href={"/"} />;
    }
    const res = await getUser(ph);
    setEarnings(res.earnings);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUser();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className=" h-full">
      {earnings.length === 0 ? (
        <ScrollView>
          <View className=" items-center justify-center">
            <Image
              source={images.empty}
              className="w-[75%]"
              resizeMode="contain"
            />
            <Text className="text-2xl font-psemibold">No Earnings Found</Text>
          </View>
        </ScrollView>
      ) : (
        <>
          <View className="w-full px-6 my-6 space-y-2 justify-between flex-row items-center">
            <Text className="font-psemibold text-2xl">Earnings</Text>
            <View className="shadow-md shadow-black-100">
              <Text className="font-pregular text-lg ">
                ₹{earnings.reduce((acc, curr) => acc + curr.amount, 0)}
              </Text>
            </View>
          </View>

          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={earnings}
            // keyExtractor={(trip) => trip.tripID || trip.tripId} // Adjust based on your data
            renderItem={({ item }) => <EarningCard earnings={item} />}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Earnings;
