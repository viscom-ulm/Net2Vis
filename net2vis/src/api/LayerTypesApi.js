// Class for calling Backend functions related to the LayerTypes
class LayerTypesApi {
  // Get the code from the Backend
  static getLayerTypes(id) {
    const request = new Request("/api/get_layer_types/" + id, {
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
  static updateLayerTypes(layerTypes, id) {
    const request = new Request("/api/update_layer_types/" + id, {
      // Prepare the Request
      method: "POST",
      body: JSON.stringify(layerTypes),
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

export default LayerTypesApi;
