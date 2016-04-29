# monfig
Environment aware, asynchronous, folder based config building

### API
This package is basically the way [Sails.js](http://sailsjs.org/) does its configuration.
See their docs to get a more in depth look at how the folder structure and naming decides the config objects structure.

[Sails.js Config docs](http://sailsjs.org/documentation/concepts/configuration)

#### monfig.build(options):Promise\<Object\>
```javascript
import {build} from "monfig"

build({ basePath: "./config", env: process.env.NODE_ENV })
  .then((config) => {
    // config == {
    //   "reddis": {
    //     "url": "productionurl"
    //   },
    //   "facebook": {
    //     "apikey": "prodkey"
    //   }
    // }
  })
```

#### Async config

/config/foo.js
```javascript
import fetch from 'isomorphic-fetch'

export default async function factory() {
  const response = await fetch('192.168.1.13:1337/foo.json')
  // response == {
  //   "bar": "lol"
  // }
  return response.json()
}
```

app.js
```javascript
import {build} from "monfig"

export default async function init() {
  const config = await build({ basePath: "./config", env: process.env.NODE_ENV })
  // config == {
  //   "foo": {
  //     "bar": "lol"
  //   }
  // }
}
```
