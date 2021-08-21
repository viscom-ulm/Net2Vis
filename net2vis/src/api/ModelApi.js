// Class for calling Backend functions related to Code
class ModelApi {
  // Update the Model file on the Backend
  static updateModel(file, id) {
    let formData = new FormData();
    formData.append("model", file);

    const request = new Request("/api/upload_model/" + id, {
      // Prepare the Request
      method: "POST",
      body: formData,
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

  // Delete the model from the Backend
  static deleteModel(id) {
    const request = new Request("/api/delete_model/" + id, {
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
}

export default ModelApi;
