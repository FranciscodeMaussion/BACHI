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

.controller('alumnosCtrl', ['$scope', '$stateParams', '$ionicModal', '$state', 'Auth', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $state, Auth) {
    $scope.firebaseUser= Auth.$getAuth();
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
      'id':0,
      'nombre':'',
      'entra':new Date(),
      'edad':0,
      'escolar':0,
    };
    var aux = window.localStorage.getItem("alumnos");
    if( aux != null){
      $scope.alumnos = JSON.parse(aux);
      $scope.form.id = aux[aux.length-1].id+1;
    }else{
      $scope.alumnos = [];
    }
    $scope.save = function(){
      $scope.alumnos.push($scope.form);
      window.localStorage.setItem("alumnos", JSON.stringify($scope.alumnos));
      $scope.form = {
        'id':0,
        'nombre':'',
        'entra':new Date(),
        'edad':0,
        'escolar':0,
      };
    };
}])

.controller('profesoresCtrl', ['$scope', '$stateParams', '$ionicModal',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal) {
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
      'id':0,
      'nombre':'',
      'entra':new Date(),
      'edad':0,
      'telefono':0,
    };
    var aux = window.localStorage.getItem("profesores");
    if( aux != null){
      $scope.profesores = JSON.parse(aux);
      $scope.form.id = aux[aux.length-1].id+1;
    }else{
      $scope.profesores = [];
    }
    $scope.save = function(){
      $scope.profesores.push($scope.form);
      window.localStorage.setItem("profesores", JSON.stringify($scope.profesores));
      $scope.form = {
        'id':0,
        'nombre':'',
        'entra':new Date(),
        'edad':0,
        'telefono':0,
      };
    };
}])

.controller('cuentaCtrl', ['$scope', 'Auth',
function ($scope, Auth) {
  $scope.firebaseUser= Auth.$getAuth();
  alert(JSON.stringify($scope.firebaseUser));
}])

.controller('entradasCtrl', ['$scope', '$stateParams', '$ionicModal', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal) {
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
      'id':0,
      'alumno':$stateParams.idAlumno,
      'fecha':new Date(),
      'profesor':'',
      'tareas':'',
      'observaciones':'',
    };
    var aux = window.localStorage.getItem("profesores");
    if( aux != null){
      $scope.profesores = JSON.parse(aux);
    }else{
      $scope.profesores = [];
    }
    aux = window.localStorage.getItem("entradas");
    if( aux != null){
      $scope.entradasServ = JSON.parse(aux);
      $scope.form.id = aux[aux.length-1].id+1;
    }else{
      $scope.entradasServ = [];
    }
    $scope.entradas = $scope.entradasServ.filter(function (items) {return items.id == $stateParams.idAlumno;});
    $scope.save = function(){
      var sentHelper = $scope.form;
      sentHelper.profesor = $scope.form.profesor.id;
      $scope.entradasServ.push(sentHelper);
      window.localStorage.setItem("profesores", JSON.stringify($scope.entradasServ));
      $scope.form = {
        'id':0,
        'alumno':$stateParams.idAlumno,
        'fecha':new Date(),
        'profesor':'',
        'tareas':'',
        'observaciones':'',
      };
    }
}])

.controller('alumnoCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
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
