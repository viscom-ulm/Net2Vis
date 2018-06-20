class NetworkApi {
  static getNetwork() {
    const request = new Request('/api/network', {
      method: 'GET'
    });
    
    return fetch(request).then(response => {
      return response.json();
    }).catch(error => {
      return error;
    });
  }    
}

export default NetworkApi;