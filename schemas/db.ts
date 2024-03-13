import mongoose from "mongoose";

// Define the connection string using a type for better type safety
interface MongoURI {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

const MONGO_URI: MongoURI = {
  uri: `mongodb://localhost:27017/ssequizes?directConnection=true`,
  useNewUrlParser: false,
  useUnifiedTopology: false,
};

// Connect to MongoDB
mongoose
  .connect(MONGO_URI.uri, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));
