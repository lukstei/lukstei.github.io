import React from "react"
import { graphql, StaticQuery } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

import "../utils/normalize.css"
import "../utils/css/screen.css"
import styled from "@emotion/styled"

const Header = styled.h1`
    &&& {
        margin-top: 50px;
        text-align: left;
        font-size: 5rem;
    }
`

const ImpressumPage = ({data}) => {
    const siteTitle = data.site.siteMetadata.title

    return (
        <Layout title={siteTitle}>
            <SEO title="Impressum" keywords={[`blog`, `lukas steinbrecher`, `javascript`]}/>

            <article style={{maxWidth: 900, margin: "auto"}}>
                <div>
                    <Header>Impressum</Header>

                    <p>Informationspflicht laut §5 E-Commerce Gesetz, §14
                        Unternehmensgesetzbuch, §63 Gewerbeordnung und Offenlegungspflicht laut §25 Mediengesetz.</p>
                    <p>
                        <p>Lukas Steinbrecher</p>
                        <p>Wopfing 358, <br/>2754 Waldegg, <br/>Österreich</p>
                        <p>
                            <strong>Tel.:</strong> 0680/2314822<br/>
                            <strong>E-Mail:</strong> <a href="mailto:lukas@lukstei.com">lukas@lukstei.com</a>
                        </p>
                        <p>Quelle: Erstellt mit dem <a
                            title="Impressum Generator von firmenwebseiten.at"
                            href="https://www.firmenwebseiten.at/impressum-generator/" target="_blank" rel="follow"
                            style={{textDecoration: "none"}}>Impressum Generator von firmenwebseiten.at</a> in Kooperation
                            mit <a href="https://www.wallentin.cc" target="_blank" rel="follow"
                                   title="Schönheitsbehandlungen in Wien - mit und ohne Operation bei Dr. Valentin"
                                   style={{textDecoration: "none"}}>wallentin.cc</a>
                        </p>
                        <h2>EU-Streitschlichtung</h2>
                        <p>Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung)
                            möchten wir Sie über die Online-Streitbeilegungsplattform (OS-Plattform) informieren.<br/>
                            Verbraucher haben die Möglichkeit, Beschwerden an die Online Streitbeilegungsplattform der
                            Europäischen Kommission unter <a
                                                             href="https://ec.europa.eu/consumers/odr/main/index.cfm?event=main.home2.show&lng=DE"
                                                             target="_blank" className="external"
                                                             rel="nofollow">http://ec.europa.eu/odr?tid=221108180</a> zu
                            richten. Die dafür notwendigen Kontaktdaten finden Sie oberhalb in unserem Impressum.</p>
                        <p>Wir möchten Sie jedoch darauf hinweisen, dass wir nicht bereit oder verpflichtet sind, an
                            Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
                        <h2>Haftung für Inhalte dieser Webseite</h2>
                        <p>Wir entwickeln die Inhalte dieser Webseite ständig weiter und bemühen uns korrekte und
                            aktuelle Informationen bereitzustellen. Leider können wir keine Haftung für die Korrektheit
                            aller Inhalte auf dieser Webseite übernehmen, speziell für jene die seitens Dritter
                            bereitgestellt wurden.</p>
                        <p>Sollten Ihnen problematische oder rechtswidrige Inhalte auffallen, bitten wir Sie uns
                            umgehend zu kontaktieren, Sie finden die Kontaktdaten im Impressum.</p>
                        <h2>Haftung für Links auf dieser Webseite</h2>
                        <p>Unsere Webseite enthält Links zu anderen Webseiten für deren Inhalt wir nicht verantwortlich
                            sind. Haftung für verlinkte Websites besteht laut <a
                                                                                 href="https://www.ris.bka.gv.at/Dokument.wxe?Abfrage=Bundesnormen&Dokumentnummer=NOR40025813&tid=221108180"
                                                                                 target="_blank" rel="noopener nofollow"
                                                                                 className="external">§ 17 ECG</a> für
                            uns nicht, da wir keine Kenntnis rechtswidriger Tätigkeiten hatten und haben, uns solche
                            Rechtswidrigkeiten auch bisher nicht aufgefallen sind und wir Links sofort entfernen würden,
                            wenn uns Rechtswidrigkeiten bekannt werden.</p>
                        <p>Wenn Ihnen rechtswidrige Links auf unserer Website auffallen, bitten wir Sie uns zu
                            kontaktieren, Sie finden die Kontaktdaten im Impressum.</p>
                        <h2>Urheberrechtshinweis</h2>
                        <p>Alle Inhalte dieser Webseite (Bilder, Fotos, Texte, Videos) unterliegen dem Urheberrecht.
                            Falls notwendig, werden wir die unerlaubte Nutzung von Teilen der Inhalte unserer Seite
                            rechtlich verfolgen.</p>
                        <h1>Datenschutzerklärung</h1>
                        <h2>Datenschutz</h2>
                        <p>Wir haben diese Datenschutzerklärung (Fassung 29.11.2019-221108180) verfasst, um Ihnen gemäß
                            der Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 und dem <a
                               
                                href="https://www.ris.bka.gv.at/GeltendeFassung.wxe?Abfrage=Bundesnormen&Gesetzesnummer=10001597&tid=221108180"
                                target="_blank" rel="noopener nofollow" className="external">Datenschutzgesetz
                                (DSG)</a> zu erklären, welche Informationen wir sammeln, wie wir Daten verwenden und
                            welche Entscheidungsmöglichkeiten Sie als Besucher dieser Webseite haben.</p>
                        <p>Leider liegt es in der Natur der Sache, dass diese Erklärungen sehr technisch klingen. Wir
                            haben uns bei der Erstellung jedoch bemüht die wichtigsten Dinge so einfach und klar wie
                            möglich zu beschreiben.</p>
                        <h2>Automatische Datenspeicherung</h2>
                        <p>Wenn Sie heutzutage Webseiten besuchen, werden gewisse Informationen automatisch erstellt und
                            gespeichert, so auch auf dieser Webseite.</p>
                        <p>Wenn Sie unsere Webseite so wie jetzt gerade besuchen, speichert unser Webserver (Computer
                            auf dem diese Webseite gespeichert ist) automatisch Daten wie</p>
                        <ul>
                            <li>die Adresse (URL) der aufgerufenen Webseite</li>
                            <li>Browser und Browserversion</li>
                            <li>das verwendete Betriebssystem</li>
                            <li>die Adresse (URL) der zuvor besuchten Seite (Referrer
                                URL)
                            </li>
                            <li>den Hostname und die IP-Adresse des Geräts von welchem
                                aus zugegriffen wird
                            </li>
                            <li>Datum und Uhrzeit</li>
                        </ul>
                        <p>in Dateien (Webserver-Logfiles).</p>
                        <p>In der Regel werden Webserver-Logfiles zwei Wochen gespeichert und danach automatisch
                            gelöscht. Wir geben diese Daten nicht weiter, können jedoch nicht ausschließen, dass diese
                            Daten beim Vorliegen von rechtswidrigem Verhalten eingesehen werden.</p>
                        <h2>Auswertung des Besucherverhaltens</h2>
                        <p>In der folgenden Datenschutzerklärung informieren wir Sie darüber, ob und wie wir Daten Ihres
                            Besuchs dieser Website auswerten. Die Auswertung der gesammelten Daten erfolgt in der Regel
                            anonym und wir können von Ihrem Verhalten auf dieser Website nicht auf Ihre Person
                            schließen.</p>
                        <p>Mehr über Möglichkeiten dieser Auswertung der Besuchsdaten zu widersprechen erfahren Sie in
                            der folgenden Datenschutzerklärung.</p>
                        <h2>TLS-Verschlüsselung mit https</h2>
                        <p>Wir verwenden https um Daten abhörsicher im Internet zu übertragen (Datenschutz durch
                            Technikgestaltung <a
                                                 href="https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679&from=DE&tid=221108180"
                                                 target="_blank" rel="noopener nofollow" className="external">Artikel 25
                                Absatz 1 DSGVO</a>). Durch den Einsatz von TLS (Transport Layer Security), einem
                            Verschlüsselungsprotokoll zur sicheren Datenübertragung im Internet können wir den Schutz
                            vertraulicher Daten sicherstellen. Sie erkennen die Benutzung dieser Absicherung der
                            Datenübertragung am kleinen Schlosssymbol links oben im Browser und der Verwendung des
                            Schemas https (anstatt http) als Teil unserer Internetadresse.</p>
                        <h2>Google Analytics Datenschutzerklärung</h2>
                        <p>Wir verwenden auf dieser Website Google Analytics der Firma Google LLC (1600 Amphitheatre
                            Parkway Mountain View, CA 94043, USA) um Besucherdaten statistisch auszuwerten. Dabei
                            verwendet Google Analytics zielorientierte Cookies.</p>
                        <h3>Cookies von Google Analytics</h3>
                        <ul>
                            <li>_ga
                                <ul>
                                    <li>Ablaufzeit: 2 Jahre</li>
                                    <li>Verwendung: Unterscheidung der
                                        Webseitenbesucher
                                    </li>
                                    <li>Beispielhafter Wert:
                                        GA1.2.1326744211.152221108180
                                    </li>
                                </ul>
                            </li>
                            <li>_gid
                                <ul>
                                    <li>Ablaufzeit: 24 Stunden</li>
                                    <li>Verwendung: Unterscheidung der
                                        Webseitenbesucher
                                    </li>
                                    <li>Beispielhafter Wert:
                                        GA1.2.1687193234.152221108180
                                    </li>
                                </ul>
                            </li>
                            <li>_gat_gtag_UA_
                                    <ul>
                                        <li>Ablaufzeit: 1 Minute</li>
                                        <li>Verwendung: Wird zum Drosseln der
                                            Anforderungsrate verwendet. Wenn Google Analytics über den Google Tag
                                            Manager bereitgestellt wird, erhält dieser Cookie den Namen
                                            _dc_gtm_*</li>
                                        <li>Beispielhafter Wert: 1</li>
                                    </ul>
                            </li>
                        </ul>
                        <p>Nähere Informationen zu Nutzungsbedingungen und Datenschutz finden Sie unter <a
                            href="http://www.google.com/analytics/terms/de.html"
                            className="external" rel="nofollow">http://www.google.com/analytics/terms/de.html</a> bzw.
                            unter <a
                                     href="https://support.google.com/analytics/answer/6004245?hl=de"
                                     className="external"
                                     rel="nofollow">https://support.google.com/analytics/answer/6004245?hl=de</a>.</p>
                        <h3>Pseudonymisierung</h3>
                        <p>Unser Anliegen im Sinne der DSGVO ist die Verbesserung unseres Angebotes und unseres
                            Webauftritts. Da uns die Privatsphäre unserer Nutzer wichtig ist, werden die Nutzerdaten
                            pseudonymisiert. Die Datenverarbeitung erfolgt auf Basis der gesetzlichen Bestimmungen des §
                            96 Abs 3 TKG sowie des Art 6 EU-DSGVO Abs 1 lit a (Einwilligung) und/oder f (berechtigtes
                            Interesse) der DSGVO.</p>
                        <h3>Deaktivierung der Datenerfassung durch Google Analytics</h3>
                        <p>Mithilfe des <strong>Browser-Add-ons zur
                            Deaktivierung</strong> von Google Analytics-JavaScript (ga.js, analytics.js, dc.js) können
                            Website-Besucher verhindern, dass Google Analytics ihre Daten verwendet.</p>
                        <p>Sie können die Erfassung der durch das Cookie erzeugten und auf Ihre Nutzung der Website
                            bezogenen Daten an Google sowie die Verarbeitung dieser Daten durch Google verhindern, indem
                            Sie das unter dem folgenden Link verfügbare Browser-Plugin herunterladen und
                            installieren: <a
                                             href="https://tools.google.com/dlpage/gaoptout?hl=de" className="external"
                                             rel="nofollow">https://tools.google.com/dlpage/gaoptout?hl=de</a>
                        </p>
                        <p></p>
                        <h2>Cookies</h2>
                        <p>Unsere Webseite verwendet HTTP-Cookies, um nutzerspezifische Daten zu speichern.<br/>
                            Im Folgenden erklären wir, was Cookies sind und warum Sie genutzt werden, damit Sie die
                            folgende Datenschutzerklärung besser verstehen.</p>
                        <h3>Was genau sind Cookies?</h3>
                        <p>Immer wenn Sie durch das Internet surfen, verwenden Sie einen Browser. Bekannte Browser sind
                            beispielsweise Chrome, Safari, Firefox, Internet Explorer und Microsoft Edge. Die meisten
                            Webseiten speichern kleine Text-Dateien in Ihrem Browser. Diese Dateien nennt man
                            Cookies.</p>
                        <p>Eines ist nicht von der Hand zu weisen: Cookies sind echt nützliche Helferlein. Fast alle
                            Webseiten verwenden Cookies. Genauer gesprochen sind es HTTP-Cookies, da es auch noch andere
                            Cookies für andere Anwendungsbereiche gibt. HTTP-Cookies sind kleine Dateien, die von
                            unserer Webseite auf Ihrem Computer gespeichert werden. Diese Cookie-Dateien werden
                            automatisch im Cookie-Ordner, quasi dem „Hirn“ Ihres Browsers, untergebracht. Ein Cookie
                            besteht aus einem Namen und einem Wert. Bei der Definition eines Cookies müssen zusätzlich
                            ein oder mehrere Attribute angegeben werden.</p>
                        <p>Cookies speichern gewisse Nutzerdaten von Ihnen, wie beispielsweise Sprache oder persönliche
                            Seiteneinstellungen. Wenn Sie unsere Seite wieder aufrufen, übermittelt Ihr Browser die
                            „userbezogenen“ Informationen an unsere Seite zurück. Dank der Cookies weiß unsere Webseite,
                            wer Sie sind und bietet Ihnen die Einstellung, die Sie gewohnt sind. In einigen Browsern hat
                            jedes Cookie eine eigene Datei, in anderen wie beispielsweise Firefox sind alle Cookies in
                            einer einzigen Datei gespeichert.</p>
                        <p>Es gibt sowohl Erstanbieter Cookies als auch Drittanbieter-Cookies. Erstanbieter-Cookies
                            werden direkt von unserer Seite erstellt, Drittanbieter-Cookies werden von Partner-Webseiten
                            (z.B. Google Analytics) erstellt. Jedes Cookie ist individuell zu bewerten, da jedes Cookie
                            andere Daten speichert. Auch die Ablaufzeit eines Cookies variiert von ein paar Minuten bis
                            hin zu ein paar Jahren. Cookies sind keine Software-Programme und enthalten keine Viren,
                            Trojaner oder andere „Schädlinge“. Cookies können auch nicht auf Informationen Ihres PCs
                            zugreifen.</p>
                        <p>So können zum Beispiel Cookie-Daten aussehen:</p>
                        <p>
                            <strong>Name:</strong> _ga<br/>
                            <strong>Wert:</strong> GA1.2.1326744211.152221108180
                            <strong>Verwendungszweck:</strong> Unterscheidung der
                            Webseitenbesucher<br/>
                            <strong>Ablaufdatum:</strong> nach 2 Jahren</p>
                        <p>Diese Mindestgrößen sollte ein Browser unterstützen können:</p>
                        <ul>
                            <li>Mindestens 4096 Bytes pro Cookie</li>
                            <li>Mindestens 50 Cookies pro Domain</li>
                            <li>Mindestens 3000 Cookies insgesamt</li>
                        </ul>
                        <h3>Welche Arten von Cookies gibt es?</h3>
                        <p>Die Frage welche Cookies wir im Speziellen verwenden, hängt von den verwendeten Diensten ab
                            und wird in den folgenden Abschnitten der Datenschutzerklärung geklärt. An dieser Stelle
                            möchten wir kurz auf die verschiedenen Arten von HTTP-Cookies eingehen.</p>
                        <p>Man kann 4 Arten von Cookies unterscheiden:</p>
                        <p>
                            <strong>Unerlässliche Cookies<br/>
                            </strong>Diese Cookies sind nötig, um grundlegende Funktionen der Webseite sicherzustellen.
                            Zum Beispiel braucht es diese Cookies, wenn ein User ein Produkt in den Warenkorb legt, dann
                            auf anderen Seiten weitersurft und später erst zur Kasse geht. Durch diese Cookies wird der
                            Warenkorb nicht gelöscht, selbst wenn der User sein Browserfenster schließt.</p>
                        <p>
                            <strong>Zweckmäßige Cookies<br/>
                            </strong>Diese Cookies sammeln Infos über das Userverhalten und ob der User etwaige
                            Fehlermeldungen bekommt. Zudem werden mithilfe dieser Cookies auch die Ladezeit und das
                            Verhalten der Webseite bei verschiedenen Browsern gemessen.</p>
                        <p>
                            <strong>Zielorientierte Cookies<br/>
                            </strong>Diese Cookies sorgen für eine bessere Nutzerfreundlichkeit. Beispielsweise werden
                            eingegebene Standorte, Schriftgrößen oder Formulardaten gespeichert.</p>
                        <p>
                            <strong>Werbe-Cookies<br/>
                            </strong>Diese Cookies werden auch Targeting-Cookies genannt. Sie dienen dazu dem User
                            individuell angepasste Werbung zu liefern. Das kann sehr praktisch, aber auch sehr nervig
                            sein.</p>
                        <p>Üblicherweise werden Sie beim erstmaligen Besuch einer Webseite gefragt, welche dieser
                            Cookiearten Sie zulassen möchten. Und natürlich wird diese Entscheidung auch in einem Cookie
                            gespeichert.</p>
                        <h3>Wie kann ich Cookies löschen?</h3>
                        <p>Wie und ob Sie Cookies verwenden wollen, entscheiden Sie selbst. Unabhängig von welchem
                            Service oder welcher Webseite die Cookies stammen, haben Sie immer die Möglichkeit Cookies
                            zu löschen, zu deaktivieren oder nur teilweise zuzulassen. Zum Beispiel können Sie Cookies
                            von Drittanbietern blockieren, aber alle anderen Cookies zulassen.</p>
                        <p>Wenn Sie feststellen möchten, welche Cookies in Ihrem Browser gespeichert wurden, wenn Sie
                            Cookie-Einstellungen ändern oder löschen wollen, können Sie dies in Ihren
                            Browser-Einstellungen finden:</p>
                        <p>
                            <a
                               href="https://support.google.com/chrome/answer/95647?tid=221108180" className="external"
                               rel="nofollow">Chrome: Cookies in Chrome löschen, aktivieren und verwalten</a>
                        </p>
                        <p>
                            <a
                               href="https://support.apple.com/de-at/guide/safari/sfri11471/mac?tid=221108180"
                               className="external" rel="nofollow">Safari: Verwalten von Cookies und Websitedaten mit
                                Safari</a>
                        </p>
                        <p>
                            <a
                               href="https://support.mozilla.org/de/kb/cookies-und-website-daten-in-firefox-loschen?tid=221108180"
                               className="external" rel="nofollow">Firefox: Cookies löschen, um Daten zu entfernen, die
                                Websites auf Ihrem Computer abgelegt haben</a>
                        </p>
                        <p>
                            <a
                               href="https://support.microsoft.com/de-at/help/17442/windows-internet-explorer-delete-manage-cookies?tid=221108180"
                               className="external" rel="nofollow">Internet Explorer: Löschen und Verwalten von
                                Cookies</a>
                        </p>
                        <p>
                            <a
                               href="https://support.microsoft.com/de-at/help/4027947/windows-delete-cookies?tid=221108180"
                               className="external" rel="nofollow">Microsoft Edge: Löschen und Verwalten von Cookies</a>
                        </p>
                        <p>Falls Sie grundsätzlich keine Cookies haben wollen, können Sie Ihren Browser so einrichten,
                            dass er Sie immer informiert, wenn ein Cookie gesetzt werden soll. So können Sie bei jedem
                            einzelnen Cookie entscheiden, ob Sie das Cookie erlauben oder nicht. Die Vorgangsweise ist
                            je nach Browser verschieden. Am besten Sie suchen die Anleitung in Google mit dem
                            Suchbegriff “Cookies löschen Chrome” oder „Cookies deaktivieren Chrome“ im Falle eines
                            Chrome Browsers.</p>
                        <h3>Wie sieht es mit meinem Datenschutz aus?</h3>
                        <p>Seit 2009 gibt es die sogenannten „Cookie-Richtlinien“. Darin ist festgehalten, dass das
                            Speichern von Cookies eine Einwilligung des von Ihnen verlangt. Innerhalb der EU-Länder gibt
                            es allerdings noch sehr unterschiedliche Reaktionen auf diese Richtlinien. In Österreich
                            erfolgte aber die Umsetzung dieser Richtlinie in § 96 Abs. 3 des Telekommunikationsgesetzes
                            (TKG).</p>
                        <p>Wenn Sie mehr über Cookies wissen möchten und vor technischen Dokumentationen nicht
                            zurückscheuen, empfehlen wir <a
                                                            href="https://tools.ietf.org/html/rfc6265" target="_blank"
                                                            rel="nofollow noopener"
                                                            className="external">https://tools.ietf.org/html/rfc6265</a>,
                            dem Request for Comments der Internet Engineering Task Force (IETF) namens „HTTP State
                            Management Mechanism“.</p>
                        <p style={{marginTop: 15}}>Quelle: Erstellt mit dem <a
                            title="Datenschutz Generator von firmenwebseiten.at"
                            href="https://www.firmenwebseiten.at/datenschutz-generator/" target="_blank" rel="follow"
                            style={{textDecoration: "none"}}>Datenschutz Generator von firmenwebseiten.at</a> in
                            Kooperation mit <a href="https://www.ipl-haarentfernung.at" target="_blank" rel="follow"
                                               title="" style={{textDecoration: "none"}}>ipl-haarentfernung.at</a>
                        </p>
                    </p>
                </div>
            </article>
        </Layout>
    )
}

const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

export default props => (
    <StaticQuery
        query={indexQuery}
        render={data => (
            <ImpressumPage location={props.location} data={data} {...props} />
        )}
    />
)
