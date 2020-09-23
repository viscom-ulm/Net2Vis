// Class for calling Backend functions related to Code
class CodeApi {
  // Get the code from the Backend
  static getCode(id) {
    const request = new Request("/api/get_code/" + id, {
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

  // Update the Code on the Backend
  static updateCode(code, id) {
    const request = new Request("/api/update_code/" + id, {
      // Prepare the Request
      method: "POST",
      body: code,
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

export default CodeApi;
