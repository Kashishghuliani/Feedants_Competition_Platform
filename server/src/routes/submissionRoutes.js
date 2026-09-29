const express = require("express");

const {
  createSubmission,
  getMySubmission,
  getMySubmissions,
} = require("../controllers/submissionController");

const { requireAuth } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// POST /api/competitions/:competitionId/submissions
router.post(
  "/competitions/:competitionId/submissions",
  requireAuth,
  upload.single("file"),
  createSubmission
);

// GET /api/competitions/:competitionId/submissions/my
router.get(
  "/competitions/:competitionId/submissions/my",
  requireAuth,
  getMySubmission
);

// GET /api/submissions/my
// Used by Profile → My Submissions
router.get(
  "/submissions/my",
  requireAuth,
  getMySubmissions
);

module.exports = router;