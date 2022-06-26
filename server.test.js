const frisby = require('frisby');
const joi = require('joi');

describe('test unit API for /products/:product_id using product id: 1', () => {
  let baseUrl = 'http://localhost:3000/products/6';
  it('should send back status code 200 if query is success', () => {
    return frisby.get(baseUrl).expect('status', 200)
  });

  it('should not return an error', () => {
    return frisby.get(baseUrl).expectNot('json', { result: 'error' })
  });

  it('should send back data in JSON', () => {
    return frisby.get(baseUrl).expect('header', 'Content-Type', 'application/json; charset=utf-8')
  });

  it('should send back data in expected JSON structure', () => {
    let schema = joi.object({
      id: joi.number().required(),
      name: joi.string(),
      slogan: joi.string(),
      description: joi.string(),
      category: joi.string(),
      default_price: joi.number(),
      features: joi.array()
    });
    return frisby.get(baseUrl).then((result)=>{
      expect(schema.validate(result._json).error).toBe(undefined); })
  });

  it('should send back correct product informatioin', () => {
    return frisby.get(baseUrl).then((result) => {
      expect(result._json.id).toEqual(6);
      expect(result._json.name).toEqual("Pumped Up Kicks");
    })
  });
});

describe('test unit API for /products/:product_id/styles using product id: 1', () => {
  let baseUrl = 'http://localhost:3000/products/1/styles';
  it('should send back status code 200 if query is success', () => {
    return frisby.get(baseUrl).expect('status', 200)
  });

  it('should not return an error', () => {
    return frisby.get(baseUrl).expectNot('json', { result: 'error' })
  });

  it('should send back data in JSON', () => {
    return frisby.get(baseUrl).expect('header', 'Content-Type', 'application/json; charset=utf-8')
  });

  it('should send back data in expected JSON structure', () => {
    let schema = joi.object({
      id: joi.number().required(),
      product_id: joi.number(),
      name: joi.string(),
      sale_price: joi.number(),
      original_price: joi.number(),
      default_style: joi.boolean(),
      photos: joi.array(),
      skus: joi.object()
    });
    return frisby.get(baseUrl).then((result) => {
      expect(schema.validate(result._json.results[2]).error).toBe(undefined); })
  });

  it('should send back correct product informatioin', () => {
    return frisby.get(baseUrl).then((result) => {
      expect(result._json.results[2].id).toEqual(3);
      expect(result._json.results[2].name).toEqual("Ocean Blue & Grey");
    })
  });
});