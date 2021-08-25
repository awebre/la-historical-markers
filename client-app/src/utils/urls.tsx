const ngrok = "https://1e58-2600-1700-2734-110-9525-360a-a5b3-8002.ngrok.io";
const apiUrl = __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
const photosUrl = __DEV__
  ? "http://127.0.0.1:10000/devstoreaccount1/marker-photos"
  : "https://lahm-photos.thewebre.com/marker-photos";
export { apiUrl as default, photosUrl };
