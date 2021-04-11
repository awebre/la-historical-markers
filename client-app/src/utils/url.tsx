const ngrok = "https://351f79af04c7.ngrok.io";
export default __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
