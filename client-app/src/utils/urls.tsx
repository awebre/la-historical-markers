const ngrok = "https://cf48a3d16ffb.ngrok.io";
const apiUrl = __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
const photosUrl = __DEV__
  ? "http://http://127.0.0.1:10000/devstoreaccount1/marker-photos/"
  : "https://lahm-photos.thewebre.com/marker-photos/";
export { apiUrl as default, photosUrl };
