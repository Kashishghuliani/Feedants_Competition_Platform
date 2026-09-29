const mongoose = require("mongoose");

const Submission = require("../models/Submission");
const Competition = require("../models/Competition");
const Participation = require("../models/Participation");
const User = require("../models/User");


// CREATE SUBMISSION
exports.createSubmission = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        code: "REQUIRE_AUTH",
        message: "Please login first.",
      });
    }

    const { competitionId } = req.params;
    const { title, description, submissionUrl } = req.body;

    if (
      !competitionId ||
      !mongoose.Types.ObjectId.isValid(competitionId)
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_COMPETITION",
        message: "Invalid competition.",
      });
    }

    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        code: "TITLE_REQUIRED",
        message: "Submission title is required.",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        code: "DESCRIPTION_REQUIRED",
        message: "Submission description is required.",
      });
    }

    const [user, competition, participation] =
      await Promise.all([
        User.findById(req.userId),
        Competition.findById(competitionId),
        Participation.findOne({
          competitionId,
          userId: req.userId,
        }),
      ]);

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User account not found.",
      });
    }

    if (!competition) {
      return res.status(404).json({
        success: false,
        code: "COMPETITION_NOT_FOUND",
        message: "Competition not found.",
      });
    }

    if (!participation) {
      return res.status(403).json({
        success: false,
        code: "NOT_REGISTERED",
        message: "You must register before submitting.",
      });
    }

    const now = new Date();

    if (
      competition.submissionStart &&
      now < new Date(competition.submissionStart)
    ) {
      return res.status(400).json({
        success: false,
        code: "SUBMISSION_NOT_STARTED",
        message: "Submission has not started yet.",
      });
    }

    if (
      competition.submissionEnd &&
      now > new Date(competition.submissionEnd)
    ) {
      return res.status(400).json({
        success: false,
        code: "SUBMISSION_CLOSED",
        message: "The submission deadline has passed.",
      });
    }

    const existing = await Submission.findOne({
      competition: competitionId,
      user: req.userId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_SUBMITTED",
        message: "You have already submitted your entry.",
        submission: existing,
      });
    }

    const hasFile = Boolean(req.file);
    const hasLink = Boolean(submissionUrl?.trim());

    if (!hasFile && !hasLink) {
      return res.status(400).json({
        success: false,
        code: "SUBMISSION_REQUIRED",
        message: "Please upload a file or provide a submission link.",
      });
    }

    const submission = await Submission.create({
      competition: competitionId,
      user: req.userId,
      title: title.trim(),
      description: description.trim(),
      submissionType: hasFile ? "file" : "link",
      fileUrl: req.file?.path || null,
      fileName: req.file?.originalname || null,
      fileType: req.file?.mimetype || null,
      submissionUrl: hasLink ? submissionUrl.trim() : null,
      status: "submitted",
      submittedAt: now,
    });

    return res.status(201).json({
      success: true,
      message: "Submission submitted successfully.",
      submission,
    });

  } catch (error) {
    console.error("CREATE SUBMISSION ERROR:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_SUBMITTED",
        message: "You have already submitted your entry.",
      });
    }

    return res.status(500).json({
      success: false,
      code: "SUBMISSION_FAILED",
      message: "Unable to submit your entry.",
    });
  }
};


// GET MY SUBMISSION
exports.getMySubmission = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        code: "REQUIRE_AUTH",
        message: "Please login first.",
      });
    }

    const { competitionId } = req.params;

    if (
      !competitionId ||
      !mongoose.Types.ObjectId.isValid(competitionId)
    ) {
      return res.status(400).json({
        success: false,
        code: "INVALID_COMPETITION",
        message: "Invalid competition ID.",
      });
    }

    const submission = await Submission.findOne({
      competition: competitionId,
      user: req.userId,
    })
      .populate(
        "competition",
        "title category type image prizePool submissionStart submissionEnd resultDate"
      )
      .lean();

    return res.status(200).json({
      success: true,
      submission: submission || null,
    });

  } catch (error) {
    console.error("GET MY SUBMISSION ERROR:", error);

    return res.status(500).json({
      success: false,
      code: "GET_SUBMISSION_FAILED",
      message: "Unable to load submission.",
    });
  }
};


// GET ALL MY SUBMISSIONS
exports.getMySubmissions = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        code: "REQUIRE_AUTH",
        message: "Please login first.",
      });
    }

    const user = await User.findById(req.userId).lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User account not found.",
      });
    }

    const submissions = await Submission.find({
      user: req.userId,
    })
      .populate(
        "competition",
        "title category type tags image prizePool entryFee maxParticipants participantCount registrationDeadline submissionStart submissionEnd resultDate"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: submissions.length,
      submissions,
    });

  } catch (error) {
    console.error("GET MY SUBMISSIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      code: "GET_SUBMISSIONS_FAILED",
      message: "Unable to load your submissions.",
    });
  }
};