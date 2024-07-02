import axios from 'axios';

const BASE_URL = 'https://equalexperts.github.io/backend-take-home-test-data';

export class ProductApiClient {
  static async fetchProductPrice(product) {
    try {
      const response = await axios.get(`${BASE_URL}/${product}.json`);
      return response.data.price;
    } catch (error) {
      throw new Error('Product not found');
    }
  }
}
