export class DiscountManager {
  constructor() {
    this.activeDiscounts = [];
  }

  addDiscount(code) {
    const discount = this._validateDiscount(code);
    if (discount) {
      this.activeDiscounts.push(discount);
    } else {
      throw new Error(`Invalid discount code: ${code}`);
    }
  }

  _validateDiscount(code) {
    // Example discount codes
    const discounts = {
      SAVE10: { type: 'percentage', value: 0.1, expires: '2024-12-31' },
      FLAT5: { type: 'fixed', value: 5.0, expires: '2024-12-31' },
    };

    const discount = discounts[code];
    if (discount && new Date(discount.expires) > new Date()) {
      return discount;
    }
    return null;
  }

  calculateDiscount(subtotal) {
    return Number(
      this.activeDiscounts
        .reduce((acc, discount) => {
          if (discount.type === 'percentage') {
            return acc + subtotal * discount.value;
          } else if (discount.type === 'fixed') {
            return acc + discount.value;
          }
          return acc;
        }, 0)
        .toFixed(2)
    );
  }
}
