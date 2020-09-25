import { saveAs } from "file-saver";

// Class for calling Backend functions related to Code
class DownloadApi {
  // Update the Code on the Backend
  static sendVisualization(id, graph, legend) {
    var jsonVis = {
      graph: graph,
      legend: legend,
    };
    const request = new Request("/api/process_vis/" + id, {
      // Prepare the Request
      method: "POST",
      body: JSON.stringify(jsonVis),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return fetch(request)
      .then((response) => {
        // Return the Result of the Request
        response.blob().then((res) => {
          saveAs(res, "net2vis.zip"); // Download it
        });
      })
      .catch((error) => {
        return error;
      });
  }
}

export default DownloadApi;
