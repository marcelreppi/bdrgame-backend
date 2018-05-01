const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;

const app = require('../app')

describe('Testing entry functionality of REST API', () => {
  describe('GET /', () => {
    it('Correct entry response', async () => {
      const res = await makeRequest('POST', 'move', 200)
      //expect(res.body.collection.href).to.equal(data.baseURL)
    })
  })
})

function makeRequest(method, path, status, template) {
  return new Promise((resolve, reject) => {
    let request = chai.request(app)
    switch (method) {
      case 'GET': request = request.get(path); break
      case 'POST': request = request.post(path).send(template); break
      case 'PUT': request = request.put(path).send(template); break
      case 'DELETE': request = request.del(path); break
    }
    request
      .end((err, res) => {
        resolve(res)
      })
  })
}
