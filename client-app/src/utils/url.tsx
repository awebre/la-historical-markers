const ngrok = "https://dd40a8d0deac.ngrok.io";
export default __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
