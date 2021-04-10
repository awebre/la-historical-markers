const ngrok = "https://4d847f598dcb.ngrok.io";
export default __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
