import express from "express";

import {
getMostWanted,
getMostWantedStats
}
from "../controllers/mostWanted.js";


const router = express.Router();


router.get("/",getMostWanted);

router.get("/stats",getMostWantedStats);


export default router;