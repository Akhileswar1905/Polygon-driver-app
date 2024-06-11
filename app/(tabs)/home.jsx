import { View, Text, ScrollView, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import { BarChart, LineChart } from "react-native-gifted-charts";

const data = [
  { value: 0, label: "Jan" },
  { value: 0, label: "Feb" },
  { value: 0, label: "March" },
  { value: 0, label: "Apr" },
  { value: 0, label: "May" },
  { value: 0, label: "June" },
];

const Home = () => {
  const [rides, setRides] = useState(null);
  return (
    <SafeAreaView className="w-full h-full ">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => setRides(null)} />
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
          {rides ? (
            <Text className="font-psemibold text-xl">Rides: {rides.value}</Text>
          ) : null}
          <BarChart
            frontColor={`#1171ba`}
            barBorderRadius={5}
            barMarginBottom={5}
            data={data}
            onPress={(value) => {
              setRides(value);
            }}
          />
        </View>
        <View className="my-7 flex items-center justify-center ">
          <LineChart data={data} color1="#1171ba" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
