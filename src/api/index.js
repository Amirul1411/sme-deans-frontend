import axios from "axios";

// Configure Axios defaults
axios.defaults.baseURL = "http://localhost:8000/api";
axios.defaults.timeout = 5000;

/**
 * Retrieve the CSRF token from browser cookies.
 * Used for ensuring secure POST requests.
 * @returns {string} CSRF token.
 */
const _getCSRFToken = () => {
  const cookies = document.cookie && document.cookie.split("; ");
  let csrftoken = "";
  cookies.forEach(cookie => {
    if (cookie.slice(0, 9) === "csrftoken") {
      csrftoken = cookie.slice(10);
    }
  });
  return csrftoken;
};

/**
 * Retrieve the authentication token from localStorage.
 * Used for authorizing requests to protected endpoints.
 * @returns {string | null} Auth token.
 */
const _getAuthToken = () => {
  return localStorage.getItem("token");
};

/**
 * Fetch the list of crises from the server.
 * @returns {Promise} Axios response with crisis data.
 */
export const getCrises = () => {
  return axios.get("/crises/");
};

/**
 * Submit a report for a new crisis.
 * Adds CSRF token to the form before submission.
 * @param {FormData} form - Form data containing crisis details.
 * @returns {Promise} Axios response.
 */
export const reportCrises = form => {
  if (form) form.append("csrfmiddlewaretoken", _getCSRFToken());
  return axios.post("/crises/", form);
};

/**
 * Authenticate the user by submitting login details.
 * Adds CSRF token to the form before submission.
 * @param {FormData} form - Form data containing login credentials.
 * @returns {Promise} Axios response.
 */
export const userLogin = form => {
  if (form) form.append("csrfmiddlewaretoken", _getCSRFToken());
  return axios.post("/rest-auth/login/", form);
};

/**
 * Log out the currently authenticated user.
 * Adds CSRF token to the logout request.
 * @returns {Promise} Axios response.
 */
export const userLogout = () => {
  const form = new FormData();
  form.append("csrfmiddlewaretoken", _getCSRFToken());
  return axios.post("/rest-auth/logout/", form);
};

/**
 * Fetch the list of users from the server.
 * Requires an authorization token for access.
 * @returns {Promise} Axios response with user data.
 */
export const getUserList = () => {
  return axios.get("/users/", {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Fetch the list of crisis types.
 * @returns {Promise} Axios response with crisis types.
 */
export const getCrisisType = () => {
  return axios.get("/crisistype/");
};

/**
 * Fetch the list of assistance types for crises.
 * @returns {Promise} Axios response with assistance types.
 */
export const getAssistanceType = () => {
  return axios.get("/crisisassistance/");
};

/**
 * Dispatch a crisis with the given ID and notify a specific phone number.
 * Updates the crisis status to 'Dispatched'.
 * @param {number} id - Crisis ID.
 * @param {string} phoneNumberToNotify - Phone number to notify.
 * @returns {Promise} Axios response.
 */
export const dispatchCrisis = (id, phoneNumberToNotify) => {
  return axios.put(
    `/crises/update-partial/${id}/`,
    {
      crisis_status: "DP",
      phone_number_to_notify: phoneNumberToNotify,
    },
    {
      headers: {
        Authorization: `Token ${_getAuthToken()}`,
      },
    }
  );
};

/**
 * Resolve or undo resolution of a crisis.
 * @param {number} id - Crisis ID.
 * @param {boolean} undo - Whether to undo the resolution.
 * @returns {Promise} Axios response.
 */
export const resolveCrisis = (id, undo) => {
  return axios.put(
    `/crises/update-partial/${id}/`,
    {
      crisis_status: undo ? "PD" : "RS",
    },
    {
      headers: {
        Authorization: `Token ${_getAuthToken()}`,
      },
    }
  );
};

/**
 * Add a new user to the system.
 * @param {FormData} form - Form data containing user details.
 * @returns {Promise} Axios response.
 */
export const addUser = form => {
  return axios.post("/users/", form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Update partial details of an existing user.
 * @param {number} id - User ID.
 * @param {FormData} form - Form data containing updated user details.
 * @returns {Promise} Axios response.
 */
export const editUser = (id, form) => {
  return axios.put(`/users/update-partial/${id}/`, form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Add a new crisis type.
 * @param {FormData} form - Form data containing crisis type details.
 * @returns {Promise} Axios response.
 */
export const addCrisisType = form => {
  return axios.post("/crisistype/", form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Add a new assistance type.
 * @param {FormData} form - Form data containing assistance type details.
 * @returns {Promise} Axios response.
 */
export const addAssistanceType = form => {
  return axios.post("/crisisassistance/", form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Fetch the list of emergency agencies.
 * @returns {Promise} Axios response with agency data.
 */
export const getEmergencyAgencies = () => {
  return axios.get("/emergencyagencies/");
};

/**
 * Add a new emergency agency.
 * @param {FormData} form - Form data containing agency details.
 * @returns {Promise} Axios response.
 */
export const addEmergencyAgencies = form => {
  return axios.post("/emergencyagencies/", form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Update partial details of an existing emergency agency.
 * @param {number} id - Agency ID.
 * @param {FormData} form - Form data containing updated agency details.
 * @returns {Promise} Axios response.
 */
export const editEmergencyAgencies = (id, form) => {
  return axios.put(`/emergencyagencies/update-partial/${id}/`, form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Update site settings.
 * @param {FormData} form - Form data containing updated site settings.
 * @returns {Promise} Axios response.
 */
export const editSiteSettings = form => {
  return axios.post("/sitesettings/", form, {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Fetch the currently authenticated user's details.
 * @returns {Promise} Axios response with user data.
 */
export const getCurrentUser = () => {
  return axios.get("/rest-auth/user/", {
    headers: {
      Authorization: `Token ${_getAuthToken()}`,
    },
  });
};

/**
 * Create a WebSocket connection for crisis updates.
 * @returns {WebSocket} WebSocket instance.
 */
export const createWebSocket = () => {
  return new WebSocket("ws://localhost:8000/api/ws/crises/");
};

/**
 * Fetch the current humidity data from data.gov.sg.
 * @returns {Promise} Axios response with humidity data.
 */
export const getHumidity = () => {
  return axios.get("https://api.data.gov.sg/v1/environment/relative-humidity");
};

/**
 * Fetch the current PSI (Pollutant Standards Index) data from data.gov.sg.
 * @returns {Promise} Axios response with PSI data.
 */
export const getPSI = () => {
  return axios.get("https://api.data.gov.sg/v1/environment/psi");
};

/**
 * Fetch the current rainfall data from data.gov.sg.
 * @returns {Promise} Axios response with rainfall data.
 */
export const getRainfall = () => {
  return axios.get("https://api.data.gov.sg/v1/environment/rainfall");
};

/**
 * Fetch the current temperature data from data.gov.sg.
 * @returns {Promise} Axios response with temperature data.
 */
export const getTemperature = () => {
  return axios.get("https://api.data.gov.sg/v1/environment/air-temperature");
};
