# candy-vue

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Firebse storage CORS origins config

* Open [google clound console](https://console.cloud.google.com/home/dashboard)
* Upload cors.json file (The file can be found here `env/cors.json`)
* Run ` gsutil cors set cors.json gs://you-app.appspot.com ` to update CORS configuration
