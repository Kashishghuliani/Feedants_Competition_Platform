// =====================================================
// LOAD ENVIRONMENT VARIABLES FIRST
// =====================================================

const dotenv = require("dotenv");

dotenv.config();


// =====================================================
// IMPORTS
// =====================================================

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes =
  require("./src/routes/authRoutes");

const competitionRoutes =
  require("./src/routes/competitionRoutes");

const submissionRoutes =
  require("./src/routes/submissionRoutes");


// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Feedants API is running",
  });
});


// =====================================================
// ROUTES
// =====================================================

// ---------------------------------------------
// AUTH
// ---------------------------------------------

app.use(
  "/api/auth",
  authRoutes
);


// ---------------------------------------------
// COMPETITIONS
// ---------------------------------------------

app.use(
  "/api/competitions",
  competitionRoutes
);


// ---------------------------------------------
// SUBMISSIONS
// ---------------------------------------------
//
// submissionRoutes contains:
//
// POST
// /api/competitions/:competitionId/submissions
//
// GET
// /api/competitions/:competitionId/submissions/my
//
// GET
// /api/submissions/my
//
// ---------------------------------------------

app.use(
  "/api",
  submissionRoutes
);


// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    code: "ROUTE_NOT_FOUND",
    message:
      `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    "GLOBAL ERROR:",
    error
  );

  // ---------------------------------------------
  // MULTER ERROR
  // ---------------------------------------------

  if (
    error &&
    error.name === "MulterError"
  ) {
    return res.status(400).json({
      success: false,
      code: "FILE_UPLOAD_ERROR",
      message:
        error.message ||
        "File upload failed.",
    });
  }


  // ---------------------------------------------
  // FILE TYPE ERROR
  // ---------------------------------------------

  if (
    error &&
    error.message &&
    error.message.startsWith(
      "File type not supported:"
    )
  ) {
    return res.status(400).json({
      success: false,
      code: "UNSUPPORTED_FILE_TYPE",
      message: error.message,
    });
  }


  // ---------------------------------------------
  // DEFAULT ERROR
  // ---------------------------------------------

  return res.status(500).json({
    success: false,
    code: "INTERNAL_SERVER_ERROR",
    message:
      "Something went wrong.",
    error:
      process.env.NODE_ENV ===
      "development"
        ? error.message
        : undefined,
  });
});


// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;


// =====================================================
// REQUIRED ENVIRONMENT VARIABLES
// =====================================================

function validateEnvironment() {

  const requiredVariables = [
    "MONGO_URI",
    "JWT_SECRET",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];


  const missingVariables =
    requiredVariables.filter(
      (variable) =>
        !process.env[variable]
    );


  if (
    missingVariables.length > 0
  ) {
    throw new Error(
      `Missing environment variables: ${missingVariables.join(
        ", "
      )}`
    );
  }
}


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

  try {

    // ---------------------------------------------
    // CHECK REQUIRED ENV VARIABLES
    // ---------------------------------------------

    validateEnvironment();

    console.log(
      "Environment variables loaded successfully."
    );


    // ---------------------------------------------
    // MONGODB
    // ---------------------------------------------

    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log(
      "MongoDB connected successfully."
    );


    // ---------------------------------------------
    // CLOUDINARY ENV CHECK
    // ---------------------------------------------

    console.log(
      "Cloudinary configuration loaded:",
      {
        cloudName:
          process.env.CLOUDINARY_CLOUD_NAME,

        apiKeyLoaded:
          Boolean(
            process.env.CLOUDINARY_API_KEY
          ),

        apiSecretLoaded:
          Boolean(
            process.env.CLOUDINARY_API_SECRET
          ),
      }
    );


    // ---------------------------------------------
    // START EXPRESS
    // ---------------------------------------------

    const server =
      app.listen(
        PORT,
        "0.0.0.0",
        () => {

          console.log(
            "========================================"
          );

          console.log(
            "Feedants API Server Started"
          );

          console.log(
            `Port: ${PORT}`
          );

          console.log(
            `Local: http://localhost:${PORT}`
          );

          console.log(
            `Network: http://0.0.0.0:${PORT}`
          );

          console.log(
            `Health: http://localhost:${PORT}/`
          );

          console.log(
            "========================================"
          );
        }
      );


    // ---------------------------------------------
    // GRACEFUL SHUTDOWN
    // ---------------------------------------------

    const shutdown = async (
      signal
    ) => {

      console.log(
        `${signal} received. Shutting down server...`
      );


      server.close(
        async () => {

          try {

            await mongoose.connection.close();

            console.log(
              "MongoDB connection closed."
            );

            console.log(
              "Server shutdown complete."
            );

            process.exit(0);

          } catch (error) {

            console.error(
              "Error during shutdown:",
              error
            );

            process.exit(1);
          }
        }
      );
    };


    process.once(
      "SIGINT",
      () => shutdown("SIGINT")
    );

    process.once(
      "SIGTERM",
      () => shutdown("SIGTERM")
    );


  } catch (error) {

    console.error(
      "========================================"
    );

    console.error(
      "SERVER STARTUP FAILED"
    );

    console.error(
      error.message
    );

    console.error(
      "========================================"
    );


    // ---------------------------------------------
    // CLOSE MONGODB IF CONNECTED
    // ---------------------------------------------

    try {

      if (
        mongoose.connection.readyState !==
        0
      ) {
        await mongoose.connection.close();
      }

    } catch (closeError) {

      console.error(
        "MongoDB close error:",
        closeError.message
      );
    }


    process.exit(1);
  }
}


// =====================================================
// RUN SERVER
// =====================================================

startServer();