import AsyncStorage from "@react-native-async-storage/async-storage";

// =====================================================
// API URL
// =====================================================

const API_URL =
  "http://192.168.31.151:5000/api";


// =====================================================
// COMMON JSON REQUEST
// =====================================================

async function request(
  endpoint,
  options = {}
) {
  const token =
    await AsyncStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }

  const url =
    `${API_URL}${endpoint}`;

  console.log("================================");
  console.log("API REQUEST:", url);
  console.log(
    "METHOD:",
    options.method || "GET"
  );
  console.log(
    "TOKEN:",
    token ? "FOUND" : "NOT FOUND"
  );
  console.log("================================");

  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 15000);

  try {
    const response =
      await fetch(
        url,
        {
          ...options,
          headers,
          signal:
            controller.signal,
        }
      );

    console.log(
      "API STATUS:",
      response.status
    );

    let data;

    try {
      data =
        await response.json();

      console.log(
        "API RESPONSE:",
        data
      );
    } catch (jsonError) {
      console.log(
        "API JSON ERROR:",
        jsonError
      );

      data = {
        success: false,
        message:
          "Invalid server response.",
      };
    }

    if (!response.ok) {
      const error =
        new Error(
          data?.message ||
            "Request failed."
        );

      error.status =
        response.status;

      error.code =
        data?.code;

      error.data =
        data;

      throw error;
    }

    return data;

  } catch (error) {

    if (
      error?.name ===
      "AbortError"
    ) {
      throw new Error(
        "Server connection timed out. Make sure the backend is running and your phone is connected to the same Wi-Fi network."
      );
    }

    console.log(
      "API ERROR:",
      error
    );

    if (
      error?.message ===
        "Network request failed" ||
      error?.message ===
        "fetch failed"
    ) {
      throw new Error(
        "Unable to connect to the server. Check the backend IP address, backend server, and Wi-Fi connection."
      );
    }

    throw error;

  } finally {

    clearTimeout(timeout);

  }
}


// =====================================================
// AUTH
// =====================================================

export async function registerUser(
  name,
  email,
  password
) {
  return request(
    "/auth/register",
    {
      method: "POST",

      body:
        JSON.stringify({
          name,
          email,
          password,
        }),
    }
  );
}


export async function loginUser(
  email,
  password
) {
  return request(
    "/auth/login",
    {
      method: "POST",

      body:
        JSON.stringify({
          email,
          password,
        }),
    }
  );
}


export async function getCurrentUser() {

  return request(
    "/auth/me"
  );

}


export async function updateProfile({
  name,
  email,
}) {

  if (!name?.trim()) {
    throw new Error(
      "Name is required."
    );
  }

  if (!email?.trim()) {
    throw new Error(
      "Email is required."
    );
  }

  return request(
    "/auth/profile",
    {
      method: "PUT",

      body:
        JSON.stringify({
          name:
            name.trim(),

          email:
            email.trim(),
        }),
    }
  );

}


// =====================================================
// COMPETITIONS
// =====================================================

export async function getCompetitions() {

  return request(
    "/competitions"
  );

}


export async function getMyCompetitions() {

  return request(
    "/competitions/my"
  );

}


export async function getCompetition(
  competitionId
) {

  if (!competitionId) {

    throw new Error(
      "Competition ID is missing."
    );

  }

  return request(
    `/competitions/${competitionId}`
  );

}


export async function participate(
  competitionId
) {

  if (!competitionId) {

    throw new Error(
      "Competition ID is missing."
    );

  }

  return request(
    `/competitions/${competitionId}/participate`,
    {
      method: "POST",
    }
  );

}


// =====================================================
// SUBMISSIONS
// =====================================================

// Get all submissions created by the logged-in user.

export async function getMySubmissions() {

  console.log(
    "================================"
  );

  console.log(
    "LOADING MY SUBMISSIONS..."
  );

  console.log(
    "ENDPOINT:",
    "/submissions/my"
  );

  console.log(
    "================================"
  );

  return request(
    "/submissions/my"
  );

}


// Get the logged-in user's submission
// for one particular competition.

export async function getMySubmission(
  competitionId
) {

  if (!competitionId) {

    throw new Error(
      "Competition ID is missing."
    );

  }

  return request(
    `/competitions/${competitionId}/submissions/my`
  );

}


// =====================================================
// SUBMIT COMPETITION
// =====================================================

export async function submitCompetition(
  competitionId,
  {
    title,
    description,
    submissionUrl,
    file,
  } = {}
) {

  // ===================================================
  // TOKEN
  // ===================================================

  const token =
    await AsyncStorage.getItem("token");

  if (!token) {

    throw new Error(
      "Login token is missing. Please login again."
    );

  }


  // ===================================================
  // VALIDATION
  // ===================================================

  if (!competitionId) {

    throw new Error(
      "Competition ID is missing."
    );

  }

  if (!title?.trim()) {

    throw new Error(
      "Submission title is required."
    );

  }

  if (!description?.trim()) {

    throw new Error(
      "Submission description is required."
    );

  }

  if (
    !file &&
    !submissionUrl?.trim()
  ) {

    throw new Error(
      "Please upload a file or provide a submission link."
    );

  }


  // ===================================================
  // URL
  // ===================================================

  const url =
    `${API_URL}/competitions/${competitionId}/submissions`;


  console.log(
    "================================"
  );

  console.log(
    "SUBMISSION REQUEST:",
    url
  );

  console.log(
    "TOKEN:",
    token ? "FOUND" : "NOT FOUND"
  );

  console.log(
    "HAS FILE:",
    Boolean(file)
  );

  console.log(
    "HAS LINK:",
    Boolean(
      submissionUrl?.trim()
    )
  );

  console.log(
    "================================"
  );


  // ===================================================
  // FORM DATA
  // ===================================================

  const formData =
    new FormData();


  formData.append(
    "title",
    title.trim()
  );


  formData.append(
    "description",
    description.trim()
  );


  // ===================================================
  // SUBMISSION LINK
  // ===================================================

  if (
    submissionUrl &&
    submissionUrl.trim()
  ) {

    formData.append(
      "submissionUrl",
      submissionUrl.trim()
    );

  }


  // ===================================================
  // FILE
  // ===================================================

  if (file) {

    if (!file.uri) {

      throw new Error(
        "Selected file URI is missing."
      );

    }


    const fileName =
      file.name ||
      file.fileName ||
      "submission";


    const fileType =
      file.mimeType ||
      file.type ||
      "application/octet-stream";


    console.log(
      "SUBMISSION FILE:",
      {
        name:
          fileName,

        type:
          fileType,

        uri:
          file.uri,
      }
    );


    // -------------------------------------------------
    // READ LOCAL FILE
    // -------------------------------------------------

    let blob;

    try {

      const fileResponse =
        await fetch(file.uri);


      if (!fileResponse.ok) {

        throw new Error(
          "Unable to read selected file."
        );

      }


      blob =
        await fileResponse.blob();


      console.log(
        "FILE BLOB CREATED:",
        {
          size:
            blob.size,

          type:
            blob.type,
        }
      );

    } catch (error) {

      console.log(
        "FILE READ ERROR:",
        error
      );

      throw new Error(
        "Unable to read the selected file. Please select the file again."
      );

    }


    // -------------------------------------------------
    // APPEND FILE
    // -------------------------------------------------

    formData.append(
      "file",
      blob,
      fileName
    );


    console.log(
      "FILE ADDED TO FORM DATA"
    );

  }


  console.log(
    "FORM DATA CREATED"
  );


  // ===================================================
  // UPLOAD REQUEST
  // ===================================================

  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => {
        controller.abort();
      },
      60000
    );


  try {

    console.log(
      "================================"
    );

    console.log(
      "STARTING FILE UPLOAD..."
    );

    console.log(
      "================================"
    );


    const response =
      await fetch(
        url,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,

            Accept:
              "application/json",

            // IMPORTANT:
            // Do NOT manually set Content-Type.
            //
            // React Native must generate the
            // multipart/form-data boundary.
          },

          body:
            formData,

          signal:
            controller.signal,
        }
      );


    console.log(
      "SUBMISSION STATUS:",
      response.status
    );


    // =================================================
    // RESPONSE
    // =================================================

    let data;

    try {

      data =
        await response.json();

    } catch (error) {

      console.log(
        "SUBMISSION JSON ERROR:",
        error
      );

      data = {
        success: false,

        message:
          "Invalid server response.",
      };

    }


    console.log(
      "SUBMISSION RESPONSE:",
      data
    );


    // =================================================
    // BACKEND ERROR
    // =================================================

    if (!response.ok) {

      const error =
        new Error(
          data?.message ||
            "Submission failed."
        );

      error.status =
        response.status;

      error.code =
        data?.code;

      error.data =
        data;

      throw error;

    }


    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      "================================"
    );

    console.log(
      "SUBMISSION SUCCESS"
    );

    console.log(
      "================================"
    );


    return data;

  } catch (error) {

    console.log(
      "================================"
    );

    console.log(
      "SUBMISSION UPLOAD ERROR:",
      error
    );

    console.log(
      "ERROR MESSAGE:",
      error?.message
    );

    console.log(
      "ERROR STATUS:",
      error?.status
    );

    console.log(
      "ERROR CODE:",
      error?.code
    );

    console.log(
      "================================"
    );


    if (
      error?.name ===
      "AbortError"
    ) {

      throw new Error(
        "Submission upload timed out. Please check your Wi-Fi connection and try again."
      );

    }


    // Preserve backend errors.

    if (
      error?.status ||
      error?.code
    ) {

      throw error;

    }


    throw error;

  } finally {

    clearTimeout(
      timeout
    );

  }

}


// =====================================================
// LOGOUT
// =====================================================

export async function logoutUser() {

  await AsyncStorage.removeItem(
    "token"
  );

}