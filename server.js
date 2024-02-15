import { app } from "./src/app.js";
import dotenv from "dotenv";
import { mongodbConnection } from "./src/db/mongodb.js";

dotenv.config({
  path: "./.env",
});

mongodbConnection();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
