export function getCompetitionStatus(competition) {
  if (!competition) return "ENDED";

  const now = Date.now();

  const registrationDeadline =
    new Date(competition.registrationDeadline).getTime();

  const submissionStart =
    new Date(competition.submissionStart).getTime();

  const submissionEnd =
    new Date(competition.submissionEnd).getTime();

  if (
    Number.isNaN(registrationDeadline) ||
    Number.isNaN(submissionStart) ||
    Number.isNaN(submissionEnd)
  ) {
    return "ENDED";
  }

  if (now < registrationDeadline) {
    return "REGISTRATION_OPEN";
  }

  if (now < submissionStart) {
    return "REGISTRATION_CLOSED";
  }

  if (now <= submissionEnd) {
    return "LIVE";
  }

  return "ENDED";
}