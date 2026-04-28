import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import criminalRoute from "./routes/data.js";
import newsRoutes from "./routes/news.js";
import cron from "node-cron";
import { fetchDelhiCrimeNews } from "./controllers/news.js";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());


 
 //MIDDLEWARE FOR ROUTES CONNECTION
app.use("/allCriminals",criminalRoute); 
app.use("/api/news",newsRoutes);

app.get("/", (req, res) => {
   res.send("jaldi waha se hato");
})
cron.schedule(
'*/10 * * * *',
()=>{

console.log("Refreshing Delhi live news...");

fetchDelhiCrimeNews();

}
);
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
      success: false,
      status: errorStatus,
      message: errorMessage,
      stack: err.stack,
    });
  });
app.listen(8000, () => {
    console.log("Server is runnig on port 8000!")
})