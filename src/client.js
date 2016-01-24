import React from 'react';
import ReactDOM from 'react-dom';
import Homepage from './components/Homepage';

ReactDOM.render(<Homepage />, document.getElementById('content'));

var iheight = window.innerHeight ||
        html.clientHeight  ||
        body.clientHeight  ||
        screen.availHeight;
var iwidth = window.innerWidth ||
        html.clientWidth  ||
        body.clientWidth  ||
        screen.availWidth;

document.addEventListener('DOMContentLoaded', function()
{
  var newHeight = iheight/4;
  document.getElementById("inputJS").style.height = newHeight.toString() + "px";
  document.getElementById("output").style.height = newHeight.toString() + "px";

  hljs.highlightBlock(document.getElementById("codeJS"));
  hljs.highlightBlock(document.getElementById("codeJSResult"));

  document.getElementById("impressum_text").style.visibility = "hidden";
});

var Trianglify = require('trianglify');
var pattern = Trianglify({
  variance: "1.0",
  palette: Trianglify.colorbrewer,
  x_colors: 'RdBu',
  y_colors: 'match_x',
  height: iheight,
  width: iwidth,
  stroke_width: 1.51,
  cell_size: 40
});

document.body.style['background-image'] = 'url(' + pattern.png() + ')';
