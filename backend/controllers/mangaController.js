const mangaService = require("../services/mangaService");

const getFeaturedManga = async (req, res) => {
  try {
    const data = await mangaService.getFeaturedManga();
    res.json(data);
  } catch (error) {
    console.error("getFeaturedManga error:", error.message);
    res.status(500).json({ error: "Failed to fetch featured manga" });
  }
};

const searchManga = async (req, res) => {
  try {
    const { q, limit = 20, page = 1 } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }
    const data = await mangaService.searchManga(q, Number(limit), Number(page));
    res.json(data);
  } catch (error) {
    console.error("searchManga error:", error.message);
    res.status(500).json({ error: "Failed to search manga" });
  }
};

const getMangaById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await mangaService.getMangaById(id);
    res.json(data);
  } catch (error) {
    console.error("getMangaById error:", error.message);
    res.status(500).json({ error: "Failed to fetch manga details" });
  }
};

const getPopularManga = async (req, res) => {
  try {
    const { limit = 24, page = 1 } = req.query;
    const data = await mangaService.getPopularManga(Number(limit), Number(page));
    res.json(data);
  } catch (error) {
    console.error("getPopularManga error:", error.message);
    res.status(500).json({ error: "Failed to fetch popular manga" });
  }
};

const getLatestManga = async (req, res) => {
  try {
    const { limit = 24, page = 1 } = req.query;
    const data = await mangaService.getLatestManga(Number(limit), Number(page));
    res.json(data);
  } catch (error) {
    console.error("getLatestManga error:", error.message);
    res.status(500).json({ error: "Failed to fetch latest manga" });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await mangaService.getMangaRecommendations(id);
    res.json(data);
  } catch (error) {
    console.error("getRecommendations error:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
};

module.exports = {
  getFeaturedManga,
  searchManga,
  getMangaById,
  getPopularManga,
  getLatestManga,
  getRecommendations,
};
