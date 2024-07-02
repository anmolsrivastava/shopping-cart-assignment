import { ProductApiClient } from './productApiClient.js';

export class Cart {
  constructor() {
    this.items = {};
  }

  async addProduct(product, quantity) {
    const price = await ProductApiClient.fetchProductPrice(product);
    if (this.items[product]) {
      this.items[product].quantity += quantity;
    } else {
      this.items[product] = { price, quantity };
    }
  }

  removeProduct(product, quantity) {
    if(this.items[product]) {
      this.items[product].quantity -= quantity;
      if(this.items[product].quantity <= 0) {
        delete this.items[product];
      }
    }
  }

  _getSubtotal() {
    return Number(
      Object.values(this.items)
        .reduce((subtotal, item) => {
          return subtotal + item.price * item.quantity;
        }, 0)
        .toFixed(2)
    );
  }

  _getTax() {
    const subtotal = this._getSubtotal();
    return Number((subtotal * 0.125).toFixed(2));
  }

  _getTotal() {
    const subtotal = this._getSubtotal();
    const tax = this._getTax();
    return Number((subtotal + tax).toFixed(2));
  }

  getCartState() {
    return {
      items: this.items,
      subtotal: this._getSubtotal(),
      tax: this._getTax(),
      total: this._getTotal(),
    };
  }
}
