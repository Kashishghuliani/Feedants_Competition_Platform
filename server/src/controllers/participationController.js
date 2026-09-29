const {
  participateInCompetition,
} = require("../services/participationService");

async function participate(req, res) {
  try {
    const result = await participateInCompetition({
      competitionId: req.params.id,
      userId: req.userId,
    });

    const { participation, competition } = result;

    return res.status(201).json({
      success: true,
      message: "Successfully registered for the competition",

      participation: {
        id: participation._id,
        registeredAt: participation.registeredAt,
      },

      competition: {
        id: competition._id,
        participantCount: competition.participantCount,
        maxParticipants: competition.maxParticipants,
        spotsLeft: Math.max(
          competition.maxParticipants -
            competition.participantCount,
          0
        ),
      },

      userParticipation: {
        isRegistered: true,
      },
    });
  } catch (error) {
    console.error("Participation error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      code: error.code || "INTERNAL_SERVER_ERROR",
      message: error.message || "Something went wrong",
    });
  }
}

module.exports = { participate };