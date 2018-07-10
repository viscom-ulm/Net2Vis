class CodeApi {
    static getCode() {
      const request = new Request('/api/get_code', {
        method: 'GET'
      });
      
      return fetch(request).then(response => {
        return response.text();
      }).catch(error => {
        return error;
      });
    }    

    static updateCode(code) {
      const request = new Request('/api/update_code', {
        method: 'POST',
        body: code
      });
      
      return fetch(request).then(response => {
        return response.text();
      }).catch(error => {
        return error;
      });
    }
  }
  
  export default CodeApi;