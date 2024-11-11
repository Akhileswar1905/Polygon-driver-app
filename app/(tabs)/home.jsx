import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { BarChart } from "react-native-gifted-charts";
import { formatTripsAndEarnings, getUser } from "../../lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";

const Home = () => {
  const [rides, setRides] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [trips, setTrips] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);

  const fetchUser = async () => {
    const ph = await AsyncStorage.getItem("phoneNumber");
    if (!ph) {
      setIsRedirect(true);
      return;
    }
    const res = await getUser(ph);
    const { formattedTrips, formattedEarnings } = formatTripsAndEarnings(
      res.tripDetails,
      res.earnings
    );

    if (formattedTrips.length > 0) {
      setEarnings(formattedEarnings);
      setRides(formattedTrips);
    }
  };

  useEffect(() => {
    setTrips(null);
    fetchUser();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    setTrips(null);
    await fetchUser();
    setRefreshing(false);
  };

  if (isRedirect) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView className="w-full h-full">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View className="w-full px-6 my-6 space-y-2 justify-between flex-row items-center">
          <Text className="font-psemibold text-2xl">
            Ahoy! <Text className="font-pregular">Driver</Text>
          </Text>

          <Image
            source={images.logoSmall}
            className="w-9 h-10"
            resizeMode="contain"
          />
        </View>

        <View className="my-5 flex items-center justify-center">
          {trips ? (
            <Text className="font-psemibold text-xl">
              Earning: {trips.value}
            </Text>
          ) : null}
          <BarChart
            frontColor="#1171ba"
            barBorderRadius={5}
            barMarginBottom={5}
            data={earnings || []}
            onPress={(value) => {
              setTrips(value);
            }}
          />
        </View>
        <View>
          <BarChart
            data={rides || []}
            frontColor="#1171ba"
            barBorderRadius={5}
            barMarginBottom={5}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
