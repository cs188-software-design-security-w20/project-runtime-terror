Our mission is to bring people together through music and provide anyone a platform to express
themselves in their own music review blog. Become a music critic and see what others have to
say about top music.


### Technologies
* [React](https://reactjs.org/) - Frontend: JavaScript library for creating web apps!
* [node.js](http://nodejs.org) - Evented I/O for the backend
* [Firebase](https://firebase.google.com/) - Backend: Database and Authorization
* [Spotify Web API](https://developer.spotify.com/documentation/web-api/) - For authenticating and integrating with Spotify
* [Semantic UI](https://react.semantic-ui.com/) - Frontend Framework


### Installation / Usage
Requires [node.js](https://nodejs.org/) to run.\
Tested on latest versions of Chrome and Firefox. If it doesn't work on your browser, try using one of those.  
We have two ways of running our web application: 1) accessing it via webpage, or 2) running locally.\
It is recommended to use method 1 as it represents our software as it would be during production.\
Method 2 is provided as backup in case method 1 is unavailable or a feature is unusable.

**Preferred Method** (master branch)  
Access via Website: https://princes25.github.io/Mutter/


**Backup Method** (localhost branch)\
This method provides API keys so that you don't have to setup your own database. However, this database is only for developmental purposes and thus differs from the one used in production. This method also uses a local Spotify server which constantly listens to authorization requests on port 8888.

Clone repository and run the script
```sh
$ git clone -b localhost https://github.com/cs188-software-design-security-w20/project-runtime-terror
$ cd project-runtime-terror
$ ./run.sh
```

**OR**

1) Clone and install dependencies
    ```sh
    $ git clone -b localhost https://github.com/cs188-software-design-security-w20/project-runtime-terror
    $ cd project-runtime-terror
    $ npm install
    ```

2) Run Spotify Server
    ```sh
    $ cd spotify_server
    $ npm install
    $ cd authorization_code
    $ node app.js
    ```

3) Run App
    ```sh
    $ cd ../..
    $ npm start
    ```


### Team
* Shabnam Bahmanyar
* Henry Bui
* Brian Du
* Tejas Kasturi
* Prabhjot Singh


### Directory Structure
    project-runtime-terror
    ├── ...
    ├── spotify_server      # Spotify Auhentication Server
    │   └── ...
    ├── src
    │   ├── components      # All frontend components used to display web pages 
    |   |   ├── ...
    |   |   ├── discover            # Discover Page
    |   |   ├── feed                # Feed Page
    |   |   ├── layout              # Login and Navbar
    |   |   ├── profile             # Profile Page
    |   |   ├── 404.js              # 404 Status Page 
    |   |   ├── createPost.js       # Create Post Page
    |   |   └── ...
    │   ├── config
    |   |   └── fbConfig.js         # Firebase configuration
    │   ├── store
    |   |   ├── actions             # Backend methods used to communicate with Firebase
    |   |   |   ├── authActions.js  # User Authentication
    |   |   |   └── postActions.js  # Posts Database
    │   |   ├── reducers            # Backend reducers keeping track of state changes
    |   |   |   ├── authReducer.js  
    |   |   |   ├── postReducer.js 
    |   |   |   └── rootReducer.js  # Combines Other Reducers
    │   ├── App.js      # Main Component responsible for routing
    │   ├── index.css   # Main CSS File
    │   └── ...
    ├── README.md       # The file you are currently reading
    ├── run.sh          # Bash script to run the web application
    └── ...
