import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var firebaseConfig = {
  apiKey: 'AIzaSyDTyO_vlEvK4gOnd97iBXCfrJz9vbEeVFU',
  authDomain: 'badboys-slack.firebaseapp.com',
  databaseURL: 'https://badboys-slack.firebaseio.com',
  projectId: 'badboys-slack',
  storageBucket: 'badboys-slack.appspot.com',
  messagingSenderId: '1042775734656',
  appId: '1:1042775734656:web:ef6c57c085757240e22965',
  measurementId: 'G-KNZ8TYH2KP',
};

firebase.initializeApp(firebaseConfig);

export default firebase;
