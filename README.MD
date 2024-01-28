# audio-capture-to-text-example

An example of recording audio in a web page and transcribing to text using Open AI.

This is a next step in my learning how to control a chatbot with your voice.

If you like this project, please star this repo and [support my work](https://www.codecapers.com.au/about#support-my-work)

## Setup

You need [Node.js](https://nodejs.org/en/) installed to use this code.

You need an Open AI account and your API key.

Install depdnencies:

```bash
cd audio-capture-to-text-example
npm install
```

Set your Open AI open key before start the web server:

```bash
set OPENAI_API_KEY=<your-api-key>
```

## Serve the web page with live reload

```bash
npm start
```

Open a browser and navigate to [http://localhost:1234/](http://localhost:1234/).

## Build the static web page

```bash
npm run build
```

The static web page is output to the `dist` subdirectory.

## Build the TypeScript code

Do this if you want to check for compile errors.

```bash
npm run compile
```
