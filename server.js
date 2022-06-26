const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const sql = require('./db.js');
require("dotenv").config();

app.use(cors());

app.get('/loaderio-fedad7a4b10396a890f0db1c9fe1fa96.txt', (req, res) => {
  res.status(200).send('loaderio-fedad7a4b10396a890f0db1c9fe1fa96');
});

app.get('/products/:id', (req, res) => {
  const query = `select json_build_object('id', p.id, 'name', p.name, 'slogan', p.slogan, 'description', p.description, 'category', p.category, 'default_price', p.default_price, 'features', (select array_to_json(array_agg(json_build_object('feature', f.feature, 'value', f.value))) from features as f where f.product_id = ${req.params.id})) from products p where p.id = ${req.params.id}`;
  sql.query(query)
    .then((result) => { res.status(200).json(result.rows[0].json_build_object) })
    .catch((err) => res.status(500).send(err));
});

app.get('/products/:id/styles', (req, res) => {
  const query = `select array_to_json(array_agg(json_build_object('id', s.id, 'product_id', s.product_id, 'name', s.name, 'sale_price', s.sale_price, 'original_price', s.original_price, 'default_style', s.default_style, 'photos',
  (case
    when (select array_to_json(array_agg(json_build_object('url', p.url, 'thumbnail_url', p.thumbnail_url))) from photos as p where p.style_id = s.id) is null then '[{"url": null, "thumbnail_url": null}]'
    else (select array_to_json(array_agg(json_build_object('url', p.url, 'thumbnail_url', p.thumbnail_url))) from photos as p where p.style_id = s.id)
  end)
    , 'skus',
    (case
      when (select json_object_agg(sk.size, sk.quantity) from skus as sk where sk.style_id = s.id) is null then '{}'
      else (select json_object_agg(sk.size, sk.quantity) from skus as sk where sk.style_id = s.id)
    end)))) from styles as s where s.product_id = ${req.params.id}`;
  sql.query(query)
    .then((result) => { res.status(200).json(result.rows[0].array_to_json) })
    .catch((err) => res.status(500).send(err));
});

app.get('/products/:id/related', (req, res) => {
  sql.query(`select array_to_json(array_agg(related_product_id)) from related where current_product_id = ${req.params.id}`)
    .then((result) => { res.status(200).json(result.rows[0].array_to_json) })
    .catch((err) => res.status(500).send(err));
});

app.listen(process.env.PORT);
