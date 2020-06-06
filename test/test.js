/* global describe, it */

const chai = require('chai');
const chaiHttp = require('chai-http');
const expressApp = require('../app.js');

chai.use(chaiHttp);
const { expect } = chai;

describe('SERVER API: route to root', () => {
  describe('root:  status, type', () => {
    it('should respond with: 200, "html" ', async () => {
      const response = await chai.request(expressApp).get('/');
      expect(response).to.have.status(200);
      expect(response).to.be.html;
    });
  });
});

