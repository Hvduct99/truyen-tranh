const express = require("express");
const router = express.Router();
const mangaController = require("../controllers/mangaController");

// Get featured/popular manga for homepage
router.get("/featured", mangaController.getFeaturedManga);

// Search manga
router.get("/search", mangaController.searchManga);

// Get popular/trending manga
router.get("/list/popular", mangaController.getPopularManga);

// Get latest manga
router.get("/list/latest", mangaController.getLatestManga);

// Get recommendations by manga ID
router.get("/:id/recommendations", mangaController.getRecommendations);

// Get manga details by ID
router.get("/:id", mangaController.getMangaById);

module.exports = router;
