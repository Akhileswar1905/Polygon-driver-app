import { View, Text, Image } from "react-native";
import React from "react";
import { icons, images } from "../constants";

const TripCard = ({ trip, otherStyles }) => {
  const { tripID, tripTime, tripLocation, tripDate } = trip;
  return (
    <View
      className={`${otherStyles}  m-3 rounded-xl bg-[#eee0e0] shadow-lg shadow-black-200/40`}
    >
      <View className="w-full gap-4 items-center flex-row justify-start px-3 py-2">
        <Image source={icons.Taxi} className="w-[43px]" />
        <Text className="text-xl font-pmedium">{tripID}</Text>
      </View>
      <View className="w-full gap-5 items-center flex-row justify-between p-3">
        <View>
          <Text className="text-xl font-pmedium text-gray-600">Area</Text>
          <Text className="text-2xl font-psemibold">{tripTime}</Text>
          <Text className="text-xl font-pmedium text-gray-600">{tripDate}</Text>
        </View>
        <Image source={images.location} className="w-[200px] h-[120px]" />
      </View>
    </View>
  );
};

export default TripCard;
