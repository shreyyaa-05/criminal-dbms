import express from "express";
import { regComplaint , getAllCriminals,getStatuses,getHotspots, getEvidence,getCriminalsByCrime, getCriminalsByFilters,getFeaturedCases, getCriminalsByGender, getCriminalsByLocation, getPrisons, getCriminalsByStatus, getCriminalsByYear, register, login, getComplaint } from "../controllers/data.js"

const router = express.Router();



router.get("/",getAllCriminals)
router.get("/featuredCases", getFeaturedCases)
router.get("/byCrimes",getCriminalsByCrime)
router.get("/prisons",getPrisons)
router.get("/byGender",getCriminalsByGender)
router.get("/byLocation",getCriminalsByLocation)
router.get("/byYear",getCriminalsByYear)
router.get("/byStatus",getCriminalsByStatus)
router.post("/byfilters",getCriminalsByFilters)
router.post("/regcomplaint",regComplaint)
router.post("/register",register)
router.post("/login",login)
router.post("/getcomplaint",getComplaint)
router.get("/hotspots",getHotspots)
router.get("/evidence",getEvidence)
router.get("/statuses",getStatuses)
export default router;