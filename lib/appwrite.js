import { Account, Client, Databases, Storage, ID } from "react-native-appwrite";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.akhileswar1905.driversync",
  projectId: "663bb6bf00125f3bd976",
  databaseId: "663dbf1d000b1f29762b",
  driverCollection: "663dcdbe0000b1d8436e",
  storageId: "663f91f1001643c1a715",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(config.endpoint) // Your Appwrite Endpoint
  .setProject(config.projectId) // Your project ID
  .setPlatform(config.platform); // Your application ID or bundle ID.

const account = new Account(client);
const storage = new Storage(client);
const databases = new Databases(client);
// Upload File
export async function uploadFile(file, type) {
  if (!file) return;

  const { mimeType, ...rest } = file;
  const asset = { type: mimeType, ...rest };

  try {
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    console.log(file.name, fileUrl);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Create Video Post
export async function createDriver(form) {
  // console.log(form);
  try {
    const [VehiclePicsUrl, VehicleVideoUrl, photoUrl] = await Promise.all([
      uploadFile(form.vehiclePhotos, "image"),
      uploadFile(form.vehicleVideo, "video"),
      uploadFile(form.photo, "image"),
    ]);

    // console.log(VehiclePicsUrl, VehicleVideoUrl, photoUrl);

    const newDriver = await databases.createDocument(
      config.databaseId,
      config.driverCollection,
      ID.unique(),
      {
        VehiclePics: VehiclePicsUrl,
        VehicleVideo: VehicleVideoUrl,
        profilePic: photoUrl,
      }
    );

    return newDriver;
  } catch (error) {
    console.log(error.message);
    throw new Error(error);
  }
}
