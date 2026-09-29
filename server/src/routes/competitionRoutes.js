const express = require("express");

const {
  getCompetitions,
  getMyCompetitions,
  getCompetition,
} = require("../controllers/competitionController");

const { participate } = require("../controllers/participationController");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

// GET /api/competitions
router.get("/", getCompetitions);

// GET /api/competitions/my
router.get("/my", requireAuth, getMyCompetitions);

// GET /api/competitions/:id
router.get("/:id", requireAuth, getCompetition);

// POST /api/competitions/:id/participate
router.post("/:id/participate", requireAuth, participate);

module.exports = router;