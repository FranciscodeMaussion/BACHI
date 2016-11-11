angular.module('app.controllers', ['firebase'])

.controller("welcomeCtrl", function($scope, $firebaseAuth, $state, Auth) {
  // $scope.googleSignIn = function(where){
  //   var auth = $firebaseAuth();
  //   // login
  //   auth.$signInWithPopup(where).then(function(firebaseUser) {
  //     console.log("Signed in as:", firebaseUser.uid);
  //   }).catch(function(error) {
  //     console.log("Authentication failed:", error);
  //     alert(JSON.stringify(error));
  //   });
  // }
  if (Auth.$getAuth() != null){
    $state.go('tabsController.alumnos');
  }else{
    console.log(Auth.$getAuth());
  }
  $scope.user = {
    'mail':'',
    'pass':''
  };
  $scope.logMeIn = function(){
    Auth.$signInWithEmailAndPassword($scope.user.mail, $scope.user.pass).then(function(firebaseUser) {
      console.log("Signed in as:", JSON.stringify(firebaseUser.uid));
      $scope.user = {
        'mail':'',
        'pass':''
      };
      Auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
      });
      $state.go('tabsController.alumnos');
    }).catch(function(error) {
      alert("Authentication failed:", JSON.stringify(error));
    });
  }
})
.factory("alumnos", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref().child('alumnos');

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])
.controller('alumnosCtrl', ['$scope', '$stateParams', '$ionicModal', '$state', 'Auth', 'alumnos', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $state, Auth, alumnos) {
    $scope.firebaseUser= Auth.$getAuth();
    $scope.alumnos = alumnos;
    console.log($scope.alumnos);
    $ionicModal.fromTemplateUrl('nuevoAlumno.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    $scope.goTo = function(idAlumno){
      console.log(idAlumno);
      $state.go('tabsController.entradas', {idAlumno: idAlumno});
    };
    $scope.form = {
      'nombre':'',
      'entra':new Date(),
      'edad':0,
      'escolar':0,
    };
    $scope.save = function(){
      $scope.form.entra = $scope.form.entra.toJSON();
      $scope.alumnos.$add($scope.form);
      $scope.form = {
        'nombre':'',
        'entra':new Date(),
        'edad':0,
        'escolar':0,
      };
    };
}])
.factory("profesores", ["$firebaseArray",
  function($firebaseArray) {
    // create a reference to the database location where we will store our data
    var ref = firebase.database().ref().child('profesores');

    // this uses AngularFire to create the synchronized array
    return $firebaseArray(ref);
  }
])
.controller('profesoresCtrl', ['$scope', '$stateParams', '$ionicModal', 'profesores', 'Auth',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, profesores, Auth) {
    $scope.profesores = profesores;
    $ionicModal.fromTemplateUrl('nuevoProfesor.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    $scope.form = {
      'nombre':'',
      'entra':new Date(),
      'edad':0,
      'telefono':0,
      'email':'@gmail.com',
    };
    $scope.password = "6caracteres";
    $scope.save = function(){
      $scope.message = null;
      $scope.form.entra = $scope.form.entra.toJSON();
      // Create a new user
      Auth.$createUserWithEmailAndPassword($scope.form.email, $scope.password)
      .then(function(firebaseUser) {
        $scope.message = "User created with uid: " + firebaseUser.uid;
        $scope.profesores.$add($scope.form);
        console.log($scope.message);
      }).catch(function(error) {
        $scope.message = error;
        console.log($scope.message);
      });
      $scope.form = {
        'nombre':'',
        'entra':new Date(),
        'edad':0,
        'telefono':0,
        'email':'@gmail.com',
      };
      $scope.password = "6caracteres";
    };
}])

.controller('cuentaCtrl', ['$scope', 'Auth',
function ($scope, Auth) {
  $scope.firebaseUser= Auth.$getAuth();
}])

.controller('entradasCtrl', ['$scope', '$stateParams', '$ionicModal', 'Auth', '$firebaseArray', 'profesores', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, Auth, $firebaseArray, profesores) {
    $scope.firebaseUser= Auth.$getAuth();
    var ref = firebase.database().ref().child('entradas/'+$stateParams.idAlumno);
    $scope.entradas = $firebaseArray(ref);
    $scope.profesores = profesores;
    $ionicModal.fromTemplateUrl('nuevaEntrada.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });
    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };
    $scope.form = {
      'fecha':new Date(),
      'profesor':'',
      'tareas':'',
      'observaciones':'',
    };
    $scope.save = function(){
      $scope.form.fecha = $scope.form.fecha.toJSON();
      var sentHelper = $scope.form;
      sentHelper.profesor = $scope.form.profesor.$id;
      $scope.entradas.$add(sentHelper);
      $scope.form = {
        'fecha':new Date(),
        'profesor':'',
        'tareas':'',
        'observaciones':'',
      };
    }
}])

.controller('alumnoCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
  var ref = firebase.database().ref().child('alumnos').child($stateParams.itemId);
  console.log(ref);
  var aux = JSON.parse(window.localStorage.getItem("alumnos"));
  $scope.alumno = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];

  $scope.delete = function(){
    var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
    window.localStorage.setItem("alumnos", JSON.stringify(aux));
    $ionicHistory.goBack();
  }
}])

.controller('profesorCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
  var aux = JSON.parse(window.localStorage.getItem("profesores"));
  $scope.profesor = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];

  $scope.delete = function(){
    var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
    window.localStorage.setItem("profesores", JSON.stringify(aux));
    $ionicHistory.goBack();
  }
}])

.controller('entradaCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
  var aux = JSON.parse(window.localStorage.getItem("entradas"));
  $scope.entrada = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];
  aux = JSON.parse(window.localStorage.getItem("alumnos"));
  $scope.entrada.alumno = aux.filter(function (items) {return items.id == $scope.entrada.alumno;})[0];
  aux = JSON.parse(window.localStorage.getItem("profesores"));
  $scope.entrada.profesor = aux.filter(function (items) {return items.id == $scope.entrada.profesor;})[0];

  $scope.delete = function(){
    var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
    window.localStorage.setItem("entradas", JSON.stringify(aux));
    $ionicHistory.goBack();
  }
}])
