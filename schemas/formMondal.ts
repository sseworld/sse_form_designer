import { Schema, model, connect } from "mongoose";

// Define the connection string using a type for better type safety
interface MongoURI {
  uri: string;
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

const MONGO_URI: MongoURI = {
  uri: `mongodb+srv://sseworld:sseworld12@ssetesting.meltyqx.mongodb.net/?retryWrites=true&w=majority`,
  useNewUrlParser: false,
  useUnifiedTopology: false,
};

// Connect to MongoDB
connect(MONGO_URI.uri, {})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Interface for better type safety and validation
interface Form {
  _id?: Schema.Types.ObjectId; // Optional for new document
  id: string;
  userId: string;
  createdAt: Date;
  published: boolean;
  name: string;
  description: string;
  content: string[];
  visits: number;
  submissions: number;
  shareURL: string;
  formSubmissions: FormSubmission[];
}

interface FormSubmission {
  _id?: Schema.Types.ObjectId; // Optional for new document
  id: string;
  createdAt: Date;
  formId: string;
  form: Form; // Reference to the parent Form document
  content: string;
}

// Define the Form schema
const formSchema = new Schema<Form>({
  id: { type: String, required: true, unique: true },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  published: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: [String],
    default: [],
  },
  visits: {
    type: Number,
    default: 0,
  },
  submissions: {
    type: Number,
    default: 0,
  },
  shareURL: {
    type: String,
    required: true,
    unique: true,
    // default: () => uuid();
  },
  formSubmissions: [{ type: Schema.Types.ObjectId, ref: "FormSubmission" }],
});

// Define a unique index on name and userId for faster lookups
formSchema.index({ name: 1, userId: 1 }, { unique: true });

// Define the FormSubmission schema (embedded in Form)
const formSubmissionSchema = new Schema<FormSubmission>({
  createdAt: { type: Date, default: Date.now },
  formId: { type: String, required: true },
  form: { type: Schema.Types.ObjectId, ref: "Form" }, // Reference to the parent Form
  content: { type: String, required: true },
});

export const Form = model<Form>("Form", formSchema);
export const FormSubmission = model<FormSubmission>("Form", formSubmissionSchema);
