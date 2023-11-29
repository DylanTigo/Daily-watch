import { BaseUrl, ApiKeyParam } from "./config";

export class Movies {
  static async fetchPopular() {
    const response = await fetch(`${BaseUrl}trending/tv/day${ApiKeyParam}`);
    const datas = await response.json();
    return datas.results;
  }
  static async fetchRecommendations(currentFilmId) {
    const response = await fetch(
      `${BaseUrl}tv/${currentFilmId}/recommendations${ApiKeyParam}`
    );
    const datas = await response.json();
    return datas.results;
  }
  static async fetchSearch(keywork) {
    const response = await fetch(
      `${BaseUrl}/search/multi${ApiKeyParam}&query=${keywork}`
    );
    const datas = await response.json();
    return datas.results;
  }
}
