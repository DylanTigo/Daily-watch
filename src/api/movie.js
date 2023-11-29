import { BaseUrl, ApiKeyParam } from "./config";

export class Movies {
  static async fetchPopular() {
    const response = await fetch(`${BaseUrl}trending/tv/week${ApiKeyParam}`);
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
}
