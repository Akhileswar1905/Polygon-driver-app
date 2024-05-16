import { View, Text, TouchableOpacity } from "react-native";
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
      className={`bg-black rounded-xl min-h-[50px] justify-center items-center ${btnStyles}
      {onLoading ? 'opacity-50':''}
      `}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
