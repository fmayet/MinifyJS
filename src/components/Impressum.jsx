import React from 'react';

import promise from 'es6-promise'
import fetch from 'isomorphic-fetch';
promise.polyfill();

export default class Impressum extends React.Component {
  /**
   * Initial state
   */
  constructor() {
    super();
  }

  /**
   * Render
   */
  render() {
    return (
        <div>
          <div id="siteContent">
            <header>
              <h1>Minify<img className="logo" src="images/logo_s.png" /></h1>
            </header>
            <section>
              <div className="description">
                <h2>Impressum</h2>
                <div id="impressum">
                  <span id="impressum_text">
                  Inhaber und verantwortlich für den Inhalt:<br/>
                  <img src="/images/impressum.png" /><br/>
                  Haftungsausschluss:<br/>
                  Der Inhaber haftet nicht für die Aktualität, die inhaltliche Richtigkeit sowie für die Vollständigkeit der in ihrem Webangebot eingestellten Informationen. Der Inhaber hat keinen Einfluss auf Gestaltung und Inhalte fremder Internetseiten. Er distanziert sich daher von allen fremden Inhalten, auch wenn von Seiten des Inhabers auf diese externe Seiten ein Link gesetzt wurde. Dies gilt für alle auf der Homepage angezeigten Links und für alle Inhalte der Seiten, zu denen die Banner und Links führen, sowie für Fremdeinträge in vom Inhaber eingerichteten Gästebüchern, Diskussionsforen und Mailinglisten.
                  </span>
                </div>
                <p>
                Diese Website benutzt Piwik, eine Open-Source-Software zur statistischen Auswertung der Besucherzugriffe. Piwik verwendet sog. „Cookies“, Textdateien, die auf Ihrem Computer gespeichert werden und die eine Analyse der Benutzung der Website durch Sie ermöglichen. Die durch den Cookie erzeugten Informationen über Ihre Benutzung dieses Internetangebotes werden auf dem Server des Anbieters in Deutschland gespeichert. Die IP-Adresse wird sofort nach der Verarbeitung und vor deren Speicherung anonymisiert. Sie können die Installation der Cookies durch eine entsprechende Einstellung Ihrer Browser-Software verhindern; wir weisen Sie jedoch darauf hin, dass Sie in diesem Fall gegebenenfalls nicht sämtliche Funktionen dieser Website vollumfänglich nutzen können.
                </p>
                <p>
                This website uses Piwik, a web analytics open-source software. Piwik uses “cookies”, which are text files placed on your computer, to help the website analyze how users use the site. The information generated by the cookie about your use of the website (including your IP address anonymized prior to its storage) will be stored on the server of the service provider in Germany. You may refuse the use of cookies by selecting the appropriate settings on your browser, however please note that if you do this you may not be able to use the full functionality of this website.
                </p>
                <iframe className="piwik_optout" src="http://piwik.vindis.de/index.php?module=CoreAdminHome&action=optOut&language=de"></iframe>
              </div>
            </section>
          </div>
        </div>
    );
  }
}