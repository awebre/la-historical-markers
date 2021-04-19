const ngrok = "https://7ff4542de1fd.ngrok.io";
const apiUrl = __DEV__
  ? ngrok || "http://localhost:7071"
  : "https://la-historical-markers-prod.azurewebsites.net";
const photosUrl = __DEV__
  ? "http://127.0.0.1:10000/devstoreaccount1/marker-photos"
  : "https://lahm-photos.thewebre.com/marker-photos";
export { apiUrl as default, photosUrl };
