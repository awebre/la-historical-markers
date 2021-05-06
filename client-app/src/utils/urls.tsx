const ngrok = "https://9f8b4da56a0c.ngrok.io";
const apiUrl = __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
const photosUrl = __DEV__
  ? "http://127.0.0.1:10000/devstoreaccount1/marker-photos"
  : "https://lahm-photos.thewebre.com/marker-photos";
export { apiUrl as default, photosUrl };
