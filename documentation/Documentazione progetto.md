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

Personal Finance Tracker è un'applicazione web per la gestione delle finanze personali. Permette agli utenti di tracciare entrate e uscite, categorizzare le transazioni, impostare budget e visualizzare report finanziari.

## Architettura del Sistema

L'applicazione utilizza un'architettura client-server:
- Frontend: HTML, CSS (Tailwind), JavaScript
- Backend: Java Spring Boot
- Database: MySQL (o altro database relazionale)

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

### API REST

Le principali API esposte sono:

- `/cats`: CRUD per le categorie
- `/movs`: CRUD per le transazioni
- `/catTypes`: Recupero dei tipi di categoria

### Modelli di Dati

- `Category`: Rappresenta una categoria di transazione
- `Transaction`: Rappresenta una singola transazione
- `CategoryType`: Rappresenta il tipo di una categoria (entrata, uscita, entrambi)

## Database

Il database contiene le seguenti tabelle principali:

- `categories`: Memorizza le categorie
- `transactions`: Memorizza le transazioni
- `category_types`: Memorizza i tipi di categoria

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

L'applicazione implementa la gestione degli errori sia sul frontend che sul backend:

1. Frontend: Utilizza blocchi try-catch e visualizza notifiche per gli errori
2. Backend: Utilizza la gestione delle eccezioni e restituisce codici di stato HTTP appropriati

## Considerazioni sulla Sicurezza

L'implementazione attuale non mostra misure di sicurezza. È cruciale implementare:

1. Autenticazione e autorizzazione
2. Validazione e sanificazione degli input
3. Protezione CSRF
4. Comunicazione sicura (HTTPS)

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

- I test unitari per il backend sono nella cartella `src/test`
- I test frontend possono essere eseguiti manualmente o attraverso framework come Jest

## Manutenzione e Aggiornamenti

- Aggiornare regolarmente le dipendenze del progetto
- Monitorare le prestazioni del database
- Effettuare backup regolari dei dati

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

1. Implementare l'autenticazione e l'autorizzazione degli utenti.
2. Aggiungere la validazione degli input sia sul frontend che sul backend.
3. Implementare una gestione dello stato più robusta (es. utilizzando Redux).
4. Migliorare l'interfaccia utente con elementi più interattivi e design responsive.
5. Implementare il caching dei dati per migliorare le prestazioni.
6. Aggiungere test unitari e di integrazione.
7. Implementare un sistema di logging per il debugging e il monitoraggio.
8. Aggiungere il supporto per multiple valute e conversione.
9. Implementare funzionalità di backup e ripristino dei dati.
10. Aggiungere supporto per transazioni ricorrenti.
11. Implementare visualizzazioni dati aggiuntive (es. grafici a torta per le categorie di spesa).
12. Aggiungere funzionalità di ricerca per transazioni e categorie.
13. Implementare la paginazione per la lista delle transazioni.
14. Aggiungere supporto per l'allegamento di ricevute o documenti alle transazioni.
15. Implementare un sistema di notifiche per avvisi di budget e promemoria di fatture in scadenza.
16. Aggiungere supporto multi-lingua per l'internazionalizzazione.
17. Implementare una modalità dark per una migliore esperienza utente in condizioni di scarsa illuminazione.
18. Aggiungere scorciatoie da tastiera per azioni comuni.
19. Implementare funzionalità di importazione dati da estratti conto bancari o altre app finanziarie.
20. Aggiungere una funzionalità per impostare e monitorare obiettivi finanziari.

## Appendici

- Diagramma ER del database
- Documentazione API dettagliata
- Guida allo stile del codice