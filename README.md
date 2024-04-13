# YouTube Playlist Generator

## Requirements

- Node.js >=18.17
- YouTube API Key

## How to get YouTube API Key
- Generate YouTube API Key at: https://console.cloud.google.com
- On apis/credentials find: Client ID and Client Secret and paste them on .env

## Generate token

Run the development server:

```bash
npm i
npm run dev
```

On another terminal execute:

```js
node src/services/generateNewToken.js
```

## Run

Use app on browser: `http://localhost:3000/`
