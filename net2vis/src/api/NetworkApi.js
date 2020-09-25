// Class for calling Backend functions related to the Network
class NetworkApi {
  // Get the Network from the Backend
  static getNetwork(id) {
    const request = new Request("/api/get_network/" + id, {
      // Prepare the Request
      method: "GET",
    });

    return fetch(request)
      .then((response) => {
        // Return the result of the Request
        return response.json();
      })
      .catch((error) => {
        return error;
      });
  }
}

export default NetworkApi;
