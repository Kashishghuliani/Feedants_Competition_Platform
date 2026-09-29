const Competition = require("../models/Competition");
const Participation = require("../models/Participation");

// =====================================================
// STATES
// =====================================================

function getRegistrationState(c) {
  const now = new Date();
  const deadline = new Date(c.registrationDeadline);
  const count = Number(c.participantCount || 0);
  const max = Number(c.maxParticipants || 0);

  const isOpen =
    !Number.isNaN(deadline.getTime()) && now < deadline;

  const isFull = max > 0 && count >= max;

  return {
    isOpen,
    isFull,
    spotsLeft: Math.max(max - count, 0),
  };
}

function getSubmissionState(c) {
  const now = new Date();
  const start = c.submissionStart
    ? new Date(c.submissionStart)
    : null;
  const end = c.submissionEnd
    ? new Date(c.submissionEnd)
    : null;

  const validStart =
    start && !Number.isNaN(start.getTime());

  const validEnd =
    end && !Number.isNaN(end.getTime());

  const hasStarted = !validStart || now >= start;
  const hasEnded = validEnd && now > end;

  return {
    isOpen: hasStarted && !hasEnded,
    hasStarted,
    hasEnded,
  };
}

// =====================================================
// RESPONSE
// =====================================================

function buildCompetitionResponse(c, registration, submission) {
  return {
    _id: c._id,
    id: c._id,
    title: c.title,
    category: c.category,
    type: c.type,
    tags: c.tags,
    image: c.image,
    prizePool: c.prizePool,
    entryFee: c.entryFee,
    maxParticipants: c.maxParticipants,
    participantCount: c.participantCount,
    spotsLeft: registration.spotsLeft,
    registrationDeadline: c.registrationDeadline,
    submissionStart: c.submissionStart,
    submissionEnd: c.submissionEnd,
    resultDate: c.resultDate,
    judge: c.judge,
    previousWinners: c.previousWinners,
    description: c.description,
    judgingParameters: c.judgingParameters,
    rules: c.rules,
    rewards: c.rewards,
    disclaimer: c.disclaimer,
    prizeMoneyVideo: c.prizeMoneyVideo,
    referralReward: c.referralReward,
    registration,
    submission,
  };
}

// =====================================================
// GET ALL
// =====================================================

async function getCompetitions(req, res) {
  try {
    const competitions = await Competition
      .find({})
      .sort({ createdAt: -1 })
      .lean();

    const data = competitions.map(c => {
      const registration = getRegistrationState(c);
      const submission = getSubmissionState(c);

      return buildCompetitionResponse(
        c,
        registration,
        submission
      );
    });

    res.status(200).json({
      success: true,
      competitions: data,
    });
  } catch (error) {
    console.error("Get competitions error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// =====================================================
// MY COMPETITIONS
// =====================================================

async function getMyCompetitions(req, res) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        code: "REQUIRE_AUTH",
        message: "Authentication required",
      });
    }

    const participations = await Participation
      .find({ userId: req.userId })
      .populate("competitionId")
      .sort({ createdAt: -1 })
      .lean();

    const competitions = participations
      .filter(p => p.competitionId)
      .map(p => {
        const c = p.competitionId;
        const registration = getRegistrationState(c);
        const submission = getSubmissionState(c);

        return {
          ...buildCompetitionResponse(
            c,
            registration,
            submission
          ),
          participationId: p._id,
          registeredAt: p.registeredAt || p.createdAt,
          isRegistered: true,
        };
      });

    res.status(200).json({
      success: true,
      competitions,
    });
  } catch (error) {
    console.error("Get my competitions error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

// =====================================================
// GET SINGLE
// =====================================================

async function getCompetition(req, res) {
  try {
    const { id } = req.params;

    const competition = await Competition
      .findById(id)
      .lean();

    if (!competition) {
      return res.status(404).json({
        success: false,
        code: "COMPETITION_NOT_FOUND",
        message: "Competition not found",
      });
    }

    const registration =
      getRegistrationState(competition);

    const submission =
      getSubmissionState(competition);

    let participation = null;

    if (req.userId) {
      participation = await Participation.findOne({
        competitionId: competition._id,
        userId: req.userId,
      }).lean();
    }

    const isRegistered = Boolean(participation);

    const userParticipation = {
      isRegistered,
      participationId: participation?._id || null,
      registeredAt:
        participation?.registeredAt ||
        participation?.createdAt ||
        null,
      canUploadSubmission:
        isRegistered && submission.isOpen,
    };

    res.status(200).json({
      success: true,
      competition: buildCompetitionResponse(
        competition,
        registration,
        submission
      ),
      registration,
      submission,
      userParticipation,
    });
  } catch (error) {
    console.error("Get competition error:", error);

    res.status(500).json({
      success: false,
      code: "GET_COMPETITION_FAILED",
      message: "Something went wrong",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined,
    });
  }
}

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getCompetitions,
  getMyCompetitions,
  getCompetition,
};