// Class for calling Backend functions related to the Preferences
class PreferencesApi {
  // Get the code from the Backend
  static getPreferences(id) {
    const request = new Request("/api/get_preferences/" + id, {
      // Prepare the Request
      method: "GET",
    });

    return fetch(request)
      .then((response) => {
        // Return the result of the Request
        return response.text();
      })
      .catch((error) => {
        return error;
      });
  }

  // Update the Preferences on the Backend
  static updatePreferences(preferences, id) {
    const request = new Request("/api/update_preferences/" + id, {
      // Prepare the Request
      method: "POST",
      body: JSON.stringify(preferences),
    });

    return fetch(request)
      .then((response) => {
        // Return the Result of the Request
        return response.text();
      })
      .catch((error) => {
        return error;
      });
  }
}

export default PreferencesApi;
