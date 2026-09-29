const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema(
  {
    position: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const previousWinnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    position: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    video: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const judgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    designation: {
      type: String,
      default: "",
    },

    experience: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    introVideo: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    maxParticipants: {
      type: Number,
      required: true,
      min: 1,
    },

    participantCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationDeadline: {
      type: Date,
      required: true,
    },

    submissionStart: {
      type: Date,
      required: true,
    },

    submissionEnd: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    judge: {
      type: judgeSchema,
      required: true,
    },

    previousWinners: {
      type: [previousWinnerSchema],
      default: [],
    },

    description: {
      type: String,
      required: true,
    },

    judgingParameters: {
      type: [String],
      default: [],
    },

    rules: {
      type: [String],
      default: [],
    },

    rewards: {
      type: [rewardSchema],
      default: [],
    },

    disclaimer: {
      type: String,
      default: "",
    },

    prizeMoneyVideo: {
      type: String,
      default: "",
    },

    referralReward: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Competition", competitionSchema);