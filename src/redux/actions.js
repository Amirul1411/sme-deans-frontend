// Importing action types and API methods
import * as actionTypes from "./actionTypes";
import * as api from "@api";

// Action to start real-time crisis tracking using WebSocket
export const startRealTimeCrisisTracking = () => dispatch => {
  let socket;

  // WebSocket onOpen handler: triggered when the socket connection is established
  const onOpen = () => {
    console.log("Socket connection established.");
    dispatch({
      type: actionTypes.FETCH_CRISIS_REQUESTED, // Dispatch request action for fetching crises
    });

    // Fetch initial crisis data
    api
      .getCrises()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_SUCCESS, // Dispatch success action with response data
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_FAILURE, // Dispatch failure action in case of error
        })
      );
  };

  // WebSocket onMessage handler: triggered when a message is received from the WebSocket
  const onMessage = message => {
    console.log("Socket received message.");
    const crises = JSON.parse(message && message.data); // Parse the received crisis data
    dispatch({
      type: actionTypes.FETCH_CRISIS_SUCCESS, // Dispatch success action with parsed data
      payload: crises,
    });
  };

  // WebSocket onException handler: triggered when there's an error with the socket connection
  const onException = () => {
    console.log("Socket connection error... Try again in 10 seconds.");
    setTimeout(() => {
      socket = api.createWebSocket(); // Recreate the socket after a delay
      socket.onerror = onException; // Attach error handler
      socket.onopen = onOpen; // Attach open handler
      socket.onmessage = onMessage; // Attach message handler
    }, 10000); // Retry after 10 seconds
  };

  // Create the WebSocket connection and attach event handlers
  socket = api.createWebSocket();
  socket.onerror = onException; // Attach error handler
  socket.onopen = onOpen; // Attach open handler
  socket.onmessage = onMessage; // Attach message handler
};

// Action to start real-time condition tracking for various parameters like PSI, Humidity, Rainfall, and Temperature
export const startRealTimeConditionTracking = interval => {
  return async dispatch => {
    const job = () => {
      // Fetch PSI (Pollutant Standards Index) data
      api
        .getPSI()
        .then(response =>
          dispatch({
            type: actionTypes.FETCH_PSI_SUCCESS, // Dispatch success action for PSI
            payload: response.data,
          })
        )
        .catch(() =>
          dispatch({
            type: actionTypes.FETCH_PSI_FAILURE, // Dispatch failure action for PSI
          })
        );

      // Fetch Humidity data
      api
        .getHumidity()
        .then(response =>
          dispatch({
            type: actionTypes.FETCH_HUMIDITY_SUCCESS, // Dispatch success action for Humidity
            payload: response.data,
          })
        )
        .catch(() =>
          dispatch({
            type: actionTypes.FETCH_HUMIDITY_FAILURE, // Dispatch failure action for Humidity
          })
        );

      // Fetch Rainfall data
      api
        .getRainfall()
        .then(response =>
          dispatch({
            type: actionTypes.FETCH_RAINFALL_SUCCESS, // Dispatch success action for Rainfall
            payload: response.data,
          })
        )
        .catch(() =>
          dispatch({
            type: actionTypes.FETCH_RAINFALL_FAILURE, // Dispatch failure action for Rainfall
          })
        );

      // Fetch Temperature data
      api
        .getTemperature()
        .then(response =>
          dispatch({
            type: actionTypes.FETCH_TEMPERATURE_SUCCESS, // Dispatch success action for Temperature
            payload: response.data,
          })
        )
        .catch(() =>
          dispatch({
            type: actionTypes.FETCH_TEMPERATURE_FAILURE, // Dispatch failure action for Temperature
          })
        );
    };

    job(); // Execute the job initially
    setInterval(job, interval); // Repeat the job at specified intervals
  };
};

// Action to fetch crisis types, assistance types, and emergency agencies
export const fetchTypes = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.FETCH_CRISIS_TYPE_REQUESTED, // Request action for crisis types
    });

    // Fetch crisis types data
    api
      .getCrisisType()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_TYPE_SUCCESS, // Dispatch success action for crisis types
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_TYPE_FAILURE, // Dispatch failure action for crisis types
        })
      );

    // Fetch assistance types data
    dispatch({
      type: actionTypes.FETCH_ASSISTANCE_TYPE_REQUESTED, // Request action for assistance types
    });
    api
      .getAssistanceType()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_ASSISTANCE_TYPE_SUCCESS, // Dispatch success action for assistance types
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_ASSISTANCE_TYPE_FAILURE, // Dispatch failure action for assistance types
        })
      );

    // Fetch emergency agencies data
    dispatch({
      type: actionTypes.FETCH_EMERGENCY_AGENCIES_REQUESTED, // Request action for emergency agencies
    });
    api
      .getEmergencyAgencies()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_EMERGENCY_AGENCIES_SUCCESS, // Dispatch success action for emergency agencies
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_EMERGENCY_AGENCIES_FAILURE, // Dispatch failure action for emergency agencies
        })
      );
  };
};

// Action to fetch crises data from API
export const getCrises = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.FETCH_CRISIS_REQUESTED, // Request action for fetching crises
    });
    api
      .getCrises()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_SUCCESS, // Dispatch success action with crisis data
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_CRISIS_FAILURE, // Dispatch failure action in case of error
        })
      );
  };
};

// Action to fetch user list data from API
export const getUserList = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.FETCH_USER_LIST_REQUESTED, // Request action for fetching user list
    });
    api
      .getUserList()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_USER_LIST_SUCCESS, // Dispatch success action with user list data
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_USER_LIST_FAILURE, // Dispatch failure action in case of error
        })
      );
  };
};

// Action to report a crisis
export const reportCrises = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.REPORT_CRISIS_REQUESTED, // Request action for reporting a crisis
    });
    await api
      .reportCrises(form)
      .then(() => dispatch({ type: actionTypes.REPORT_CRISIS_SUCCESS })) // Dispatch success action after reporting
      .catch(() => dispatch({ type: actionTypes.REPORT_CRISIS_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to login the user
export const userLogin = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.USER_LOGIN_REQUESTED, // Request action for user login
    });
    await api
      .userLogin(form)
      .then(response => {
        dispatch({
          type: actionTypes.USER_LOGIN_SUCCESS, // Dispatch success action with login response data
          payload: response.data,
        });
      })
      .catch(() => dispatch({ type: actionTypes.USER_LOGIN_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to logout the user
export const userLogout = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.USER_LOGOUT_REQUESTED, // Request action for user logout
    });
    await api
      .userLogout(form)
      .then(() => {
        dispatch({
          type: actionTypes.USER_LOGOUT_SUCCESS, // Dispatch success action after logout
        });
      })
      .catch(() => dispatch({ type: actionTypes.USER_LOGOUT_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to resolve a crisis (mark it as resolved)
export const resolveCrisis = (id, undo) => {
  return async dispatch => {
    dispatch({
      type: actionTypes.RESOLVE_CRISIS_REQUESTED, // Request action for resolving a crisis
    });
    await api
      .resolveCrisis(id, undo)
      .then(() => {
        dispatch({
          type: actionTypes.RESOLVE_CRISIS_SUCCESS, // Dispatch success action after resolving the crisis
        });
      })
      .catch(() => dispatch({ type: actionTypes.RESOLVE_CRISIS_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to add a new user
export const addUser = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.ADD_USER_REQUESTED, // Request action for adding a new user
    });
    await api
      .addUser(form)
      .then(() => {
        dispatch({
          type: actionTypes.ADD_USER_SUCCESS, // Dispatch success action after adding a user
        });
      })
      .catch(() => dispatch({ type: actionTypes.ADD_USER_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to edit an existing user
export const editUser = (id, form) => {
  return async dispatch => {
    dispatch({
      type: actionTypes.EDIT_USER_REQUESTED, // Request action for editing a user
    });
    await api
      .editUser(id, form)
      .then(() => {
        dispatch({
          type: actionTypes.EDIT_USER_SUCCESS, // Dispatch success action after editing a user
        });
      })
      .catch(() => dispatch({ type: actionTypes.EDIT_USER_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to add a new crisis type
export const addCrisisType = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.ADD_CRISIS_TYPE_REQUESTED, // Request action for adding a crisis type
    });
    await api
      .addCrisisType(form)
      .then(() => {
        dispatch({ type: actionTypes.ADD_CRISIS_TYPE_SUCCESS }); // Dispatch success action after adding crisis type
      })
      .catch(() => dispatch({ type: actionTypes.ADD_CRISIS_TYPE_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to add a new assistance type
export const addAssistanceType = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.ADD_ASSISTANCE_TYPE_REQUESTED, // Request action for adding an assistance type
    });
    await api
      .addAssistanceType(form)
      .then(() => {
        dispatch({ type: actionTypes.ADD_ASSISTANCE_TYPE_SUCCESS }); // Dispatch success action after adding assistance type
      })
      .catch(() => dispatch({ type: actionTypes.ADD_ASSISTANCE_TYPE_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to fetch emergency agencies data
export const getEmergencyAgencies = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.FETCH_EMERGENCY_AGENCIES_REQUESTED, // Request action for fetching emergency agencies
    });
    api
      .getEmergencyAgencies()
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_EMERGENCY_AGENCIES_SUCCESS, // Dispatch success action with emergency agencies data
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_EMERGENCY_AGENCIES_FAILURE, // Dispatch failure action for emergency agencies
        })
      );
  };
};

// Action to create a new emergency agency
export const addEmergencyAgency = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.ADD_EMERGENCY_AGENCY_REQUESTED, // Request action for adding an emergency agency
    });
    await api
      .addEmergencyAgency(form)
      .then(() => {
        dispatch({ type: actionTypes.ADD_EMERGENCY_AGENCY_SUCCESS }); // Dispatch success action after adding emergency agency
      })
      .catch(() => dispatch({ type: actionTypes.ADD_EMERGENCY_AGENCY_FAILURE })); // Dispatch failure action in case of error
  };
};

// Action to edit site settings
export const editSiteSettings = form => {
  return async dispatch => {
    dispatch({
      type: actionTypes.EDIT_SITE_SETTINGS_REQUESTED, // Dispatch request action for editing site settings
    });
    await api
      .editSiteSettings(form) // Call the API to edit site settings
      .then(() => {
        dispatch({ type: actionTypes.EDIT_SITE_SETTINGS_SUCCESS }); // Dispatch success action after successful edit
      })
      .catch(() => dispatch({ type: actionTypes.EDIT_SITE_SETTINGS_FAILURE })); // Dispatch failure action if error occurs
  };
};

// Action to fetch the current user data
export const getCurrentUser = () => {
  return async dispatch => {
    dispatch({
      type: actionTypes.FETCH_CURRENT_USER_REQUESTED, // Dispatch request action for fetching current user
    });
    api
      .getCurrentUser() // Call API to get current user data
      .then(response =>
        dispatch({
          type: actionTypes.FETCH_CURRENT_USER_SUCCESS, // Dispatch success action with current user data
          payload: response.data,
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.FETCH_CURRENT_USER_FAILURE, // Dispatch failure action in case of error
        })
      );
  };
};

// Action to dispatch a crisis
export const dispatchCrisis = (id, phoneNumberToNotify) => {
  return async dispatch => {
    dispatch({
      type: actionTypes.DISPATCH_CRISIS_REQUESTED, // Dispatch request action to dispatch crisis
    });
    await api
      .dispatchCrisis(id, phoneNumberToNotify) // Call API to dispatch a crisis with given data
      .then(() =>
        dispatch({
          type: actionTypes.DISPATCH_CRISIS_SUCCESS, // Dispatch success action after dispatching crisis
        })
      )
      .catch(() =>
        dispatch({
          type: actionTypes.DISPATCH_CRISIS_FAILURE, // Dispatch failure action if crisis dispatch fails
        })
      );
  };
};

// Action to show a modal with specific type and properties
export const showModal = (modalType, modalProps) => {
  return {
    type: actionTypes.MODAL_SHOW, // Dispatch action to show a modal
    payload: {
      modalType, // Type of modal to show (e.g., 'confirmation', 'error')
      modalProps, // Properties of the modal (e.g., message, title)
    },
  };
};

// Action to hide a modal
export const hideModal = () => {
  return {
    type: actionTypes.MODAL_HIDE, // Dispatch action to hide the modal
  };
};
