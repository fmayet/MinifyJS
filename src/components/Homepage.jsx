import React from 'react';

import promise from 'es6-promise'
import fetch from 'isomorphic-fetch';
promise.polyfill();

export default class Homepage extends React.Component {
  /**
   * Initial state
   */
  constructor() {
    super();

    this.state = {
      loading: false,
      inputJS: "",
      outputJS: "",
      stats: null,
      error: null,
    }
  }

  /**
   * Compress JavaScript via server call
   */
  _compressJS(inputJS, tab) {
    // Loading
    this.setState({ loading: true });

    // Run server compression
    fetch('/api/js', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: inputJS
      })
    }).then(function(response) {
      return response.json();
    }).then((jsonResponse) => {
      if (jsonResponse.error) {
        // Show error
        this.setState({
          stats: null,
          loading: false,
          inputJS: inputJS,
          error: 'Error: ' + jsonResponse.error
        });
      } else {
        // Show output result
        this.setState({
          loading: false,
          inputJS: inputJS,
          outputJS: jsonResponse.code,
          stats: jsonResponse.stats,
          error: null
        });
      }
    }).catch((error) => {
      // Show error
      this.setState({
        loading: false,
        error: 'Error: Unable to compress JavaScript'
      });
    });
  }

  /**
   * Click 'Compress Javascript' button
   */
  handleCompressClick(event) {
    event.preventDefault();
    this._compressJS(this.refs.inputJS.value);
  }

  /**
   * Click 'Upload JavaScript'
   */
  handleUploadClick(event) {
    event.preventDefault();

    let inputJS = '';

    // Read file
    function readFileAsync(fileObject, readFileDoneCallback) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var fileContents = e.target.result;
        readFileDoneCallback.call(null, fileContents);
      };
      reader.readAsText(fileObject);
    }

    // Loop through files
    let fileContentsDict = {};
    let filesOrder = [];
    let files  = document.querySelectorAll('input[type=file]');
    let filesCount = 0;
    let filesProcessedCount = 0;
    for (var i = 0; i < files.length; i++) {
      let file = files[i];
      filesOrder.push(file.name);

      // Ensure we have a file
      if (!file.files || !file.files[0]) {
        continue;
      }

      filesCount++;

      readFileAsync(file.files[0], (fileContents) => {
        filesProcessedCount++;
        fileContentsDict[file.name] = "// --- file[" + file.name + "] ---\n\n" + fileContents + "\n\n";

        // If this is the LAST file processed, time to combine!
        if (filesProcessedCount === filesCount) {

          // Ensure files are joined IN ORDER, regardless of which ones finished first
          filesOrder.forEach((fileName) => {
            inputJS += fileContentsDict[fileName];
          });

          // Compress it!
          this._compressJS(inputJS, 'files');
        }
      });
    }
  }

  /**
   * Click to download output code
   *
   * @link http://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side
   */
  handleDownloadClick(event) {
    event.preventDefault();

    var textToWrite = this.refs.output.value;
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'});
    var fileNameToSaveAs = 'output.min.js';

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download .JS";
    if (window.URL != null) {
      // Chrome allows the link to be clicked
      // without actually adding it to the DOM.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    } else {
      // Firefox requires the link to be added to the DOM
      // before it can be clicked.
      downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
      downloadLink.onclick = function () {
        document.body.removeChild(downloadLink);
      };
      downloadLink.style.display = "none";
      document.body.appendChild(downloadLink);
    }

    downloadLink.click();
  }

  /**
   * Click to show impressum
   */
  handleImpressumClick(event) {
    event.preventDefault();
    var impressum = document.getElementById("impressum_text");
    var visibility = impressum.style.visibility;
    if(visibility === "visible")
    {
      impressum.style.visibility = "hidden";
    }
    else
    {
      impressum.style.visibility = "visible";
    }
  }

  /**
   * Render
   */
  render() {
    let appErrors;
    if (this.state.error) {
      appErrors = <div className="errors"> { this.state.error } </div>;
    }

    let loading;
    if (this.state.loading === true) {
      loading = <div className="js_loading"><span>Crunching those bits! ...</span></div>;
    }

    // For some reason, React locks the <textarea> input when we use a "value" attribute, so we have to do this...
    if (this.state.inputJS !== '') {
      this.refs.inputJS.value = this.state.inputJS;
    }

    var statistics_output = '';
    if (this.state.outputJS !== '') {
      statistics_output = <div><span className="statistics">You saved { this.state.stats ? (this.state.stats.change_pct * 100).toFixed(2) : 0 } % or { this.state.stats ? this.state.stats.change_kb : 0 } kb</span>
                          <button id="out" className="button downloadButton" title="Download!" onClick={this.handleDownloadClick.bind(this)}></button></div>;
    }

    return (
        <div>
          <div id="siteContent">
            <header>
              <h1>Minify<img className="logo" src="images/logo_s.png" /></h1>
            </header>
            <section>
              <div className="box">
                <form action="/api/js" method="post">
                  <textarea name="inputJS" id="inputJS" ref="inputJS" className="textAreaJS" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" placeholder="Put your javascript code here..."></textarea>
                  <button type="submit" className="button" title="Compress!" onClick={this.handleCompressClick.bind(this)}></button>
                  {appErrors}
                </form>
              </div>
              <div className="box">
                <form action="get">
                  <textarea name="output" className="textAreaJS" id="output" ref="output" spellCheck="false" autoComplete="off" autoCorrect="off" autoCapitalize="off" placeholder="The compressed javascript output will be displayed here." value={ this.state.outputJS } />
                  { statistics_output }
                </form>
              </div>
            </section>
          </div>
          <div id="separator"></div>
          <div id="siteDescription" className="description">
            <div>
              <h2>What it does?</h2>
              <span>
                MinifyJS is a free, easy to use and super fast JavaScript minifier. It compresses one or more JavaScript files into a single file and removes all unnecessary characters.
                <br/>
                This is ideal for production environments where you want the best performance you can get. It helps you maintain clean code during development without loosing performance when you really need it.
              </span>
            </div>
            <div>
              <h2>Why would I need this?</h2>
              <span>Compressing javascript has multiple advantages:</span>
              <ul>
                <li>Smaller file size => quicker download and faster page loading times.</li>
                <li>Less HTTP requests => only one file has to be downloaded when combining multiple files into a single file.</li>
                <li>Less bandwidth consumption => you save money when hosting a website.</li>
                <li>Reduced server load => your server has to do less (see above).</li>
                <li>Faster code => removing all unnecessary whitespace, comments and others makes your code faster (see <a target="_blank" href="https://en.wikipedia.org/wiki/Minification_(programming)">Minification</a>).</li>
                <li>Code obfuscation => your code is less readable what helps hiding functionality, makes it difficult to reverse engineer and makes exact copies obvious.</li>
              </ul>
            </div>
            <div>
              <h2>Usage</h2>
              <span>
                Copy your Javascript code into the window above and press the "flash" icon. The second window then displays your compressed code and shows you how high the compression ratio is.
                <br/>
                You can compress <b>multiple files</b> by pasting the code of two or more files into the text area. MinifyJS will detect it and compress the output into a single file.
                <br/>
                You can download your compressed file by pressing the "download" button.
              </span>
            </div>
            <div>
              <h2>Example</h2>
              <pre><code id="codeJS" className="JavaScript">
              {"function f(e, x, a, m, p, l, e) {"}<br/>
                    {"var a;"}<br/>
                    {"var b;"}<br/>
                    {"a = 1337;"}<br/>
                    {"b = 42;"}<br/>
                    {"for (var i = 1; i < a; ++i) {"}<br/>
                    {"    var ret = foo(e);"}<br/>
                    {"}"}<br/>
                    {"for (var i = 0; i < b; ++i) {"}<br/>
                    {"    var ret = bar(x);"}<br/>
                    {"}"}<br/>
                    {"function foo(x){ return x + 1; }"}<br/>
                    {"function bar(y){ return y + 1; }"}<br/>
                    {"function foobar(){ return 1; }"}<br/>
                {"}"}<br/><br/>
              </code></pre>
              Is transformed into:
              <pre><code id="codeJSResult" className="JavaScript">
                {"function f(r,n,f,o,t,u,r){function a(r){return r+1}function c(r){return r+1}var f,i;f=1337,i=42;for(var v=1;f>v;++v){a(r)}for(var v=0;i>v;++v){c(n)}}"}
              </code></pre>
              <span>
                This means you have 54% smaller code and thus quicker download times for your users.
                <br/>
                As you can see, even unused functions are removed!
              </span>
            </div>
            <footer className="footer">
              <a target="_blank" href="https://github.com/fmayet/MinifyJS"><img src="images/GitHub-Mark-32px.png"/>GitHub</a><br/>
              built upon <a target="_blank" href="https://nodejs.org/en/">Nodejs</a>, <a target="_blank" href="https://github.com/mishoo/UglifyJS">uglifyjs</a> and <a target="_blank" href="http://qrohlf.com/trianglify/">Trianglify</a>. Released under the MIT License<br/>
              Copyright (c) 2016 Ferdinand Mayet<br/>

              <div id="impressum" className="impressum">
                <button type="submit" className="impressumButton" onClick={this.handleImpressumClick.bind(this)}>Impressum</button>
                <span id="impressum_text">
                Inhaber und verantwortlich für den Inhalt:<br/>
                <img src="/images/impressum.png" /><br/>
                Haftungsausschluss:<br/>
                Der Inhaber haftet nicht für die Aktualität, die inhaltliche Richtigkeit sowie für die Vollständigkeit der in ihrem Webangebot eingestellten Informationen. Der Inhaber hat keinen Einfluss auf Gestaltung und Inhalte fremder Internetseiten. Er distanziert sich daher von allen fremden Inhalten, auch wenn von Seiten des Inhabers auf diese externe Seiten ein Link gesetzt wurde. Dies gilt für alle auf der Homepage angezeigten Links und für alle Inhalte der Seiten, zu denen die Banner und Links führen, sowie für Fremdeinträge in vom Inhaber eingerichteten Gästebüchern, Diskussionsforen und Mailinglisten.
                </span>
              </div>
            </footer>
          </div>
        </div>
    );
  }
}
