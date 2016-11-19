angular.module('app.controllers', ['firebase'])

.controller("welcomeCtrl", function($scope, $firebaseAuth, $state, Auth, $cordovaToast) {
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
      $cordovaToast.showLongBottom('Se logueo correctamente.').then(function(success) {
        // success
      }, function (error) {
        // error
      });
      $scope.user = {
        'mail':'',
        'pass':''
      };
      Auth.$onAuthStateChanged(function(firebaseUser) {
        $scope.firebaseUser = firebaseUser;
      });
      $state.go('tabsController.alumnos');
    }).catch(function(error) {
      console.log(error);
      if (error.code == 'auth/user-not-found'){
        $cordovaToast.showLongBottom('El mail no pertenece a ningun usuario.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }
      if (error.code == 'auth/wrong-password'){
        $cordovaToast.showLongBottom('Contraseña incorrecta.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }
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
.controller('alumnosCtrl', ['$scope', '$stateParams', '$ionicModal', '$state', 'Auth', 'alumnos', '$cordovaToast', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, $state, Auth, alumnos, $cordovaToast) {
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
      $scope.form = {
        'nombre':'',
        'edad':0,
        'escolar':0,
      };
      $scope.mod = false;
    };
    $scope.goTo = function(idAlumno){
      console.log(idAlumno);
      $state.go('tabsController.entradas', {idAlumno: idAlumno});
    };
    $scope.editTo = function(idAlumno){
      console.log(idAlumno);
      var rec = $scope.alumnos.$getRecord(idAlumno);
      rec.entra = new Date(rec.entra);
      $scope.form = rec;
      $scope.mod = true;
      $scope.modal.show();
    };
    $scope.deleteAlumno = function(idAlumno){
      console.log(idAlumno);
      var rec = $scope.alumnos.$getRecord(idAlumno);
      $scope.alumnos.$remove(rec).then(function(resp) {
        console.log(resp);
        $cordovaToast.showLongBottom('Alumno eliminado correctamente').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
    };
    $scope.mod = false;
    $scope.form = {
      'nombre':'',
      'edad':0,
      'escolar':0,
    };
    $scope.save = function(){
      if($scope.mod){
        var helper = $scope.form
        $scope.alumnos.$save(helper);
        $cordovaToast.showLongBottom('Se modifico el alumno '+ helper.nombre +' correctamente.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }else{
        var helper = $scope.form
        $scope.alumnos.$add(helper);
        $cordovaToast.showLongBottom('Se creó el alumno correctamente.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }
      $scope.closeModal()
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
.controller('profesoresCtrl', ['$scope', '$stateParams', '$ionicModal', 'profesores', 'Auth', '$cordovaToast',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $ionicModal, profesores, Auth, $cordovaToast) {
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
      $scope.form = {
        'nombre':'',
        'edad':0,
        'telefono':0,
        'email':'',
        'uid_fire':'',
      };
      $scope.helper = {'password':''};
    };
    $scope.form = {
      'nombre':'',
      'edad':0,
      'telefono':0,
      'email':'',
      'uid_fire':'',
    };
    $scope.helper = {'password':''};
    $scope.save = function(){
      $scope.message = null;
      // Create a new user
      console.log($scope.helper.password);
      var helper = $scope.form;
      Auth.$createUserWithEmailAndPassword(helper.email, $scope.helper.password)
      .then(function(firebaseUser) {
        $scope.message = "User created with uid: " + firebaseUser.uid;
        $cordovaToast.showLongBottom('Se creó el profesor correctamente.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
        helper.uid_fire = firebaseUser.uid;
        $scope.profesores.$add(helper);
        $scope.closeModal();
        console.log($scope.message);
      }).catch(function(error) {
        $scope.message = error;
        $cordovaToast.showLongBottom(error).then(function(success) {
          // success
        }, function (error) {
          // error
        });
        console.log($scope.message);
      });
    };
}])

.controller('cuentaCtrl', ['$scope', 'Auth', 'profesores', '$state',
function ($scope, Auth, profesores, $state) {
  $scope.profesores = profesores;
  $scope.firebaseUser= Auth.$getAuth();
  $scope.logMeOut = function(){
    Auth.$signOut();
    document.location.href = 'index.html';
  }
  $scope.changePass = function(mail){
    Auth.$sendPasswordResetEmail(mail).then(function() {
      console.log("Password reset email sent successfully!");
      $cordovaToast.showLongBottom('Se envio un mail con link de restauración de contraseña.').then(function(success) {
        // success
      }, function (error) {
        // error
      });
    }).catch(function(error) {
      console.error("Error: ", error);
    });
  }
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
      $scope.form = {
        'fecha':new Date(),
        'profesor':'',
        'tareas':'',
        'observaciones':'',
      };
      $scope.mod = false;
    };
    $scope.deleteAlumno = function(idEntrada){
      console.log(idEntrada);
      var rec = $scope.alumnos.$getRecord(idEntrada);
      $scope.entradas.$remove(rec).then(function(resp) {
        console.log(resp);
        $cordovaToast.showLongBottom('Entrada eliminada correctamente').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      })
      .catch(function(error) {
        console.log("Error:", error);
      });
    };
    $scope.editTo = function(idEntrada){
      var rec = $scope.entradas.$getRecord(idEntrada);
      rec.fecha = new Date(rec.fecha);
      $scope.form = rec;
      $scope.mod = true;
      $scope.modal.show();
    };
    $scope.form = {
      'fecha':new Date(),
      'profesor':'',
      'tareas':'',
      'observaciones':'',
    };
    $scope.mod = false;
    $scope.save = function(){
      if($scope.mod){
        var helper =  $scope.form;
        helper.fecha = helper.fecha.toJSON();
        helper.profesor = helper.profesor.$id;
        $scope.entradas.$save(helper);
        $cordovaToast.showLongBottom('Se modifico la entrada.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      }else{
        var sentHelper = $scope.form;
        sentHelper.fecha = sentHelper.fecha.toJSON();
        sentHelper.profesor = sentHelper.profesor.$id;
        $scope.entradas.$add(sentHelper);
        $cordovaToast.showLongBottom('Se creó la entrada correctamente.').then(function(success) {
          // success
        }, function (error) {
          // error
        });
      };
      $scope.closeModal
    }
}])

// .controller('alumnoCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
//   var ref = firebase.database().ref().child('alumnos').child($stateParams.itemId);
//   console.log(ref);
//   var aux = JSON.parse(window.localStorage.getItem("alumnos"));
//   $scope.alumno = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];
//
//   $scope.delete = function(){
//     var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
//     window.localStorage.setItem("alumnos", JSON.stringify(aux));
//     $ionicHistory.goBack();
//   }
// }])
//
// .controller('profesorCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
//   var aux = JSON.parse(window.localStorage.getItem("profesores"));
//   $scope.profesor = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];
//
//   $scope.delete = function(){
//     var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
//     window.localStorage.setItem("profesores", JSON.stringify(aux));
//     $ionicHistory.goBack();
//   }
// }])
//
// .controller('entradaCtrl', ['$scope', '$stateParams', '$state', '$ionicHistory', '$ionicModal', function ($scope, $stateParams, $ionicModal, $state, $ionicHistory) {
//   var aux = JSON.parse(window.localStorage.getItem("entradas"));
//   $scope.entrada = aux.filter(function (items) {return items.id == $stateParams.itemId;})[0];
//   aux = JSON.parse(window.localStorage.getItem("alumnos"));
//   $scope.entrada.alumno = aux.filter(function (items) {return items.id == $scope.entrada.alumno;})[0];
//   aux = JSON.parse(window.localStorage.getItem("profesores"));
//   $scope.entrada.profesor = aux.filter(function (items) {return items.id == $scope.entrada.profesor;})[0];
//
//   $scope.delete = function(){
//     var aux = $scope.aux.filter(function (item) {return item.id !== parseInt($stateParams.itemId);});
//     window.localStorage.setItem("entradas", JSON.stringify(aux));
//     $ionicHistory.goBack();
//   }
// }])
