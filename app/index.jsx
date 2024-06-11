import { Redirect, router } from "expo-router";
import { Image, RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { images } from "../constants";
import { useGlobalContext } from "../context/GlobalContext";

export default function App() {
  const { isLoading, isLoggedIn } = useGlobalContext();

  console.log(isLoading, isLoggedIn);

  if (!isLoading && isLoggedIn) {
    console.log("User Logged In");
    return <Redirect href={"/home"} />;
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => {
              if (!isLoading && isLoggedIn) {
                console.log("User Logged In");
                return <Redirect href={"/home"} />;
              }
            }}
          />
        }
      >
        <View className="w-full m-h-[100vh] px-4 flex-1 items-center justify-center">
          {/* Logo */}

          <View className="flex w-full items-center justify-center">
            <Image
              source={images.logo_1}
              className="w-[280px] h-[168px]"
              resizeMode="contain"
            />
          </View>

          <Image
            source={images.cover}
            className="w-[400px] h-[400px] mt-4"
          ></Image>
          <CustomButton
            title={"Click to Continue"}
            btnStyles={"w-full mt-7"}
            handleOnPress={() => router.push("/login")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
