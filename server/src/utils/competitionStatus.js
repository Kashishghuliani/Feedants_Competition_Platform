// =====================================================
// GET COMPETITION STATUS
// =====================================================
//
// Possible statuses:
//
// REGISTRATION_OPEN
// REGISTRATION_CLOSED
// SUBMISSION_OPEN
// SUBMISSION_CLOSED
// COMPLETED
//
// =====================================================

function getCompetitionStatus(competition) {
  const now = new Date();

  // ---------------------------------------------------
  // IMPORTANT DATES
  // ---------------------------------------------------

  const registrationDeadline =
    competition.registrationDeadline
      ? new Date(
          competition.registrationDeadline
        )
      : null;

  const submissionStart =
    competition.submissionStart
      ? new Date(
          competition.submissionStart
        )
      : null;

  const submissionEnd =
    competition.submissionEnd
      ? new Date(
          competition.submissionEnd
        )
      : null;

  const resultDate =
    competition.resultDate
      ? new Date(
          competition.resultDate
        )
      : null;


  // ---------------------------------------------------
  // VALID DATE CHECK
  // ---------------------------------------------------

  const hasRegistrationDeadline =
    registrationDeadline &&
    !Number.isNaN(
      registrationDeadline.getTime()
    );

  const hasSubmissionStart =
    submissionStart &&
    !Number.isNaN(
      submissionStart.getTime()
    );

  const hasSubmissionEnd =
    submissionEnd &&
    !Number.isNaN(
      submissionEnd.getTime()
    );

  const hasResultDate =
    resultDate &&
    !Number.isNaN(
      resultDate.getTime()
    );


  // ---------------------------------------------------
  // COMPLETED
  // ---------------------------------------------------
  //
  // Once the result date has passed, the competition
  // is considered completed.
  //
  // ---------------------------------------------------

  if (
    hasResultDate &&
    now >= resultDate
  ) {
    return "COMPLETED";
  }


  // ---------------------------------------------------
  // SUBMISSION CLOSED
  // ---------------------------------------------------
  //
  // Submission period has ended but results have not
  // been announced yet.
  //
  // ---------------------------------------------------

  if (
    hasSubmissionEnd &&
    now > submissionEnd
  ) {
    return "SUBMISSION_CLOSED";
  }


  // ---------------------------------------------------
  // SUBMISSION OPEN
  // ---------------------------------------------------
  //
  // Participants can submit their entries.
  //
  // ---------------------------------------------------

  if (
    hasSubmissionStart &&
    now >= submissionStart &&
    (
      !hasSubmissionEnd ||
      now <= submissionEnd
    )
  ) {
    return "SUBMISSION_OPEN";
  }


  // ---------------------------------------------------
  // REGISTRATION CLOSED
  // ---------------------------------------------------
  //
  // Registration deadline has passed, but submission
  // has not started yet.
  //
  // ---------------------------------------------------

  if (
    hasRegistrationDeadline &&
    now >= registrationDeadline
  ) {
    return "REGISTRATION_CLOSED";
  }


  // ---------------------------------------------------
  // REGISTRATION OPEN
  // ---------------------------------------------------
  //
  // Competition is currently accepting registrations.
  //
  // ---------------------------------------------------

  return "REGISTRATION_OPEN";
}


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getCompetitionStatus,
};