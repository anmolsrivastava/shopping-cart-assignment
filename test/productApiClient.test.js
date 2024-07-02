// test/productApiClient.test.js
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import { ProductApiClient } from '../src/productApiClient.js';

describe('ProductApiClient', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should fetch product price successfully', async () => {
    const mockResponse = { data: { price: 2.52 } };
    sinon.stub(axios, 'get').resolves(mockResponse);

    const price = await ProductApiClient.fetchProductPrice('cornflakes');
    expect(price).to.equal(2.52);
  });

  it('should throw an error for an invalid product', async () => {
    sinon.stub(axios, 'get').rejects(new Error('Product not found'));

    try {
      await ProductApiClient.fetchProductPrice('oats');
    } catch (error) {
      expect(error.message).to.equal('Product not found');
    }
  });
});
