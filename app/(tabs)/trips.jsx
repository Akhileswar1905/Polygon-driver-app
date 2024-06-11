import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  RefreshControl,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons, images } from "../../constants";
import CustomButton from "../../components/CustomButton";
import { router } from "expo-router";
import { useGlobalContext } from "../../context/GlobalContext";
import axios from "axios";
import TripCard from "../../components/TripCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Trips = () => {
  const { user } = useGlobalContext();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [company, setCompany] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [show, setShow] = useState(false);
  const [modalOpacity] = useState(new Animated.Value(0)); // For fade animation
  // const [data, setDate] = useState([]);
  const fetchDetails = async () => {
    try {
      const phoneNumber = await AsyncStorage.getItem("phoneNumber");
      if (phoneNumber) {
        const res = await axios.get(
          `https://polygon-project.onrender.com/driver/${phoneNumber}`
        );
        setTrips(res.data.tripDetails || []);
        setFilteredTrips(res.data.tripDetails || []);
        setCompany(
          res.data.contractDetails[res.data.contractDetails?.length - 1]
            .companyName
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const onFilter = () => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const filtrips = trips.filter((trip) => {
      const date = new Date(trip.tripDate);
      return date >= startDate && date <= endDate;
    });
    setFilteredTrips(filtrips);
    setStart(null);
    setEnd(null);
    setShow(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setStart("");
    setEnd("");
    setRefreshing(false);
  };

  const toggleModal = () => {
    setShow(!show);
    Animated.timing(modalOpacity, {
      toValue: show ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView className="h-full">
      {trips.length === 0 ? (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
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
        </ScrollView>
      ) : (
        <>
          <View className="flex flex-row justify-between items-center p-3">
            <Text className="text-2xl font-psemibold text-center">Trips</Text>
            <TouchableOpacity onPress={toggleModal}>
              {/* <Text style={styles.filterButton}>Filter</Text> */}
              <Image
                source={icons.filter}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
            <Modal
              animationType="fade"
              transparent
              visible={show}
              onRequestClose={toggleModal}
            >
              <Animated.View
                style={[styles.modalContainer, { opacity: modalOpacity }]}
              >
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Trips</Text>
                  <Text style={styles.filterText}>Filter Trips by Date</Text>
                  <View style={styles.dateInputContainer}>
                    <TextInput
                      style={styles.dateInput}
                      placeholder="From"
                      onChangeText={(text) => setStart(text)}
                      value={start}
                    />
                    <TextInput
                      style={styles.dateInput}
                      placeholder="To"
                      onChangeText={(text) => setEnd(text)}
                      value={end}
                    />
                  </View>
                  <CustomButton
                    title={"Filter"}
                    btnStyles={styles.filterButtonStyle}
                    handleOnPress={onFilter}
                  />
                </View>
              </Animated.View>
            </Modal>
          </View>

          <FlatList
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            data={filteredTrips}
            keyExtractor={(trip) => trip.tripID || trip.tripId} // Adjust based on your data
            renderItem={({ item }) => (
              <TripCard otherStyles={"mt-5"} trip={item} />
            )}
          />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
    margin: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  filterText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  dateInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  filterButtonStyle: {
    width: "40%",
    alignSelf: "center",
  },
});

export default Trips;
