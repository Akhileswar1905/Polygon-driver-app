import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handleOnPress,
  btnStyles,
  onLoading,
  textStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={handleOnPress}
      disabled={onLoading}
      activeOpacity={0.7}
      className={`bg-[#3d6dfe] rounded-xl min-h-[45px]  justify-center items-center ${btnStyles}
      {${onLoading} ? 'opacity-50':''}
      `}
    >
      {onLoading ? (
        <ActivityIndicator />
      ) : (
        <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
