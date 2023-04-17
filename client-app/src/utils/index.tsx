import colors from "./colors";
import confirm from "./confirm";
import humanizedDistance from "./distanceHelpers";
import fetcher from "./fetcher";
import * as Locations from "./locations";
import routes from "./routes";
import * as typeUtils from "./typeUtils";
import url from "./urls";

function getFileName(uri: string) {
  return uri.split("/").pop();
}

export {
  fetcher,
  url,
  humanizedDistance,
  colors,
  confirm,
  Locations,
  typeUtils,
  routes,
  getFileName,
};
