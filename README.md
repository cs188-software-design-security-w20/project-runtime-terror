Our mission is to bring people together through music and provide anyone a platform to express
themselves in their own music review blog. Become a music critic and see what others have to
say about top music.


### Technologies
* [React](https://reactjs.org/) - Frontend: JavaScript library for creating web apps!
* [node.js](http://nodejs.org) - evented I/O for the backend
* [Firebase](https://firebase.google.com/) - Backend: Database and Authorization


### Installation
Requires [node.js](https://nodejs.org/) to run.
Clone repository, install the dependencies and start the server.

```sh
$ git clone https://github.com/cs188-software-design-security-w20/project-runtime-terror
$ cd project-runtime-terror
$ npm install
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
    |   |   └── fbConfig.js # Firebase configuration
    │   ├── store
    |   |   ├── actions     # Backend methods used to communicate with Firebase
    |   |   |   ├── authActions.js  # User Authentication
    |   |   |   └── postActions.js  # Posts Database
    │   |   ├── reducers    # Backend reducers keeping track of state changes
    |   |   |   ├── authReducer.js  
    |   |   |   ├── postReducer.js 
    |   |   |   └── rootReducer.js  # Combines Other Reducers
    │   ├── App.js      # Main Component responsible for routing
    │   ├── index.css   # Main CSS File
    │   └── ...
    ├── README.md   # The file you are currently reading 
    └── ...
