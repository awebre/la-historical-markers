const ngrok = "https://791d-2600-1700-2734-110-d81d-f9d0-32cd-e380.ngrok.io";
const apiUrl = __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
const photosUrl = __DEV__
  ? "http://127.0.0.1:10000/devstoreaccount1/marker-photos"
  : "https://lahm-photos.thewebre.com/marker-photos";
export { apiUrl as default, photosUrl };
