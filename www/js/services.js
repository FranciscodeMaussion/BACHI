angular.module('app.services', [])

.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    return $firebaseAuth();
  }
])

.factory("alumnos", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref().child('alumnos');

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])

.factory("profesores", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref().child('profesores');

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])

.factory("entradas", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref().child('entradas');

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])
;
