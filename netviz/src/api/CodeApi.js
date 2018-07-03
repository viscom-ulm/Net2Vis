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
  }
  
  export default CodeApi;