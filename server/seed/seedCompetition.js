const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const Competition = require("../src/models/Competition");

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const competition = {
  title: "Feedants Classical Dance",
  category: "Dance",
  type: "Multi-Win",

  tags: ["Dance", "Multi-Win", "Winners get certificate"],

  prizePool: 1500,
  entryFee: 99,
  maxParticipants: 3,
  participantCount: 2,

  registrationDeadline: new Date("2026-10-15T23:50:00+05:30"),
  submissionStart: new Date("2026-09-28T04:00:00+05:30"),
  submissionEnd: new Date("2026-10-30T23:55:00+05:30"),
  resultDate: new Date("2026-11-01T23:50:00+05:30"),

  image:
    "https://i.pinimg.com/736x/9e/85/2b/9e852bce5e8c2332e1fbef707c947e3f.jpg",

  judge: {
    name: "Manju Dubey",
    designation: "Professional Kathak Dancer",
    experience: "12+ Years of Experience",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    introVideo: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },

  previousWinners: [
    {
      name: "Riya Shah",
      position: "1st Winner",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    },
    {
      name: "Aarav Mehta",
      position: "1st Winner",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    },
    {
      name: "Neha Verma",
      position: "2nd Winner",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9",
    },
    {
      name: "Ishita Chopra",
      position: "3rd Winner",
      image:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
    },
  ],

  description:
    "This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.",

  judgingParameters: [
    "Expression",
    "Technique",
    "Presentation",
    "Creativity",
    "Stage Presence",
  ],

  rules: [
    "The competition is open to all age groups.",
    "Participants must submit their own performance.",
    "The submitted video must follow the competition guidelines.",
    "Only registered participants can submit an entry.",
    "Entries submitted after the deadline will not be considered.",
    "The judges' decision will be final.",
  ],

  rewards: [
    { position: 1, title: "1st Winner", amount: 550 },
    { position: 2, title: "2nd Winner", amount: 300 },
    { position: 3, title: "3rd Winner", amount: 240 },
    { position: 4, title: "4th Winner", amount: 200 },
    { position: 5, title: "5th Winner", amount: 130 },
    { position: 6, title: "6th Winner", amount: 80 },
  ],

  disclaimer:
    "Only contributions from paid participants will be considered for judging.",

  prizeMoneyVideo:
    "https://www.youtube.com/watch?v=dQw4w9WgXcQ",

  referralReward: 10,
};

async function seed() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");

    await Competition.deleteMany({});
    const created = await Competition.create(competition);

    console.log("Competition created.");
    console.log("ID:", created._id.toString());
    console.log("Title:", created.title);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);

    try {
      await mongoose.connection.close();
    } catch {}

    process.exit(1);
  }
}

seed();