const mongoose = require("mongoose");

const Competition = require("../models/Competition");
const Participation = require("../models/Participation");

async function participateInCompetition({
  competitionId,
  userId,
}) {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // Check existing registration
      const existing = await Participation.findOne({
        competitionId,
        userId,
      }).session(session);

      if (existing) {
        const error = new Error("Already registered");
        error.statusCode = 409;
        error.code = "ALREADY_REGISTERED";
        throw error;
      }

      const now = new Date();

      // Atomically reserve a spot
      const competition =
        await Competition.findOneAndUpdate(
          {
            _id: competitionId,
            registrationDeadline: { $gt: now },
            $expr: {
              $lt: [
                "$participantCount",
                "$maxParticipants",
              ],
            },
          },
          { $inc: { participantCount: 1 } },
          { new: true, session }
        );

      if (!competition) {
        const existingCompetition =
          await Competition.findById(
            competitionId
          ).session(session);

        if (!existingCompetition) {
          const error = new Error(
            "Competition not found"
          );
          error.statusCode = 404;
          error.code = "COMPETITION_NOT_FOUND";
          throw error;
        }

        if (
          now >=
          new Date(
            existingCompetition.registrationDeadline
          )
        ) {
          const error = new Error(
            "Registration has closed"
          );
          error.statusCode = 400;
          error.code = "REGISTRATION_CLOSED";
          throw error;
        }

        if (
          existingCompetition.participantCount >=
          existingCompetition.maxParticipants
        ) {
          const error = new Error(
            "Competition is full"
          );
          error.statusCode = 409;
          error.code = "COMPETITION_FULL";
          throw error;
        }

        const error = new Error(
          "Unable to register for competition"
        );
        error.statusCode = 409;
        error.code = "REGISTRATION_FAILED";
        throw error;
      }

      // Create registration in same transaction
      const participation =
        await Participation.create(
          [
            {
              competitionId: competition._id,
              userId,
              registeredAt: now,
            },
          ],
          { session }
        );

      result = {
        competition,
        participation: participation[0],
      };
    });

    return result;
  } finally {
    await session.endSession();
  }
}

module.exports = {
  participateInCompetition,
};