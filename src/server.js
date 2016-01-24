import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Homepage from './components/Homepage';
import express from 'express';
import bodyParser from 'body-parser';
import UglifyJS from 'uglify-js';
import _ from 'lodash';


let app = express();

// Set the view engine to ejs
app.set('view engine', 'ejs');

// Serve static files from the 'public' folder
app.use(express.static('assets'));

// Parse application/json
app.use(bodyParser.json({
  limit: '10mb'
}));

// No need to advertise the tech stack
app.set('x-powered-by', false);


// ROUTES ---------------------------------------------

// GET /
app.get('/', function (req, res) {
  res.render('layout', {
    content: ReactDOMServer.renderToString(<Homepage />)
  });
});

/**
 * Format JSON response from given input JavaScript code to minify
 */
function sendResponseForInputJS(res, inputJS) {
  let outputJS = '';
  let err;

  // Ensure we have some code
  if (_.isEmpty(inputJS)) {
    res.status(400).send({ error: 'Input code is empty' });
    return;
  }

  try {
    outputJS = UglifyJS.minify(inputJS, { fromString: true });
  } catch(e) {
    res.status(400).send({ error: e.message });
    return;
  }

  res.status(200).send({
    code: outputJS.code,
    map: outputJS.map,
    stats: {
      input_size:  inputJS.length,
      output_size: outputJS.code.length,
      change_size: inputJS.length - outputJS.code.length,
      change_kb:   _.round((inputJS.length - outputJS.code.length) / 1024, 2),
      change_pct:  _.round(1 - (outputJS.code.length / inputJS.length), 2)
    }
  });
}

// Compress given JS
app.post('/api/js', function (req, res) {
  // Ensure request has content
  if (!req.body && !req.body.code) {
    res.status(400).send({ error: 'No code has been input. Please input code with the "code" key in a JSON object.' });
    return;
  }

  sendResponseForInputJS(res, req.body.code);
});


// SERVER ---------------------------------------------

// Start server
let port = process.env.PORT || 11337;
let server = app.listen(port, function () {
  let host = server.address().address;
  let port = server.address().port;

  if (host === '::') {
    host = 'localhost';
  }

  console.log('MinifyJS listening at http://%s:%s', host, port);
});
