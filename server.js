import { app } from "./src/app.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
