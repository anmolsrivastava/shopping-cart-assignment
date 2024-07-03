import { expect } from 'chai';
import sinon from 'sinon';
import { ProductApiClient } from '../src/productApiClient.js';
import { Cart } from '../src/cart.js';
import { PRODUCTS } from './constants.js';

describe('Cart', () => {
  let cart;

  beforeEach(() => {
    cart = new Cart();
    sinon.stub(ProductApiClient, 'fetchProductPrice');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should add a product to the cart', async () => {
    ProductApiClient.fetchProductPrice.resolves(2.52);

    await cart.addProduct(PRODUCTS.CORNFLAKES, 1);
    const state = cart.getCartState();

    expect(state.items[PRODUCTS.CORNFLAKES].quantity).to.equal(1);
    expect(state.items[PRODUCTS.CORNFLAKES].price).to.equal(2.52);
  });

  it('should remove a product from the cart', async () => {
    ProductApiClient.fetchProductPrice.resolves(2.52);

    await cart.addProduct(PRODUCTS.CORNFLAKES, 2);
    cart.removeProduct(PRODUCTS.CORNFLAKES, 1);

    const state = cart.getCartState();
    expect(state.items[PRODUCTS.CORNFLAKES].quantity).to.equal(1);

    cart.removeProduct(PRODUCTS.CORNFLAKES, 1);
    expect(state.items[PRODUCTS.CORNFLAKES]).to.be.undefined;
  });

  it('should calculate the correct subtotal, tax, and total', async () => {
    ProductApiClient.fetchProductPrice
      .withArgs(PRODUCTS.CORNFLAKES)
      .resolves(2.52);
    ProductApiClient.fetchProductPrice
      .withArgs(PRODUCTS.WEETABIX)
      .resolves(9.98);

    await cart.addProduct(PRODUCTS.CORNFLAKES, 2);
    await cart.addProduct(PRODUCTS.WEETABIX, 1);

    const state = cart.getCartState();

    expect(state.subtotal).to.equal(15.02);
    expect(state.tax).to.equal(1.88);
    expect(state.total).to.equal(16.9);
  });

  it('should apply multiple discounts correctly', async () => {
    ProductApiClient.fetchProductPrice
      .withArgs(PRODUCTS.CORNFLAKES)
      .resolves(2.52);
    ProductApiClient.fetchProductPrice
      .withArgs(PRODUCTS.WEETABIX)
      .resolves(9.98);

    await cart.addProduct(PRODUCTS.CORNFLAKES, 1);
    await cart.addProduct(PRODUCTS.CORNFLAKES, 1);
    await cart.addProduct(PRODUCTS.WEETABIX, 1);

    cart.applyDiscount('SAVE10');
    cart.applyDiscount('FLAT5');

    const state = cart.getCartState();

    expect(state.subtotal).to.equal(15.02);
    expect(state.discount).to.equal(6.50); // 10% of 15.02 + 5.00
    expect(state.discountedSubtotal).to.equal(8.52);
    expect(state.tax).to.equal(1.06);
    expect(state.total).to.equal(9.58);
  });
});
