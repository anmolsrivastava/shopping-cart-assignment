import { expect } from 'chai';
import { Cart } from '../src/cart.js';
import { PRODUCTS } from './constants.js';

describe('Cart Integration Test', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
  });

  it('should correctly add products and calculate subtotal, tax, and total', async () => {
    // Add cornflakes @ 2.52 each
    await cart.addProduct(PRODUCTS.CORNFLAKES, 1);
    await cart.addProduct(PRODUCTS.CORNFLAKES, 1);

    // Add weetabix @ 9.98 each
    await cart.addProduct(PRODUCTS.WEETABIX, 1);

    const state = cart.getCartState();

    // Check if the cart contains the correct products and quantities
    expect(state.items[PRODUCTS.CORNFLAKES].quantity).to.equal(2);
    expect(state.items[PRODUCTS.CORNFLAKES].price).to.equal(2.52);
    expect(state.items[PRODUCTS.WEETABIX].quantity).to.equal(1);
    expect(state.items[PRODUCTS.WEETABIX].price).to.equal(9.98);

    // Check if the subtotal, tax, and total are calculated correctly
    expect(state.subtotal).to.equal(15.02);
    expect(state.tax).to.equal(1.88);
    expect(state.total).to.equal(16.9);
  });
});
