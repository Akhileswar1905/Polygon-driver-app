import axios from "axios";

export const getUser = async (phoneNumber) => {
  const res = await axios.get(
    `https://polygon-project.onrender.com/driver/${phoneNumber}`
  );
  return res.data;
};

export function formatTripsAndEarnings(tripDetails, earnings) {
  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  }

  function initializeMonthData() {
    const months = [];
    for (let i = 0; i < 12; i++) {
      const monthName = getMonthName(i + 1);
      months.push({ label: monthName, value: 0 });
    }
    return months;
  }

  function formatTripDetails(tripDetails) {
    const tripsData = initializeMonthData();

    tripDetails.forEach((trip) => {
      const [day, month, year] = trip.tripDate.split("-");
      const monthIndex = parseInt(month) - 1; // 0-based index for months
      tripsData[monthIndex].value++;
    });

    return tripsData;
  }

  function getTripDateById(tripId) {
    const trip = tripDetails.find((trip) => trip.tripID === tripId);
    return trip ? trip.tripDate : null;
  }

  function formatEarnings(earnings) {
    const earningsData = initializeMonthData();

    earnings.forEach((earning) => {
      const tripDate = getTripDateById(earning.tripId);
      if (tripDate) {
        const [day, month, year] = tripDate.split("-");
        const monthIndex = parseInt(month) - 1; // 0-based index for months
        earningsData[monthIndex].value += earning.amount;
      }
    });

    return earningsData;
  }

  const formattedTrips = formatTripDetails(tripDetails);
  const formattedEarnings = formatEarnings(earnings);

  return { formattedTrips, formattedEarnings };
}
