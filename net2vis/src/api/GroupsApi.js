// Class for calling Backend functions related to Code
class GroupsApi {
  // Get the code from the Backend
  static getGroups(id) {
    const request = new Request("/api/get_groups/" + id, {
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
  static updateGroups(groups, id) {
    const request = new Request("/api/update_groups/" + id, {
      // Prepare the Request
      method: "POST",
      body: JSON.stringify(groups),
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

export default GroupsApi;
