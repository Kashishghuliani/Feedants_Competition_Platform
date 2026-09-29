# Feedants — Competition Platform

A full-stack React Native implementation of the Feedants Competition Details experience.

The application provides a functional competition flow where users can register for competitions, view dynamic competition information, and submit their entries. Competition data and user participation state are managed through a Node.js/Express backend and MongoDB.

---

## Tech Stack

### Mobile

* React Native
* Expo
* React Navigation
* NativeWind
* AsyncStorage

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Cloudinary

---

## Features

### Competition

* Competition listing
* Dynamic competition details
* Dynamic competition lifecycle
* Registration availability
* Participant capacity validation
* Remaining participation spots
* Registration countdown
* Competition dates
* Judge information
* Previous winners
* Rewards and prize information
* Competition rules and judging information
* Prize information
* Referral information
* Hear From Users

### User

* User registration and login
* JWT-based authentication
* View Profile
* Edit Profile
* My Competitions
* My Submissions
* User-specific participation state

### Submission

* Submission upload
* Submission link support
* Cloudinary file upload
* Submission validation
* Duplicate submission protection

### General

* Pull-to-refresh
* Loading states
* Error handling
* Server-side validation
* Responsive React Native UI

---

## User Flow

1. User creates an account or logs in.
2. User browses available competitions.
3. User opens a competition details page.
4. Competition information is loaded dynamically from the backend.
5. User can participate if registration is open and capacity is available.
6. Server validates the registration.
7. Once registered, the user can upload a submission when the submission period is active.
8. The user can upload a file or provide a submission link.
9. Submission details are stored in MongoDB.
10. From the Profile section, users can:

    * View their profile.
    * Edit their profile.
    * View registered competitions.
    * View submitted entries.

---

## Competition Lifecycle

The application separates **registration availability** from **submission availability**.

### Registration

Registration is allowed when:

* The user is authenticated.
* Registration deadline has not passed.
* Competition capacity has not been reached.
* The user has not already registered.

### Submission

A registered participant can submit an entry when:

* The user is authenticated.
* The user is registered for the competition.
* The submission period has started.
* The submission deadline has not passed.
* The user has not already submitted an entry.

This allows a competition to become full for new registrations while already-registered participants can still upload their submissions until the submission deadline.

---

## Project Structure

```text
feedants/
│
├── mobile/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── navigation/
│   │   ├── screens/
│   │   ├── services/
│   │   └── utils/
│   └── ...
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── services/
│   │   └── utils/
│   └── ...
│
└── README.md
```

---

## Database Design

MongoDB is used for persistent application data.

### User

Stores user account and profile information.

### Competition

Stores:

* Competition title
* Category
* Type
* Description
* Prize information
* Participant limits
* Participant count
* Registration deadline
* Submission start
* Submission end
* Result date
* Judge information
* Rules
* Rewards
* Previous winners

### Participation

Stores the relationship between a user and a competition.

Important fields include:

* `competitionId`
* `userId`
* `registeredAt`
* `submission`
* `submissionUploadedAt`

A compound unique index on `competitionId + userId` prevents duplicate participation.

### Submission

Stores:

* Competition
* User
* Title
* Description
* Submission type
* Uploaded file information
* Submission URL
* Submission status
* Submission timestamp

A compound unique index on `competition + user` prevents duplicate submissions.

---

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
```

### Competitions

```text
GET  /api/competitions
GET  /api/competitions/:id
GET  /api/competitions/my
POST /api/competitions/:id/participate
```

### Submissions

```text
GET  /api/submissions/my
GET  /api/competitions/:competitionId/submission/my
POST /api/competitions/:competitionId/submissions
```

---

## Profile and User Features

The application includes a dedicated Profile section for authenticated users.

Users can:

* View their profile information.
* Edit their profile.
* View their registered competitions through **My Competitions**.
* View their submitted entries through **My Submissions**.
* Open competition details from their registered competitions.
* Access their competition-related information from one place.

All user-specific competition and submission information is retrieved through authenticated API requests.

---

## Hear From Users

The Competition Details screen includes a **Hear From Users / Reviews** section as part of the provided Feedants design.

This section is presented as part of the competition experience and follows the visual structure of the provided design.

The current implementation does not claim a complete user-generated review backend unless review creation and persistence are explicitly implemented.

---

## Important Assumptions

* A user can participate in a competition only once.
* A user must be registered before submitting an entry.
* Registration and submission periods are independent.
* A competition can become full before its submission deadline.
* Registered participants can still submit while the submission window remains open.
* Each participant can submit only one entry.
* A submission can contain either an uploaded file or an external link.
* Competition state is calculated using server-side dates rather than hardcoded frontend state.
* MongoDB is the source of competition and user-related application data.

---

## Major Technical Decisions

### Backend-Driven Competition State

Competition dates, participant counts, capacity, and registration/submission state are provided by the backend.

This prevents the mobile application from relying on hardcoded competition information.

### Separate Participation and Submission Models

Registration and submission represent different business concepts, so they are stored separately.

This allows registered users to submit after registration has closed, as long as the submission deadline has not passed.

### Server-Side Validation

Important business rules are validated on the backend, including:

* Authentication
* Competition existence
* Registration eligibility
* Competition capacity
* Duplicate participation
* Submission period
* Registration requirement
* Duplicate submission

Frontend validation is primarily used for user experience, while the backend remains the source of truth.

### Reusable React Native Components

The Competition Details screen is divided into reusable components for sections such as:

* Header
* Competition summary
* Judge information
* Countdown
* Important dates
* Previous winners
* Rules and judging
* Rewards
* Prize information
* Referral section
* Hear From Users / Reviews
* Advertisement
* Bottom navigation

---

## Trade-offs

The implementation prioritizes a clear and maintainable architecture suitable for the assignment while keeping the codebase relatively simple.

For example:

* MongoDB was selected because competition, participation, and submission data can be represented naturally using documents and references.
* Cloudinary is used for file storage instead of storing uploaded files directly in MongoDB.
* JWT and AsyncStorage are used for authentication state.
* Competition state is based on backend-provided dates.
* Business rules remain enforced on the server even when corresponding states are displayed on the mobile application.

---

## Production Improvements

For a larger production deployment, I would further improve:

* Atomic participant-capacity updates to prevent race conditions during simultaneous registrations.
* Database transactions where multiple related records must be updated together.
* Rate limiting and additional API security.
* Stronger file validation and upload restrictions.
* Pagination for competitions and submissions.
* Centralized logging and monitoring.
* Automated tests for controllers, services, and business rules.
* CI/CD pipelines.
* Production environment configuration and secrets management.
* More robust upload retry/error handling.
* Background processing for larger file uploads and notifications.
* A persistent review system if user-generated reviews are required.

---

## Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

CLOUDINARY_API_KEY=your_cloudinary_api_key

CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Do not commit real credentials or `.env` files to GitHub.

---

## Mobile API Configuration

Update the mobile API URL according to your development environment:

```javascript
const API_URL = "http://YOUR_LOCAL_IP:5000/api";
```

When testing on a physical device, the device and development computer should normally be connected to the same Wi-Fi network.

For production, the API URL should point to the deployed backend.

---

## Running the Backend

```bash
cd server
npm install
npm start
```

The backend runs on the configured port, for example:

```text
http://localhost:5000
```

---

## Running the Mobile Application

```bash
cd mobile
npm install
npx expo start
```

The application can then be opened using Expo Go or an available emulator.

---

## Optional Demo Data

The application reads competition information dynamically from MongoDB through the backend APIs.

An optional seed script can be used to populate the development database with initial competition data for testing.

```bash
cd server
node seed/seedCompetition.js
```

The seed script is only used to create initial/demo database records. It is not used by the mobile application at runtime.

---

## Validation and Error Handling

The application handles cases including:

* Missing authentication
* Invalid credentials
* Invalid competition
* Duplicate registration
* Full competition
* Closed registration
* Submission period not started
* Submission deadline passed
* User not registered
* Duplicate submission
* Missing submission file/link
* Network errors
* File upload errors

---

## Assignment Notes

This implementation focuses on making the provided Competition Details design functional rather than treating it as a static UI.

Competition information, registration state, participant limits, submission periods, and user participation are retrieved from the backend/database.

The frontend is responsible for presenting the appropriate state to the user, while the backend validates business rules and persists application data.

The application also includes authenticated user features such as **Profile, Edit Profile, My Competitions, and My Submissions** to provide a complete user flow around the competition experience.

---

## Author

**Kashish Ghuliani**
