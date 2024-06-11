import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "../../lib/utils";
import { FlatList } from "react-native-web";
import EarningCard from "../../components/EarningCard";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fetchUser = async () => {
    const ph = await AsyncStorage.getItem("phoneNumber");
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
          </View>

          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={earnings}
            // keyExtractor={(trip) => trip.tripID || trip.tripId} // Adjust based on your data
            renderItem={({ item }) => <EarningCard />}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Earnings;
