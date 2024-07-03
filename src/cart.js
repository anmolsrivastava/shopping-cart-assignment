import { ProductApiClient } from './productApiClient.js';
import { DiscountManager } from './discountManager.js';

export class Cart {
  constructor() {
    this.items = {};
    this.discountManager = new DiscountManager();
  }

  async addProduct(product, quantity) {
    const price = await ProductApiClient.fetchProductPrice(product);
    if (this.items[product]) {
      this.items[product].quantity += quantity;
    } else {
      this.items[product] = { price, quantity };
    }
  }

  applyDiscount(code) {
    try {
      this.discountManager.addDiscount(code);
    } catch (error) {
      console.error(`Failed to apply discount: ${error.message}`);
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

  getSubtotal() {
    return Number(
      Object.values(this.items)
        .reduce((subtotal, item) => {
          return subtotal + item.price * item.quantity;
        }, 0)
        .toFixed(2)
    );
  }

  _getTax(discountedSubtotal) {
    return Number((discountedSubtotal * 0.125).toFixed(2));
  }

  _getDiscountedSubtotal(subtotal, discount) {
    return subtotal - discount;
  }

  _getTotal(discountedSubtotal, tax) {
    return Number((discountedSubtotal + tax).toFixed(2));
  }

  getCartState() {
    const subtotal = this._getSubtotal();
    const discount = this.discountManager.calculateDiscount(subtotal);
    const discountedSubtotal = this._getDiscountedSubtotal(subtotal, discount);
    const tax = this._getTax(discountedSubtotal);
    const total = this._getTotal(discountedSubtotal, tax);

    return {
      items: this.items,
      subtotal,
      discount,
      discountedSubtotal,
      tax,
      total,
    };
  }
}
