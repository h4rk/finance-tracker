# Personal Finance Tracker - Documentazione

## Indice

1. [Introduzione](#introduzione)
2. [Architettura del Sistema](#architettura-del-sistema)
3. [Frontend](#frontend)
   - [Struttura HTML](#struttura-html)
   - [Stili CSS](#stili-css)
   - [JavaScript](#javascript)
4. [Backend](#backend)
   - [Struttura del Progetto](#struttura-del-progetto)
   - [API REST](#api-rest)
   - [Modelli di Dati](#modelli-di-dati)
5. [Database](#database)
6. [Funzionalità Principali](#funzionalità-principali)
7. [Flusso dei Dati](#flusso-dei-dati)
8. [Gestione degli Errori](#gestione-degli-errori)
9. [Considerazioni sulla Sicurezza](#considerazioni-sulla-sicurezza)
10. [Installazione e Configurazione](#installazione-e-configurazione)
11. [Guida all'Uso](#guida-alluso)
12. [Test](#test)
13. [Manutenzione e Aggiornamenti](#manutenzione-e-aggiornamenti)
14. [Risoluzione dei Problemi](#risoluzione-dei-problemi)
15. [TODO e Miglioramenti](#todo-e-miglioramenti)
16. [Appendici](#appendici)

## Introduzione

Personal Finance Tracker è un'applicazione web per la gestione delle finanze personali. Permette agli utenti di tracciare entrate e uscite, categorizzare le transazioni, impostare budget e visualizzare report finanziari dettagliati.

## Architettura del Sistema

L'applicazione utilizza un'architettura client-server moderna:
- Frontend: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- Backend: Java Spring Boot 2.x
- Database: MySQL 8.0 (o altro database relazionale compatibile con JDBC)
- API: RESTful con scambio dati in formato JSON

## Frontend

### Struttura HTML

Il file principale `index.html` contiene la struttura della Single Page Application (SPA). I componenti principali includono:

- Header con il titolo dell'applicazione
- Sezione per l'inserimento di nuove transazioni
- Dashboard con riepilogo mensile e grafici
- Gestione delle categorie
- Lista delle transazioni
- Gestione del budget

### Stili CSS

Gli stili sono gestiti principalmente tramite Tailwind CSS, con classi utility applicate direttamente agli elementi HTML.

### JavaScript

Il frontend è organizzato in moduli JavaScript:

- `main.js`: Punto di ingresso dell'applicazione
- `dataManager.js`: Gestione dei dati e interazioni con il backend
- `uiManager.js`: Gestione dell'interfaccia utente
- `chartManager.js`: Creazione e aggiornamento dei grafici
- `transactionManager.js`: Logica per la gestione delle transazioni
- `categoryManager.js`: Logica per la gestione delle categorie
- `budgetManager.js`: Logica per la gestione dei budget
- `utils.js`: Funzioni di utilità

## Backend

### Struttura del Progetto

Il backend è sviluppato con Spring Boot e segue una struttura MVC:

- `controllers`: Gestiscono le richieste HTTP
- `services`: Contengono la logica di business
- `repositories`: Interfacce per l'accesso ai dati
- `models`: Definiscono le entità del dominio
- `dtos`: Oggetti di trasferimento dati per la comunicazione API
- `exceptions`: Gestiscono le eccezioni personalizzate
- `utils`: Contengono funzioni di utilità

### Componenti Principali

#### Controllers

1. `AnalyticsController`: Gestisce le richieste relative alle analisi finanziarie.
   - `/analytics/monthly`: Restituisce un riepilogo mensile.
   - `/analytics/yearly`: Restituisce un riepilogo annuale.

2. `CatsController`: Gestisce le operazioni CRUD per le categorie.
   - GET `/cats`: Recupera tutte le categorie.
   - POST `/cats`: Crea una nuova categoria.
   - DELETE `/cats/{id}`: Elimina una categoria.
   - GET `/catTypes`: Recupera tutti i tipi di categoria.

3. `MovsController`: Gestisce le operazioni CRUD per i movimenti.
   - GET `/movs`: Recupera tutti i movimenti con le relative categorie.
   - GET `/movs/{id}`: Recupera un movimento specifico.
   - POST `/movs`: Crea un nuovo movimento.
   - DELETE `/movs/{id}`: Elimina un movimento.

#### Services

1. `AnalyticsService`: Fornisce metodi per calcolare le analisi finanziarie.
2. `CatsService`: Gestisce la logica di business per le categorie.
3. `MovCatService`: Gestisce l'associazione tra movimenti e categorie.
4. `MovsService`: Gestisce la logica di business per i movimenti.

#### Repositories

1. `AnalyticsRepository`: Esegue query complesse per le analisi finanziarie.
2. `CatsRepository`: Gestisce le operazioni CRUD per le categorie nel database.
3. `CatTypeRepository`: Recupera i tipi di categoria dal database.
4. `MovCatRepository`: Gestisce l'associazione tra movimenti e categorie nel database.
5. `MovsRepository`: Gestisce le operazioni CRUD per i movimenti nel database.

#### DTOs (Data Transfer Objects)

1. `Cat`: Rappresenta una categoria.
2. `CatType`: Rappresenta un tipo di categoria.
3. `Mov`: Rappresenta un movimento finanziario.
4. `MovWithCat`: Rappresenta un movimento con le sue categorie associate.
5. `MovWithFullCat`: Rappresenta un movimento con dettagli completi delle categorie.
6. `MonthlyRecap`: Rappresenta un riepilogo finanziario mensile.

#### Eccezioni Personalizzate

Il progetto utilizza eccezioni personalizzate per gestire errori specifici, come `GetCatsException`, `PostMovException`, ecc. Queste eccezioni sono annotate con `@ResponseStatus` per restituire codici HTTP appropriati.

### Sicurezza

La classe `SecurityConfig` configura la sicurezza dell'applicazione. Attualmente, permette l'accesso a tutti gli endpoint senza autenticazione e disabilita la protezione CSRF. Questa configurazione è adatta solo per lo sviluppo e dovrebbe essere rafforzata per un ambiente di produzione.

### Flusso dei Dati

1. Le richieste HTTP vengono ricevute dai controller.
2. I controller delegano la logica di business ai servizi corrispondenti.
3. I servizi utilizzano i repository per interagire con il database.
4. I repository eseguono le query SQL utilizzando JdbcTemplate.
5. I dati vengono trasformati in DTOs e restituiti al client.

### Gestione delle Transazioni

Il metodo `postMovs` in `MovsService` è annotato con `@Transactional` per garantire l'atomicità delle operazioni di inserimento di un movimento e delle sue categorie associate.

### Logging

Il progetto utilizza SLF4J per il logging, con annotazioni `@Slf4j` sui componenti principali per facilitare il debugging e il monitoraggio.

### Considerazioni sulla Sicurezza

1. La configurazione attuale in `SecurityConfig` non è adatta per un ambiente di produzione.
2. È necessario implementare l'autenticazione e l'autorizzazione degli utenti.
3. La protezione CSRF dovrebbe essere abilitata in produzione.
4. Tutte le input dovrebbero essere validate e sanificate per prevenire attacchi di iniezione SQL e XSS.

### TODO e Miglioramenti

1. Implementare l'autenticazione e l'autorizzazione degli utenti.
2. Migliorare la gestione delle eccezioni e aggiungere più controlli di validazione.
3. Aggiungere test unitari e di integrazione per i componenti del backend.
4. Implementare la paginazione per le liste di movimenti e categorie.
5. Ottimizzare le query del database per migliorare le prestazioni.
6. Implementare il caching per ridurre il carico sul database.
7. Aggiungere supporto per le transazioni ricorrenti.
8. Implementare un sistema di notifiche per avvisi di budget e promemoria.
9. Migliorare la sicurezza generale dell'applicazione.

## Database

Il database relazionale contiene le seguenti tabelle principali:

- `categories`: Memorizza le categorie di transazioni
  - Colonne: `id`, `name`, `type_id`, `created_at`, `updated_at`
- `transactions`: Memorizza le transazioni finanziarie
  - Colonne: `id`, `amount`, `date`, `description`, `created_at`, `updated_at`
- `category_types`: Memorizza i tipi di categoria (es. entrata, uscita)
  - Colonne: `id`, `name`
- `transaction_categories`: Tabella di associazione molti-a-molti tra transazioni e categorie
  - Colonne: `transaction_id`, `category_id`

## Funzionalità Principali

1. Aggiunta e gestione di transazioni
2. Categorizzazione delle transazioni
3. Visualizzazione del riepilogo mensile
4. Grafici di andamento delle finanze
5. Gestione dei budget per categoria
6. Filtro e ricerca delle transazioni
7. Esportazione dei dati in formato CSV

## Flusso dei Dati

1. L'utente interagisce con l'interfaccia utente
2. Il JavaScript frontend gestisce l'interazione
3. Vengono effettuate chiamate API al backend
4. Il backend elabora la richiesta e interagisce con il database
5. La risposta viene inviata al frontend
6. Il frontend aggiorna l'interfaccia utente in base alla risposta

## Gestione degli Errori

L'applicazione implementa una robusta gestione degli errori:

1. Frontend:
   - Utilizza blocchi try-catch per gestire errori nelle chiamate API
   - Implementa un sistema di notifiche per visualizzare messaggi di errore user-friendly
   - Logga gli errori nella console per facilitare il debugging

2. Backend:
   - Utilizza un gestore di eccezioni globale per catturare e gestire tutti gli errori non gestiti
   - Restituisce risposte HTTP con codici di stato appropriati e messaggi di errore dettagliati
   - Implementa logging dettagliato per facilitare il troubleshooting

## Installazione e Configurazione

1. Clonare il repository
2. Configurare il database
3. Aggiornare `application.properties` con le credenziali del database
4. Eseguire `mvn spring-boot:run` per avviare il backend
5. Aprire `index.html` in un browser per il frontend

## Guida all'Uso

1. Aggiungere categorie di spesa e entrata
2. Inserire le transazioni quotidiane
3. Visualizzare il riepilogo mensile nella dashboard
4. Impostare budget per le categorie di spesa
5. Utilizzare i filtri per analizzare le transazioni

## Test

- Backend: Test unitari e di integrazione implementati con JUnit 5 e Mockito
- Frontend: Test unitari con Jest e test end-to-end con Cypress
- Implementare una pipeline CI/CD per eseguire automaticamente i test ad ogni commit

## Manutenzione e Aggiornamenti

- Utilizzare un sistema di gestione delle dipendenze (es. Maven per il backend, npm per il frontend) per facilitare gli aggiornamenti
- Implementare un sistema di monitoraggio delle prestazioni (es. Spring Boot Actuator, Prometheus)
- Configurare alert automatici per errori critici e problemi di performance
- Effettuare backup incrementali giornalieri e backup completi settimanali del database

## Risoluzione dei Problemi

- Controllare i log del server per errori backend
- Utilizzare la console del browser per debuggare il frontend
- Verificare la connessione al database in caso di errori di persistenza

## TODO e Miglioramenti

### Bug da Correggere

1. Gestione incoerente degli importi delle transazioni: standardizzare l'uso di importi positivi/negativi o flag booleani per entrate/uscite.
2. Potenziale condizione di gara nella funzione `loadData()`: rivedere la sequenza di caricamento dati e impostazione dei listener.
3. Gestione incompleta degli errori: implementare una gestione degli errori coerente per tutte le chiamate API.
4. Formattazione delle date incoerente: assicurare una formattazione coerente in tutta l'applicazione.

### Miglioramenti Proposti

1. Implementare l'autenticazione e l'autorizzazione degli utenti utilizzando Spring Security e JWT.
2. Aggiungere validazione degli input utilizzando Bean Validation sul backend e form validation sul frontend.
3. Implementare una gestione dello stato più robusta sul frontend utilizzando Redux o MobX.
4. Migliorare l'interfaccia utente con componenti React o Vue.js per una maggiore interattività.
5. Implementare il caching dei dati utilizzando Redis per migliorare le prestazioni.
6. Aumentare la copertura dei test, mirando a un minimo dell'80% per backend e frontend.
7. Implementare un sistema di logging centralizzato utilizzando ELK stack (Elasticsearch, Logstash, Kibana).
8. Aggiungere supporto per multiple valute utilizzando un servizio di conversione valuta in tempo reale.
9. Implementare funzionalità di backup e ripristino dei dati con crittografia.
10. Aggiungere supporto per transazioni ricorrenti con sistema di promemoria.
11. Implementare visualizzazioni dati avanzate utilizzando D3.js o Chart.js.
12. Aggiungere una funzionalità di ricerca full-text per transazioni e categorie utilizzando Elasticsearch.
13. Implementare la paginazione lato server per migliorare le prestazioni con grandi set di dati.
14. Aggiungere supporto per l'upload e l'archiviazione sicura di ricevute e documenti.
15. Implementare un sistema di notifiche push utilizzando WebSockets o server-sent events.
16. Aggiungere supporto multi-lingua utilizzando i18next o react-intl.
17. Implementare una modalità dark utilizzando CSS variables o un sistema di theming.
18. Aggiungere scorciatoie da tastiera per azioni comuni utilizzando una libreria come mousetrap.js.
19. Implementare funzionalità di importazione dati da formati comuni (CSV, OFX) e API bancarie.
20. Aggiungere una funzionalità per impostare e monitorare obiettivi finanziari con visualizzazioni progress.

## Appendici

- Diagramma ER del database (aggiungere link o immagine)
- Documentazione API dettagliata (considerare l'uso di Swagger/OpenAPI)
- Guida allo stile del codice (considerare l'uso di ESLint per JavaScript e Checkstyle per Java)
- Guida al contributo per sviluppatori esterni
- Registro delle modifiche (Changelog)