import { BaseUrl, ApiKeyParam } from "./config";

export class Movies {
  static async fetchPopular() {
    const response = await fetch(`${BaseUrl}trending/tv/week${ApiKeyParam}`);
    const datas = await response.json();
    return datas.results;
  }
}
