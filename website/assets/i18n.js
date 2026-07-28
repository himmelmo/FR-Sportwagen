/* FR Sportwagen – Mehrsprachigkeit (DE Standard, EN/FR/IT per Umschalter in der Nav).
   Deutsche Texte stehen im HTML; dieses Skript tauscht sie anhand des Wörterbuchs aus.
   Neue Texte: deutschen String als Schlüssel ergänzen, drei Übersetzungen dazu. */
(function () {
  var LANGS = ['de', 'en', 'fr', 'it'];
  var PREFIX = { en: 'e.g. ', fr: 'p. ex. ', it: 'es. ' };

  var D = {
    /* Navigation */
    'Über mich': { en: 'About me', fr: 'À propos', it: 'Chi sono' },
    'Leistungen': { en: 'Services', fr: 'Prestations', it: 'Servizi' },
    'Fahrzeuge': { en: 'Vehicles', fr: 'Véhicules', it: 'Veicoli' },
    'Referenzen': { en: 'References', fr: 'Références', it: 'Referenze' },
    'Ankauf': { en: 'Purchase', fr: 'Rachat', it: 'Acquisto' },
    'Kontakt': { en: 'Contact', fr: 'Contact', it: 'Contatti' },

    /* Startseite – Hero */
    'Auserwählte und exklusive Sportwagen.': {
      en: 'Selected and exclusive sports cars.',
      fr: 'Des voitures de sport sélectionnées et exclusives.',
      it: 'Auto sportive selezionate ed esclusive.'
    },
    'Referenzen ansehen': { en: 'View references', fr: 'Voir les références', it: 'Vedi le referenze' },
    'Fahrzeuge ansehen': { en: 'View vehicles', fr: 'Voir les véhicules', it: 'Vedi i veicoli' },

    /* Startseite – Über mich */
    'Sportwagen-DNA trifft auf persönlichen Service.': {
      en: 'Sports car DNA meets personal service.',
      fr: "L'ADN de la voiture de sport rencontre le service personnalisé.",
      it: 'DNA sportivo unito a un servizio personale.'
    },
    'Hinter jedem exklusiven Fahrzeug steht eine Geschichte – und hier ist meine:': {
      en: 'Behind every exceptional car there is a story – and here is mine:',
      fr: "Derrière chaque voiture d'exception se cache une histoire – voici la mienne :",
      it: "Dietro ogni auto esclusiva c'è una storia – ecco la mia:"
    },
    'Mein Name ist Fabian Rupp, Gründer und Herz dieses Unternehmens. Mit 30 Jahren blicke ich bereits auf eine Dekade operativer Erfahrung im exklusiven Sportwagen-Segment zurück.': {
      en: 'My name is Fabian Rupp, founder and heart of this company. At 30, I can already look back on a decade of hands-on experience in the exclusive sports car segment.',
      fr: "Je m'appelle Fabian Rupp, fondateur et âme de cette entreprise. À 30 ans, je compte déjà dix années d'expérience opérationnelle dans le segment des voitures de sport d'exception.",
      it: 'Mi chiamo Fabian Rupp, fondatore e anima di questa azienda. A 30 anni ho già alle spalle dieci anni di esperienza operativa nel segmento delle auto sportive esclusive.'
    },
    'Als ehemaliger Verkaufsberater, Finanzberater und Gebrauchtwagenmanager im Porsche Zentrum kenne ich die hohen Qualitätsstandards und die Faszination dieser Fahrzeuge bis ins kleinste Detail. Ich freue mich darauf, Sie mit diesem Fachwissen beim Erwerb Ihres Traumautos persönlich zu begleiten.': {
      en: 'As a former sales consultant, financial advisor and pre-owned car manager at a Porsche Centre, I know the high quality standards and the fascination of these cars down to the smallest detail. I look forward to personally guiding you through the purchase of your dream car with this expertise.',
      fr: "Ancien conseiller commercial, conseiller financier et responsable véhicules d'occasion en Centre Porsche, je connais les standards de qualité élevés et la fascination de ces voitures dans les moindres détails. Je me réjouis de vous accompagner personnellement, avec ce savoir-faire, dans l'acquisition de la voiture de vos rêves.",
      it: "Da ex consulente vendite, consulente finanziario e responsabile usato presso un Centro Porsche, conosco gli elevati standard di qualità e il fascino di queste vetture fin nei minimi dettagli. Sarò lieto di accompagnarvi personalmente, con questa competenza, nell'acquisto dell'auto dei vostri sogni."
    },
    'Ich biete Ihnen das Know-how eines Premium-Autohauses, kombiniert mit der Agilität, Diskretion und Flexibilität eines persönlichen Partners.': {
      en: 'I offer you the expertise of a premium dealership combined with the agility, discretion and flexibility of a personal partner.',
      fr: "Je vous offre le savoir-faire d'une concession premium, allié à l'agilité, à la discrétion et à la flexibilité d'un partenaire personnel.",
      it: 'Vi offro il know-how di una concessionaria premium, unito ad agilità, discrezione e flessibilità di un partner personale.'
    },

    /* Startseite – Leistungen */
    'Seriös, transparent und unkompliziert.': {
      en: 'Reputable, transparent and straightforward.',
      fr: 'Sérieux, transparent et simple.',
      it: 'Serio, trasparente e senza complicazioni.'
    },
    'Suche': { en: 'Search', fr: 'Recherche', it: 'Ricerca' },
    'Wenn Ihr Traumwagen nicht auf dem Hof steht, finde ich ihn über mein internationales Netzwerk.': {
      en: "If your dream car isn't on my lot, I will find it through my international network.",
      fr: "Si la voiture de vos rêves n'est pas sur place, je la trouverai grâce à mon réseau international.",
      it: "Se l'auto dei vostri sogni non è nel mio piazzale, la troverò attraverso la mia rete internazionale."
    },
    'Vermittlung': { en: 'Brokerage', fr: 'Intermédiation', it: 'Intermediazione' },
    'Profitieren Sie von meinem Verhandlungsgeschick für das beste Preis-Leistungs-Verhältnis bei Ihrem Neuwagen.': {
      en: 'Benefit from my negotiating skills for the best value on your new car.',
      fr: 'Profitez de mon talent de négociateur pour obtenir le meilleur rapport qualité-prix sur votre voiture neuve.',
      it: 'Approfittate della mia abilità negoziale per ottenere il miglior rapporto qualità-prezzo sulla vostra auto nuova.'
    },

    /* Startseite – Fahrzeuge & Referenzen */
    'Mehr anzeigen': { en: 'Show more', fr: 'Voir plus', it: 'Mostra di più' },
    'Demnächst verfügbar': { en: 'Available soon', fr: 'Bientôt disponible', it: 'Presto disponibile' },
    'Details auf Anfrage': { en: 'Details on request', fr: 'Détails sur demande', it: 'Dettagli su richiesta' },
    'Verkauft': { en: 'Sold', fr: 'Vendue', it: 'Venduta' },
    'Fahrzeug': { en: 'Vehicle', fr: 'Véhicule', it: 'Veicolo' },

    /* Fahrzeuge-Seite */
    'Aktuell verfügbare Fahrzeuge aus meinem Bestand. Alle Details, Fotos und das vollständige Datenblatt finden Sie auf der jeweiligen Fahrzeugseite.': {
      en: 'Vehicles currently available from my stock. All details, photos and the full data sheet can be found on the respective vehicle page.',
      fr: 'Véhicules actuellement disponibles dans mon stock. Tous les détails, photos et la fiche technique complète figurent sur la page du véhicule concerné.',
      it: 'Veicoli attualmente disponibili nel mio parco. Tutti i dettagli, le foto e la scheda tecnica completa si trovano nella pagina del rispettivo veicolo.'
    },
    'Aktuell verfügbar': { en: 'Currently available', fr: 'Actuellement disponibles', it: 'Attualmente disponibili' },
    'Nicht das Richtige dabei?': {
      en: 'Not what you were looking for?',
      fr: "Vous n'avez pas trouvé votre bonheur ?",
      it: 'Non avete trovato quello che cercavate?'
    },
    'Fahrzeug suchen lassen': { en: 'Have a vehicle sourced', fr: 'Faire rechercher un véhicule', it: 'Fate cercare un veicolo' },

    /* Fehlerseite 404 */
    'Fehler 404': { en: 'Error 404', fr: 'Erreur 404', it: 'Errore 404' },
    'Die aufgerufene Seite hat kein Ergebnis erzielt.': {
      en: 'The page you requested returned no result.',
      fr: "La page demandée n'a donné aucun résultat.",
      it: 'La pagina richiesta non ha prodotto alcun risultato.'
    },
    'Die Adresse existiert nicht oder wurde verschoben. Ich leite Sie zur Startseite weiter.': {
      en: 'The address does not exist or has been moved. You are being redirected to the home page.',
      fr: "L'adresse n'existe pas ou a été déplacée. Vous allez être redirigé vers la page d'accueil.",
      it: "L'indirizzo non esiste o è stato spostato. Vi sto reindirizzando alla home page."
    },
    'Weiterleitung in': { en: 'Redirecting in', fr: 'Redirection dans', it: 'Reindirizzamento tra' },
    'Sekunden': { en: 'seconds', fr: 'secondes', it: 'secondi' },
    'Zur Startseite': { en: 'To the home page', fr: "Vers la page d'accueil", it: 'Alla home page' },

    /* Kontakt & Footer */
    'Telefon': { en: 'Phone', fr: 'Téléphone', it: 'Telefono' },
    'Mobil': { en: 'Mobile', fr: 'Portable', it: 'Cellulare' },
    'Festnetz': { en: 'Landline', fr: 'Fixe', it: 'Fisso' },
    'E-Mail': { en: 'Email', fr: 'E-mail', it: 'E-mail' },
    'Standort': { en: 'Location', fr: 'Adresse', it: 'Sede' },
    'Wir sprechen': { en: 'We speak', fr: 'Nous parlons', it: 'Parliamo' },
    'Impressum': { en: 'Legal Notice', fr: 'Mentions légales', it: 'Note legali' },
    'Datenschutz': { en: 'Privacy', fr: 'Confidentialité', it: 'Privacy' },

    /* Referenzen-Seite */
    'Ein Blick zurück: Fahrzeuge, die ihren Weg über mich zu neuen Besitzern gefunden haben.': {
      en: 'A look back: vehicles that found their way to new owners through me.',
      fr: 'Rétrospective : des véhicules qui ont trouvé de nouveaux propriétaires par mon intermédiaire.',
      it: 'Uno sguardo al passato: veicoli che hanno trovato nuovi proprietari grazie a me.'
    },
    'Mein stolzester Besitz': { en: 'My proudest possession', fr: 'Ma plus grande fierté', it: 'Il mio orgoglio più grande' },
    'Verkaufte Fahrzeuge': { en: 'Sold vehicles', fr: 'Véhicules vendus', it: 'Veicoli venduti' },

    /* Suche-Seite */
    'Ihr Wunschfahrzeug, meine Suche.': {
      en: 'Your dream car, my search.',
      fr: 'La voiture de vos rêves, ma mission.',
      it: "L'auto dei vostri sogni, la mia ricerca."
    },
    'Sagen Sie mir so genau wie möglich, wonach Sie suchen. Ich finde Ihr Traumauto über mein internationales Netzwerk und melde mich persönlich bei Ihnen.': {
      en: 'Tell me as precisely as possible what you are looking for. I will find your dream car through my international network and get back to you personally.',
      fr: 'Dites-moi aussi précisément que possible ce que vous recherchez. Je trouverai la voiture de vos rêves grâce à mon réseau international et vous recontacterai personnellement.',
      it: "Ditemi nel modo più preciso possibile cosa cercate. Troverò l'auto dei vostri sogni attraverso la mia rete internazionale e vi ricontatterò personalmente."
    },
    'Das gesuchte Fahrzeug': { en: 'The vehicle you are looking for', fr: 'Le véhicule recherché', it: 'Il veicolo cercato' },
    'Marke und Modell': { en: 'Make and model', fr: 'Marque et modèle', it: 'Marca e modello' },
    '(Pflichtfeld)': { en: '(required)', fr: '(obligatoire)', it: '(obbligatorio)' },
    'Ausstattung / Variante': { en: 'Specification / variant', fr: 'Équipement / variante', it: 'Allestimento / variante' },
    'Baujahr ab': { en: 'Year from', fr: 'Année à partir de', it: 'Anno da' },
    'Kilometer bis': { en: 'Mileage up to', fr: 'Kilométrage max.', it: 'Chilometri max.' },
    'Budget bis': { en: 'Budget up to', fr: 'Budget max.', it: 'Budget max.' },
    'Weitere Wünsche': { en: 'Further wishes', fr: 'Autres souhaits', it: 'Altre richieste' },
    'Ihre Kontaktdaten': { en: 'Your contact details', fr: 'Vos coordonnées', it: 'I vostri contatti' },
    'Name': { en: 'Name', fr: 'Nom', it: 'Nome' },
    'Suchauftrag senden': { en: 'Send search request', fr: 'Envoyer la demande', it: 'Invia la richiesta' },
    'Ihr Suchauftrag wird direkt und sicher an mich übermittelt.': {
      en: 'Your search request is sent directly and securely to me.',
      fr: "Votre demande m'est transmise directement et en toute sécurité.",
      it: 'La vostra richiesta mi viene trasmessa direttamente e in modo sicuro.'
    },
    'Farbe, Historie, Zeitrahmen: alles, was mir bei der Suche hilft.': {
      en: 'Colour, history, timeframe: anything that helps my search.',
      fr: "Couleur, historique, délai : tout ce qui peut aider ma recherche.",
      it: 'Colore, storia, tempistiche: tutto ciò che aiuta la mia ricerca.'
    },
    'z. B. Schalter, Chrono-Paket': { en: 'e.g. manual, Chrono Package', fr: 'p. ex. boîte manuelle, Pack Chrono', it: 'es. cambio manuale, Pacchetto Chrono' },

    /* Ankauf-Seite (verkauf.html) */
    'Ihr Fahrzeug, mein Angebot.': {
      en: 'Your car, my offer.',
      fr: 'Votre voiture, mon offre.',
      it: 'La vostra auto, la mia offerta.'
    },
    'Sie möchten Ihren Sportwagen verkaufen? Je genauer Ihre Angaben, desto schneller erhalten Sie eine seriöse, transparente Bewertung. Unkompliziert und diskret.': {
      en: 'Looking to sell your sports car? The more precise your details, the faster you will receive a fair, transparent valuation. Straightforward and discreet.',
      fr: 'Vous souhaitez vendre votre voiture de sport ? Plus vos informations sont précises, plus vite vous recevrez une évaluation sérieuse et transparente. Simple et discrète.',
      it: 'Volete vendere la vostra auto sportiva? Più precise sono le informazioni, più rapidamente riceverete una valutazione seria e trasparente. Semplice e discreta.'
    },
    'Ihr Fahrzeug': { en: 'Your vehicle', fr: 'Votre véhicule', it: 'Il vostro veicolo' },
    'Die Eckdaten Ihres Fahrzeugs.': { en: 'The key facts about your car.', fr: 'Les données clés de votre véhicule.', it: 'I dati principali del vostro veicolo.' },
    'Erstzulassung': { en: 'First registration', fr: 'Première immatriculation', it: 'Prima immatricolazione' },
    'Kilometerstand': { en: 'Mileage', fr: 'Kilométrage', it: 'Chilometraggio' },
    'Leistung': { en: 'Power', fr: 'Puissance', it: 'Potenza' },
    'Getriebe': { en: 'Transmission', fr: 'Boîte de vitesses', it: 'Cambio' },
    'Bitte wählen': { en: 'Please select', fr: 'Veuillez choisir', it: 'Selezionare' },
    'Automatik / Doppelkupplung': { en: 'Automatic / dual-clutch', fr: 'Automatique / double embrayage', it: 'Automatico / doppia frizione' },
    'Schaltgetriebe': { en: 'Manual', fr: 'Boîte manuelle', it: 'Cambio manuale' },
    'Außenfarbe': { en: 'Exterior colour', fr: 'Couleur extérieure', it: 'Colore esterno' },
    'Innenausstattung': { en: 'Interior', fr: 'Intérieur', it: 'Interni' },
    'Anzahl Vorbesitzer': { en: 'Previous owners', fr: 'Nombre de propriétaires', it: 'Proprietari precedenti' },
    'Unfallfrei': { en: 'Accident-free', fr: 'Sans accident', it: 'Senza incidenti' },
    'Ja, unfallfrei': { en: 'Yes, accident-free', fr: 'Oui, sans accident', it: 'Sì, senza incidenti' },
    'Nein': { en: 'No', fr: 'Non', it: 'No' },
    'Reparierter Vorschaden': { en: 'Repaired previous damage', fr: 'Dommage antérieur réparé', it: 'Danno precedente riparato' },
    'Scheckheftgepflegt': { en: 'Full service history', fr: "Carnet d'entretien complet", it: 'Tagliandi documentati' },
    'Ja': { en: 'Yes', fr: 'Oui', it: 'Sì' },
    'Teilweise': { en: 'Partially', fr: 'Partiellement', it: 'Parzialmente' },
    '(PLZ / Ort)': { en: '(postcode / city)', fr: '(code postal / ville)', it: '(CAP / città)' },
    'Preisvorstellung': { en: 'Asking price', fr: 'Prix souhaité', it: 'Prezzo richiesto' },
    'Gewünschter Zeitrahmen': { en: 'Preferred timeframe', fr: 'Délai souhaité', it: 'Tempistica desiderata' },
    'So schnell wie möglich': { en: 'As soon as possible', fr: 'Dès que possible', it: 'Il prima possibile' },
    'Innerhalb von 3 Monaten': { en: 'Within 3 months', fr: 'Sous 3 mois', it: 'Entro 3 mesi' },
    'Flexibel': { en: 'Flexible', fr: 'Flexible', it: 'Flessibile' },
    'Zustand, Historie und Besonderheiten': { en: 'Condition, history and special features', fr: 'État, historique et particularités', it: 'Condizioni, storia e particolarità' },
    'Sonderausstattung, Wartungshistorie, Garantie, Umbauten: alles, was für die Bewertung wichtig ist.': {
      en: 'Optional equipment, service history, warranty, modifications: anything relevant for the valuation.',
      fr: "Options, historique d'entretien, garantie, modifications : tout ce qui compte pour l'évaluation.",
      it: 'Optional, storia di manutenzione, garanzia, modifiche: tutto ciò che conta per la valutazione.'
    },
    'z. B. Leder Schwarz, Alcantara': { en: 'e.g. black leather, Alcantara', fr: 'p. ex. cuir noir, Alcantara', it: 'es. pelle nera, Alcantara' },
    'Fotos Ihres Fahrzeugs': { en: 'Photos of your car', fr: 'Photos de votre véhicule', it: 'Foto del vostro veicolo' },
    'Bitte fotografieren Sie Ihr Fahrzeug aus genau diesen 6 Perspektiven. Die Beispielbilder zeigen den jeweiligen Winkel. So kann ich Ihr Fahrzeug bestmöglich einschätzen.': {
      en: 'Please photograph your car from exactly these 6 angles. The example images show each perspective. This allows me to assess your car as accurately as possible.',
      fr: "Veuillez photographier votre véhicule sous ces 6 angles précis. Les images d'exemple montrent chaque perspective. Cela me permet d'évaluer votre véhicule au mieux.",
      it: 'Fotografate il vostro veicolo esattamente da queste 6 prospettive. Le immagini di esempio mostrano ogni angolazione. Così potrò valutare al meglio il vostro veicolo.'
    },
    '1 · Front schräg': { en: '1 · Front angle', fr: '1 · Avant en biais', it: '1 · Frontale in diagonale' },
    '(vorne links)': { en: '(front left)', fr: '(avant gauche)', it: '(anteriore sinistra)' },
    '2 · Heck schräg': { en: '2 · Rear angle', fr: '2 · Arrière en biais', it: '2 · Posteriore in diagonale' },
    '(hinten rechts)': { en: '(rear right)', fr: '(arrière droit)', it: '(posteriore destra)' },
    '3 · Seitenansicht': { en: '3 · Side view', fr: '3 · Vue de profil', it: '3 · Vista laterale' },
    '(komplett)': { en: '(full view)', fr: '(complète)', it: '(completa)' },
    '(Lenkrad und Konsole)': { en: '(steering wheel and console)', fr: '(volant et console)', it: '(volante e consolle)' },
    '5 · Sitze': { en: '5 · Seats', fr: '5 · Sièges', it: '5 · Sedili' },
    '(Innenraum gesamt)': { en: '(full interior)', fr: '(intérieur complet)', it: '(interni completi)' },
    '6 · Tacho': { en: '6 · Odometer', fr: '6 · Compteur', it: '6 · Contachilometri' },
    '(Kilometerstand ablesbar)': { en: '(mileage readable)', fr: '(kilométrage lisible)', it: '(chilometraggio leggibile)' },
    'Foto auswählen': { en: 'Choose photo', fr: 'Choisir une photo', it: 'Scegli foto' },
    'Foto ausgewählt': { en: 'Photo selected', fr: 'Photo sélectionnée', it: 'Foto selezionata' },
    'Damit ich mich persönlich bei Ihnen melden kann.': {
      en: 'So that I can get back to you personally.',
      fr: 'Pour que je puisse vous recontacter personnellement.',
      it: 'Per potervi ricontattare personalmente.'
    },
    'Verkaufsanfrage senden': { en: 'Send sale request', fr: 'Envoyer la demande', it: 'Invia la richiesta' },
    'Ihre Anfrage wird mitsamt der ausgewählten Fotos direkt und sicher an mich übermittelt.': {
      en: 'Your request, including the selected photos, is sent directly and securely to me.',
      fr: "Votre demande, photos comprises, m'est transmise directement et en toute sécurité.",
      it: 'La vostra richiesta, foto incluse, mi viene trasmessa direttamente e in modo sicuro.'
    },

    /* Formular-Statusmeldungen (per FR_T aus den Seiten-Skripten) */
    'Wird gesendet …': { en: 'Sending …', fr: 'Envoi en cours …', it: 'Invio in corso …' },
    'Vielen Dank für Ihren Suchauftrag!': { en: 'Thank you for your search request!', fr: 'Merci pour votre demande !', it: 'Grazie per la vostra richiesta!' },
    'Ihre Anfrage wurde erfolgreich übermittelt. Ich melde mich zeitnah persönlich bei Ihnen.': {
      en: 'Your request has been sent successfully. I will get back to you personally very soon.',
      fr: 'Votre demande a bien été transmise. Je vous recontacterai personnellement très prochainement.',
      it: 'La vostra richiesta è stata inviata con successo. Vi ricontatterò personalmente al più presto.'
    },
    'Vielen Dank für Ihre Anfrage!': { en: 'Thank you for your request!', fr: 'Merci pour votre demande !', it: 'Grazie per la vostra richiesta!' },
    'Ihre Verkaufsanfrage wurde erfolgreich übermittelt. Ich melde mich zeitnah persönlich bei Ihnen.': {
      en: 'Your sale request has been sent successfully. I will get back to you personally very soon.',
      fr: 'Votre demande de vente a bien été transmise. Je vous recontacterai personnellement très prochainement.',
      it: 'La vostra richiesta di vendita è stata inviata con successo. Vi ricontatterò personalmente al più presto.'
    },
    'Der Versand hat leider nicht geklappt': { en: 'Unfortunately, sending failed', fr: "L'envoi a malheureusement échoué", it: "Purtroppo l'invio non è riuscito" },
    'Bitte senden Sie Ihre Anfrage direkt an': { en: 'Please send your request directly to', fr: 'Veuillez envoyer votre demande directement à', it: 'Inviate la vostra richiesta direttamente a' },

    /* Fahrzeug-Detailseite */
    'Galerie': { en: 'Gallery', fr: 'Galerie', it: 'Galleria' },
    'Alle Daten und Fakten': { en: 'All data and facts', fr: 'Toutes les données', it: 'Tutti i dati' },
    'Anfrage senden': { en: 'Send inquiry', fr: 'Envoyer une demande', it: 'Invia richiesta' },
    'Zurück zu allen Fahrzeugen': { en: 'Back to all vehicles', fr: 'Retour aux véhicules', it: 'Torna ai veicoli' },
    'Kraftstoffart': { en: 'Fuel type', fr: 'Carburant', it: 'Carburante' },
    'Schadstoffklasse': { en: 'Emission class', fr: 'Norme antipollution', it: 'Classe di emissione' },
    'Antriebsart': { en: 'Drivetrain', fr: 'Transmission', it: 'Trazione' },
    'Farbe': { en: 'Colour', fr: 'Couleur', it: 'Colore' },
    'Anzahl der Fahrzeughalter': { en: 'Previous owners', fr: 'Nombre de propriétaires', it: 'Proprietari precedenti' },
    'HU': { en: 'Inspection (HU)', fr: 'Contrôle technique', it: 'Revisione' },
    'Ausstattungslinie': { en: 'Trim line', fr: 'Finition', it: 'Allestimento' },
    'Automatik': { en: 'Automatic', fr: 'Automatique', it: 'Automatico' },
    'Diesel': { en: 'Diesel', fr: 'Diesel', it: 'Diesel' },
    'Neu': { en: 'New', fr: 'Neuf', it: 'Nuova' },
    'FIN': { en: 'VIN', fr: 'N° de châssis (VIN)', it: 'Telaio (VIN)' },
    'Interne Nummer': { en: 'Internal number', fr: 'Numéro interne', it: 'Numero interno' },
    'Umweltplakette': { en: 'Emission sticker', fr: 'Vignette écologique', it: 'Bollino ambientale' },
    'Hubraum': { en: 'Displacement', fr: 'Cylindrée', it: 'Cilindrata' },
    'Zylinder': { en: 'Cylinders', fr: 'Cylindres', it: 'Cilindri' },
    'Anzahl Sitzplätze': { en: 'Seats', fr: 'Nombre de places', it: 'Posti' },
    'Türen': { en: 'Doors', fr: 'Portes', it: 'Porte' },
    'Farbe (Hersteller)': { en: 'Colour (manufacturer)', fr: 'Couleur (constructeur)', it: 'Colore (produttore)' },
    'Farbe der Innenausstattung': { en: 'Interior colour', fr: 'Couleur intérieure', it: 'Colore interni' },
    'Beschädigtes Fahrzeug': { en: 'Damaged vehicle', fr: 'Véhicule endommagé', it: 'Veicolo danneggiato' },
    'Fahrtauglich': { en: 'Roadworthy', fr: 'Roulant', it: 'Marciante' },
    'Klimatisierung': { en: 'Climate control', fr: 'Climatisation', it: 'Climatizzazione' },
    'Einparkhilfe': { en: 'Parking assist', fr: "Aide au stationnement", it: 'Sensori di parcheggio' },
    'Geschwindigkeitsregulierung': { en: 'Cruise control', fr: 'Régulateur de vitesse', it: 'Regolatore di velocità' },
    'Airbags': { en: 'Airbags', fr: 'Airbags', it: 'Airbag' },
    'Hauptscheinwerfer': { en: 'Headlights', fr: 'Phares', it: 'Fari' },
    'Tagfahrlicht': { en: 'Daytime running lights', fr: 'Feux de jour', it: 'Luci diurne' },
    'Kurvenlicht': { en: 'Cornering lights', fr: "Éclairage d'intersection", it: 'Luci di svolta' },
    'Anhängerkupplung': { en: 'Tow bar', fr: "Attelage", it: 'Gancio traino' },
    'Anhängelast gebremst': { en: 'Braked towing capacity', fr: 'Charge remorquable freinée', it: 'Rimorchiabile frenato' },
    'Baureihe': { en: 'Series', fr: 'Série', it: 'Serie' },
    'Interesse an diesem Fahrzeug?': {
      en: 'Interested in this car?',
      fr: 'Ce véhicule vous intéresse ?',
      it: 'Interessati a questa vettura?'
    },
    'Melden Sie sich unverbindlich. Ich berate Sie gerne persönlich.': {
      en: 'Get in touch without obligation. I will be happy to advise you personally.',
      fr: 'Contactez-moi sans engagement. Je vous conseille personnellement avec plaisir.',
      it: 'Contattatemi senza impegno. Sarò lieto di consigliarvi personalmente.'
    },
    'Jetzt direkt kontaktieren': { en: 'Contact me now', fr: 'Contactez-moi', it: 'Contattami subito' },
    'Anrufen': { en: 'Call', fr: 'Appeler', it: 'Chiama' },
    'Hinweis: Testansicht mit Beispielbildern. Echte Fotos und Daten folgen automatisch über die mobile.de-Schnittstelle.': {
      en: 'Note: test view with example images. Real photos and data will follow automatically via the mobile.de interface.',
      fr: "Remarque : aperçu de test avec des images d'exemple. Les photos et données réelles suivront automatiquement via l'interface mobile.de.",
      it: "Nota: anteprima di prova con immagini di esempio. Foto e dati reali arriveranno automaticamente tramite l'interfaccia mobile.de."
    },

    /* Ankauf-Formular: neue Felder */
    'Fahrgestellnummer (FIN)': { en: 'VIN', fr: 'Numéro de châssis (VIN)', it: 'Telaio (VIN)' },
    'Karosserieform': { en: 'Body style', fr: 'Carrosserie', it: 'Carrozzeria' },
    'Cabrio / Roadster': { en: 'Convertible / roadster', fr: 'Cabriolet / roadster', it: 'Cabrio / roadster' },
    'Limousine': { en: 'Sedan', fr: 'Berline', it: 'Berlina' },
    'SUV / Geländewagen': { en: 'SUV / off-road', fr: 'SUV / tout-terrain', it: 'SUV / fuoristrada' },
    'Kombi': { en: 'Estate', fr: 'Break', it: 'Station wagon' },
    'Sonstige': { en: 'Other', fr: 'Autre', it: 'Altro' },
    'Verkauf als': { en: 'Selling as', fr: 'Vente en tant que', it: 'Vendita come' },
    'Privatperson (MwSt. nicht ausweisbar)': {
      en: 'Private seller (VAT not itemisable)',
      fr: 'Particulier (TVA non récupérable)',
      it: 'Privato (IVA non esposta)'
    },
    'Gewerblich (MwSt. ausweisbar)': {
      en: 'Commercial (VAT itemisable)',
      fr: 'Professionnel (TVA récupérable)',
      it: 'Azienda (IVA esposta)'
    },

    /* Preis-Kennzeichnung */
    '(differenzbesteuert nach § 25a UStG)': {
      en: '(margin scheme, sec. 25a German VAT Act)',
      fr: '(régime de la marge, § 25a UStG)',
      it: '(regime del margine, § 25a UStG)'
    },
    'inkl. 19 % MwSt.': { en: 'incl. 19% VAT', fr: 'TVA de 19 % incluse', it: 'IVA 19% inclusa' },

    /* Kundenstimmen */
    'Kundenstimmen': { en: 'Customer reviews', fr: 'Avis clients', it: 'Recensioni' },
    'Hier erscheint in Kürze die Stimme eines zufriedenen Kunden.': {
      en: 'A satisfied customer review will appear here soon.',
      fr: "L'avis d'un client satisfait apparaîtra ici prochainement.",
      it: 'Qui apparirà presto la recensione di un cliente soddisfatto.'
    },
    'Kunde': { en: 'Customer', fr: 'Client', it: 'Cliente' },
    'Fahrzeug gekauft': { en: 'Vehicle purchased', fr: 'Véhicule acheté', it: 'Veicolo acquistato' },
    'Design & Umsetzung:': { en: 'Design and development:', fr: 'Conception et réalisation :', it: 'Design e realizzazione:' },
    '8 Bewertungen auf mobile.de': { en: '8 reviews on mobile.de', fr: '8 avis sur mobile.de', it: '8 recensioni su mobile.de' },

    /* Gallardo-Seite */
    'Die Seitenlinie: flach, klar und bis heute zeitlos.': {
      en: 'The side profile: low, clean and timeless to this day.',
      fr: 'La ligne latérale : basse, épurée et toujours intemporelle.',
      it: 'La linea laterale: bassa, pulita e ancora oggi senza tempo.'
    },
    'Die Heckpartie mit den charakteristischen Lüftungsschlitzen.': {
      en: 'The rear end with its characteristic ventilation slats.',
      fr: "L'arrière avec ses fentes d'aération caractéristiques.",
      it: 'La coda con le caratteristiche feritoie di ventilazione.'
    },
    'Die Front in Arancio Borealis. Eine Farbe, die man nicht vergisst.': {
      en: 'The front in Arancio Borealis. A colour you never forget.',
      fr: "L'avant en Arancio Borealis. Une couleur inoubliable.",
      it: 'Il frontale in Arancio Borealis. Un colore che non si dimentica.'
    },
    'Aus der Vogelperspektive zeigt der Gallardo seine perfekten Proportionen.': {
      en: "From above, the Gallardo reveals its perfect proportions.",
      fr: "Vu d'en haut, la Gallardo révèle ses proportions parfaites.",
      it: "Dall'alto la Gallardo rivela le sue proporzioni perfette."
    },
    'Der frei saugende 5,0-Liter-V10: die „screaming" Seele dieses Autos.': {
      en: 'The naturally aspirated 5.0-litre V10: the screaming soul of this car.',
      fr: "Le V10 5,0 litres atmosphérique : l'âme hurlante de cette voiture.",
      it: "Il V10 5.0 aspirato: l'anima urlante di questa vettura."
    },
    'Innenraum in schwarzem Leder mit orangefarbenen Ziernähten.': {
      en: 'Interior in black leather with orange stitching.',
      fr: 'Intérieur en cuir noir avec surpiqûres orange.',
      it: 'Interni in pelle nera con cuciture arancioni.'
    },
    'Das Herzstück: die offene Schaltkulisse des Gated Manual.': {
      en: 'The centrepiece: the open gate of the gated manual.',
      fr: 'La pièce maîtresse : la grille apparente de la boîte mécanique.',
      it: 'Il cuore: la griglia a vista del cambio manuale.'
    },
    'Alle Fotos': { en: 'All photos', fr: 'Toutes les photos', it: 'Tutte le foto' },
    'Zurück zu den Referenzen': { en: 'Back to references', fr: 'Retour aux références', it: 'Torna alle referenze' },

    /* Carrera-Seite */
    'Referenz · Verkauft': { en: 'Reference · Sold', fr: 'Référence · Vendue', it: 'Referenza · Venduta' },
    'Allradantrieb, offenes Verdeck und die klassische Elfer-Silhouette in strahlendem Weiß. Verkauft an seinen neuen Besitzer.': {
      en: 'All-wheel drive, an open roof and the classic 911 silhouette in gleaming white. Sold to its new owner.',
      fr: "Transmission intégrale, toit ouvert et la silhouette classique de la 911 en blanc éclatant. Vendue à son nouveau propriétaire.",
      it: 'Trazione integrale, tetto aperto e la classica silhouette della 911 in bianco brillante. Venduta al suo nuovo proprietario.'
    },
    'Offen zeigt der 991 seine ganze Eleganz. Die Seitenlinie bleibt unverkennbar 911.': {
      en: 'With the top down, the 991 shows all its elegance. The side profile remains unmistakably 911.',
      fr: 'Décapotée, la 991 révèle toute son élégance. La ligne latérale reste typiquement 911.',
      it: 'A cielo aperto la 991 mostra tutta la sua eleganza. La linea laterale resta inconfondibilmente 911.'
    },
    'Die Heckpartie mit offenem Verdeck und breiter 4S-Spur.': {
      en: 'The rear end with the roof down and the wide 4S track.',
      fr: "L'arrière, capote ouverte, avec les voies larges de la 4S.",
      it: 'La coda con la capote aperta e la carreggiata larga della 4S.'
    },
    'Die Front im Detail: klare Linien, unverkennbar Elfer.': {
      en: 'The front in detail: clean lines, unmistakably a 911.',
      fr: "L'avant en détail : des lignes nettes, une 911 sans équivoque.",
      it: 'Il frontale nel dettaglio: linee pulite, inconfondibilmente una 911.'
    },
    'Das Stoffverdeck in Bewegung: in wenigen Sekunden offen.': {
      en: 'The fabric roof in motion: open in just a few seconds.',
      fr: 'La capote en mouvement : ouverte en quelques secondes.',
      it: 'La capote in movimento: aperta in pochi secondi.'
    },
    'Innenraum in schwarzem Leder, aufgeräumt und fahrerorientiert.': {
      en: 'Interior in black leather, clean and driver-focused.',
      fr: 'Intérieur en cuir noir, épuré et orienté conducteur.',
      it: 'Interni in pelle nera, essenziali e orientati al guidatore.'
    },
    'Sportsitze mit roten Gurten als dezenter Farbakzent.': {
      en: 'Sports seats with red belts as a subtle colour accent.',
      fr: 'Sièges sport avec ceintures rouges comme touche de couleur discrète.',
      it: 'Sedili sportivi con cinture rosse come tocco di colore discreto.'
    },

    /* Targa-Seite */
    'Schwarz auf schwarz, Fuchs-Felgen und der offene Targa-Bügel. Ein Klassiker, wie er im Buche steht. Verkauft an seinen neuen Besitzer.': {
      en: 'Black on black, Fuchs wheels and the open Targa bar. A textbook classic. Sold to its new owner.',
      fr: 'Noir sur noir, jantes Fuchs et arceau Targa ouvert. Un classique par excellence. Vendue à son nouveau propriétaire.',
      it: 'Nero su nero, cerchi Fuchs e la barra Targa aperta. Un classico da manuale. Venduta al suo nuovo proprietario.'
    },
    'Im Studio zeigt der G-Targa seine zeitlose Silhouette.': {
      en:'In the studio, the G-series Targa shows its timeless silhouette.',
      fr: 'En studio, la Targa série G révèle sa silhouette intemporelle.',
      it: 'In studio la Targa serie G mostra la sua silhouette senza tempo.'
    },
    'Mit abgenommenem Dach wird der Elfer zum offenen Klassiker.': {
      en: 'With the roof removed, the 911 becomes an open-top classic.',
      fr: 'Toit retiré, la 911 devient un classique à ciel ouvert.',
      it: 'Con il tetto rimosso la 911 diventa una classica a cielo aperto.'
    },
    'Der Targa-Schriftzug am Überrollbügel, ein Stück Porsche-Geschichte.': {
      en: 'The Targa lettering on the roll bar, a piece of Porsche history.',
      fr: "Le lettrage Targa sur l'arceau, un morceau d'histoire Porsche.",
      it: 'La scritta Targa sul roll bar, un pezzo di storia Porsche.'
    },
    'Die klassischen Fuchs-Felgen, schwarz mit poliertem Rand.': {
      en: 'The classic Fuchs wheels, black with a polished rim.',
      fr: 'Les jantes Fuchs classiques, noires à bord poli.',
      it: 'I classici cerchi Fuchs, neri con bordo lucidato.'
    },
    'Die Heckpartie mit Carrera-Schriftzug und H-Kennzeichen.': {
      en: 'The rear end with Carrera lettering and historic registration.',
      fr: "L'arrière avec le lettrage Carrera et l'immatriculation de collection.",
      it: 'La coda con la scritta Carrera e la targa storica.'
    },
    'Sitze in dunklem Bordeauxrot, eine edle Kombination zum schwarzen Lack.': {
      en: 'Seats in dark burgundy, an elegant match for the black paint.',
      fr: 'Sièges bordeaux foncé, une combinaison élégante avec la carrosserie noire.',
      it: 'Sedili bordeaux scuro, un abbinamento elegante con la vernice nera.'
    },

    /* Cayenne-E-Hybrid-Seite */
    'Quarzitgrau Metallic, schwarze Räder und der leise Antritt des E-Hybrid. Ein Porsche, der jeden Tag kann. Verkauft an seinen neuen Besitzer.': {
      en: 'Quartzite Grey Metallic, black wheels and the quiet pull of the E-Hybrid. A Porsche for every day. Sold to its new owner.',
      fr: "Gris quartzite métallisé, jantes noires et la poussée silencieuse de l'E-Hybrid. Une Porsche pour tous les jours. Vendue à son nouveau propriétaire.",
      it: "Grigio quarzite metallizzato, cerchi neri e la spinta silenziosa dell'E-Hybrid. Una Porsche per ogni giorno. Venduta al suo nuovo proprietario."
    },
    'Die Front im Studio: breit gezeichnet, mit tiefen Lufteinlässen.': {
      en: 'The front in the studio: broad in stance, with deep air intakes.',
      fr: "L'avant en studio : dessin large, avec de profondes prises d'air.",
      it: "Il frontale in studio: disegno largo, con prese d'aria profonde."
    },
    'Die Seitenlinie in Quarzitgrau Metallic, dazu Räder in Schwarz mit poliertem Stern.': {
      en: 'The side profile in Quartzite Grey Metallic, with black wheels and a polished star.',
      fr: 'La ligne latérale en gris quartzite métallisé, avec des jantes noires à étoile polie.',
      it: 'La linea laterale in grigio quarzite metallizzato, con cerchi neri a stella lucidata.'
    },
    'Von hinten oben zeigen sich Panoramadach und durchgehendes Leuchtband.': {
      en: 'From above and behind: panoramic roof and a full-width light bar.',
      fr: "Vu d'en haut à l'arrière : toit panoramique et bandeau lumineux continu.",
      it: "Dall'alto e da dietro: tetto panoramico e barra luminosa continua."
    },
    'Das Cockpit mit gebogenem Display, Sport-Chrono-Uhr und Beifahrer-Bildschirm.': {
      en: 'The cockpit with curved display, Sport Chrono stopwatch and passenger screen.',
      fr: 'Le cockpit avec écran incurvé, chronomètre Sport Chrono et écran passager.',
      it: 'La plancia con display curvo, cronometro Sport Chrono e schermo passeggero.'
    },
    'Sitze in schwarzem Leder, das Wappen in den Kopfstützen geprägt.': {
      en: 'Seats in black leather, the crest embossed into the headrests.',
      fr: 'Sièges en cuir noir, écusson gaufré dans les appuie-tête.',
      it: 'Sedili in pelle nera, lo stemma goffrato nei poggiatesta.'
    },
    'Die Burmester-Anlage in der Türverkleidung, Klang auf Konzertniveau.': {
      en: 'The Burmester system in the door trim, concert-grade sound.',
      fr: 'Le système Burmester dans le panneau de porte, un son de concert.',
      it: 'Il sistema Burmester nel pannello porta, un suono da concerto.'
    },

    /* Cayenne-S-Diesel-Seite */
    'Palladium Metallic außen, helles Leder innen und ein Diesel, der die lange Strecke liebt. Verkauft an seinen neuen Besitzer.': {
      en: 'Palladium Metallic outside, light leather inside and a diesel that loves the long haul. Sold to its new owner.',
      fr: 'Palladium métallisé à l\'extérieur, cuir clair à l\'intérieur et un diesel qui aime les longues distances. Vendu à son nouveau propriétaire.',
      it: 'Palladio metallizzato fuori, pelle chiara dentro e un diesel che ama i lunghi viaggi. Venduto al suo nuovo proprietario.'
    },
    'Die Seitenlinie in Palladium Metallic, eine Farbe, die im Licht changiert.': {
      en: 'The side profile in Palladium Metallic, a colour that shifts with the light.',
      fr: 'La ligne latérale en palladium métallisé, une couleur qui change avec la lumière.',
      it: 'La linea laterale in palladio metallizzato, un colore che cambia con la luce.'
    },
    'Von oben zeigen sich die kräftigen Schultern und das große Panoramadach.': {
      en: 'From above: powerful shoulders and the large panoramic roof.',
      fr: "Vu d'en haut : des épaules puissantes et le grand toit panoramique.",
      it: "Dall'alto: spalle possenti e il grande tetto panoramico."
    },
    'Alle Türen offen: das helle Leder steht im Kontrast zum warmen Lack.': {
      en: 'All doors open: the light leather contrasts with the warm paintwork.',
      fr: 'Toutes portes ouvertes : le cuir clair contraste avec la teinte chaude de la carrosserie.',
      it: 'Tutte le porte aperte: la pelle chiara contrasta con la vernice calda.'
    },
    'Das Cockpit in zweifarbigem Leder, klar auf den Fahrer ausgerichtet.': {
      en: 'The cockpit in two-tone leather, clearly focused on the driver.',
      fr: 'Le cockpit en cuir bicolore, nettement orienté vers le conducteur.',
      it: 'La plancia in pelle bicolore, chiaramente orientata al guidatore.'
    },
    'Sitze in cremefarbenem Leder, hell und einladend.': {
      en: 'Seats in cream leather, bright and inviting.',
      fr: 'Sièges en cuir crème, clairs et accueillants.',
      it: 'Sedili in pelle crema, chiari e accoglienti.'
    },
    'Die Einstiegsleiste in gebürstetem Aluminium mit Cayenne-S-Schriftzug.': {
      en: 'The door sill plate in brushed aluminium with Cayenne S lettering.',
      fr: 'Le seuil de porte en aluminium brossé avec le lettrage Cayenne S.',
      it: 'Il battitacco in alluminio spazzolato con la scritta Cayenne S.'
    },

    /* Taycan-GTS-Seite */
    'Carraraweiß Metallic, rote Bremssättel und der lautlose Antritt des GTS. Ein Porsche, der elektrisch fährt und trotzdem Porsche bleibt. Verkauft an seinen neuen Besitzer.': {
      en: 'Carrara White Metallic, red brake calipers and the silent pull of the GTS. A Porsche that runs on electricity and still feels every bit a Porsche. Sold to its new owner.',
      fr: "Blanc Carrara métallisé, étriers de frein rouges et la poussée silencieuse de la GTS. Une Porsche électrique qui reste pleinement une Porsche. Vendue à son nouveau propriétaire.",
      it: 'Bianco Carrara metallizzato, pinze freno rosse e la spinta silenziosa della GTS. Una Porsche che va a elettricità e resta in tutto e per tutto una Porsche. Venduta al suo nuovo proprietario.'
    },
    'Unter der Lichtdecke im Studio zeigt sich die flache, breite Front.': {
      en: 'Under the studio light ceiling, the low, wide front comes into its own.',
      fr: 'Sous le plafond lumineux du studio, la face avant basse et large se révèle.',
      it: 'Sotto il soffitto luminoso dello studio emerge il frontale basso e largo.'
    },
    'Die Seitenlinie in Carraraweiß Metallic, dazu rote Bremssättel.': {
      en: 'The side profile in Carrara White Metallic, with red brake calipers.',
      fr: 'La ligne latérale en blanc Carrara métallisé, avec des étriers de frein rouges.',
      it: 'La linea laterale in bianco Carrara metallizzato, con pinze freno rosse.'
    },
    'Das Heck mit durchgehendem Leuchtband und Taycan-GTS-Schriftzug.': {
      en: 'The rear with its full-width light bar and Taycan GTS lettering.',
      fr: "L'arrière avec son bandeau lumineux continu et le lettrage Taycan GTS.",
      it: 'La coda con la barra luminosa continua e la scritta Taycan GTS.'
    },
    'Das Cockpit mit gebogenem Kombiinstrument, ganz auf den Fahrer ausgerichtet.': {
      en: 'The cockpit with its curved instrument cluster, entirely focused on the driver.',
      fr: "Le cockpit avec son bloc d'instruments incurvé, entièrement tourné vers le conducteur.",
      it: 'La plancia con la strumentazione curva, interamente rivolta al guidatore.'
    },
    'Sitze in schwarzem Leder, sportlich konturiert.': {
      en: 'Seats in black leather, sculpted for sporty support.',
      fr: 'Sièges en cuir noir, au galbe sportif.',
      it: 'Sedili in pelle nera, dal profilo sportivo.'
    },
    'Die Sport-Chrono-Uhr mittig auf dem Armaturenbrett.': {
      en: 'The Sport Chrono stopwatch at the centre of the dashboard.',
      fr: 'Le chronomètre Sport Chrono au centre de la planche de bord.',
      it: 'Il cronometro Sport Chrono al centro della plancia.'
    },

    /* Taycan-GTS-Seite in Tiefschwarz */
    'Tiefschwarz Metallic außen, helles Leder innen und die stille Wucht des GTS. Verkauft an seinen neuen Besitzer.': {
      en: 'Jet Black Metallic outside, light leather inside and the quiet force of the GTS. Sold to its new owner.',
      fr: 'Noir intense métallisé à l\'extérieur, cuir clair à l\'intérieur et la force tranquille de la GTS. Vendue à son nouveau propriétaire.',
      it: 'Nero profondo metallizzato fuori, pelle chiara dentro e la forza silenziosa della GTS. Venduta al suo nuovo proprietario.'
    },
    'Die Seitenlinie in Tiefschwarz Metallic, tief und lang gestreckt.': {
      en: 'The side profile in Jet Black Metallic, low and long.',
      fr: 'La ligne latérale en noir intense métallisé, basse et allongée.',
      it: 'La linea laterale in nero profondo metallizzato, bassa e allungata.'
    },
    'Von hinten oben zieht sich das Glasdach über die ganze Länge.': {
      en: 'Seen from above and behind, the glass roof runs the full length of the car.',
      fr: "Vu d'en haut à l'arrière, le toit vitré court sur toute la longueur.",
      it: "Visto dall'alto e da dietro, il tetto in vetro corre per tutta la lunghezza."
    },
    'Schwarze Räder, rote Bremssättel. Der GTS trägt es dezent.': {
      en: 'Black wheels, red brake calipers. The GTS wears it discreetly.',
      fr: 'Jantes noires, étriers de frein rouges. La GTS le porte avec discrétion.',
      it: 'Cerchi neri, pinze freno rosse. La GTS lo porta con discrezione.'
    },
    'Das Cockpit in hellem Leder, dazu blaue Ambientebeleuchtung.': {
      en: 'The cockpit in light leather, with blue ambient lighting.',
      fr: "Le cockpit en cuir clair, avec un éclairage d'ambiance bleu.",
      it: 'La plancia in pelle chiara, con illuminazione ambient blu.'
    },
    'Sitze in hellem Leder, ein klarer Gegensatz zum schwarzen Lack.': {
      en: 'Seats in light leather, a clear contrast to the black paintwork.',
      fr: 'Sièges en cuir clair, en net contraste avec la carrosserie noire.',
      it: 'Sedili in pelle chiara, in netto contrasto con la vernice nera.'
    },
    'Das Panoramadach mit variabler Lichtsteuerung, schaltbar von klar bis matt.': {
      en: 'The panoramic roof with variable light control, switchable from clear to matt.',
      fr: 'Le toit panoramique à commande lumineuse variable, du transparent au mat.',
      it: 'Il tetto panoramico con controllo variabile della luce, da trasparente a opaco.'
    }
  };

  var lang = 'de';
  try {
    var saved = localStorage.getItem('fr-lang');
    if (LANGS.indexOf(saved) > -1) lang = saved;
  } catch (e) {}

  var textNodes = [];
  var placeholders = [];

  function collect() {
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var n;
    while ((n = walker.nextNode())) {
      var p = n.parentNode;
      if (!p || p.nodeName === 'SCRIPT' || p.nodeName === 'STYLE') continue;
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      textNodes.push({ node: n, de: n.nodeValue });
    }
    var fields = document.querySelectorAll('input[placeholder], textarea[placeholder]');
    for (var i = 0; i < fields.length; i++) {
      placeholders.push({ el: fields[i], de: fields[i].getAttribute('placeholder') });
    }
  }

  function t(s) {
    if (lang === 'de') return s;
    var e = D[s];
    return (e && e[lang]) || s;
  }
  window.FR_T = t;

  function apply() {
    document.documentElement.lang = lang;
    textNodes.forEach(function (it) {
      if (lang === 'de') { it.node.nodeValue = it.de; return; }
      var key = it.de.trim();
      var e = D[key];
      it.node.nodeValue = (e && e[lang]) ? it.de.replace(key, e[lang]) : it.de;
    });
    placeholders.forEach(function (it) {
      if (lang === 'de') { it.el.setAttribute('placeholder', it.de); return; }
      var e = D[it.de];
      if (e && e[lang]) {
        it.el.setAttribute('placeholder', e[lang]);
      } else if (it.de.indexOf('z. B. ') === 0) {
        it.el.setAttribute('placeholder', PREFIX[lang] + it.de.slice(6));
      } else {
        it.el.setAttribute('placeholder', it.de);
      }
    });
    var label = document.querySelector('.lang-switch .lang-current-label');
    if (label) label.textContent = lang.toUpperCase();
    var items = document.querySelectorAll('.lang-menu button');
    for (var i = 0; i < items.length; i++) {
      items[i].style.display = items[i].getAttribute('data-lang') === lang ? 'none' : 'block';
    }
    /* Designer-Link: deutsche Sprache -> .de, alle anderen -> .com */
    var designLinks = document.querySelectorAll('.design-link');
    for (var d = 0; d < designLinks.length; d++) {
      designLinks[d].href = lang === 'de' ? 'https://mhhtechsolutions.de' : 'https://mhhtechsolutions.com';
    }
  }

  function buildSwitcher() {
    var nav = document.querySelector('header nav');
    if (!nav) return;
    var style = document.createElement('style');
    style.textContent =
      '.lang-switch{position:relative;margin-left:0.5rem;}' +
      '.lang-current{display:flex;align-items:center;gap:0.35rem;background:none;border:1px solid rgba(255,255,255,0.25);border-radius:4px;color:#b5b5b5;font-family:inherit;font-size:0.78rem;letter-spacing:0.08em;cursor:pointer;padding:0.3rem 0.6rem;transition:color 0.2s,border-color 0.2s;}' +
      '.lang-current:hover{color:#ffffff;border-color:rgba(255,255,255,0.5);}' +
      '.lang-current svg{transition:transform 0.2s;}' +
      '.lang-switch.open .lang-current svg{transform:rotate(180deg);}' +
      '.lang-menu{position:absolute;top:calc(100% + 0.55rem);right:0;min-width:100%;background:rgba(10,10,10,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,0.12);border-radius:6px;padding:0.3rem 0;opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity 0.2s,transform 0.2s,visibility 0.2s;z-index:200;}' +
      '.lang-switch.open .lang-menu{opacity:1;visibility:visible;transform:none;}' +
      '.lang-menu button{display:block;width:100%;text-align:center;background:none;border:none;color:#b5b5b5;font-family:inherit;font-size:0.78rem;letter-spacing:0.08em;padding:0.4rem 0.9rem;cursor:pointer;transition:color 0.2s;}' +
      '.lang-menu button:hover{color:#ffffff;}';
    document.head.appendChild(style);

    var wrap = document.createElement('div');
    wrap.className = 'lang-switch';

    var current = document.createElement('button');
    current.type = 'button';
    current.className = 'lang-current';
    current.setAttribute('aria-label', 'Sprache wählen');
    current.innerHTML = '<span class="lang-current-label">' + lang.toUpperCase() + '</span>' +
      '<svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" style="fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;"><path d="M6 9l6 6l6 -6"/></svg>';
    current.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.classList.toggle('open');
    });
    wrap.appendChild(current);

    var menu = document.createElement('div');
    menu.className = 'lang-menu';
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('data-lang', l);
      b.textContent = l.toUpperCase();
      b.addEventListener('click', function () {
        lang = l;
        try { localStorage.setItem('fr-lang', l); } catch (e) {}
        wrap.classList.remove('open');
        apply();
      });
      menu.appendChild(b);
    });
    wrap.appendChild(menu);

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });

    nav.appendChild(wrap);
  }

  /* Nach dynamischem Rendern (z. B. Fahrzeugdaten aus der API) neu einsammeln und übersetzen */
  window.FR_I18N_REFRESH = function () {
    textNodes = [];
    placeholders = [];
    collect();
    apply();
  };

  function init() {
    collect();
    buildSwitcher();
    apply();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
