import { isEmpty } from "lodash";

export function jsonToString(json) {
  if (isEmpty(json)) {
    return '';
  }

  if (Array.isArray(json)) {
    let arr = json.map(a => jsonToString(a));
    return arr.join(" ");
  }

  const str = JSON.stringify(json);
  const arr = str.split(",");
  return Array.isArray(arr) ? arr.join(" ") : str;
}