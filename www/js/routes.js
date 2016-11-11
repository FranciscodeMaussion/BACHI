angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('welcome', {
    url: '/welcome',
    templateUrl: "templates/welcome.html",
    controller: 'welcomeCtrl',
  })

  .state('tabsController', {
    url: '/bachi',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.alumnos', {
    url: '/alumnos',
    views: {
      'alumnos': {
        templateUrl: 'templates/alumnos.html',
        controller: 'alumnosCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.profesores', {
    url: '/profesores',
    views: {
      'profesores': {
        templateUrl: 'templates/profesores.html',
        controller: 'profesoresCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.cuenta', {
    url: '/cuenta',
    views: {
      'cuenta': {
        templateUrl: 'templates/cuenta.html',
        controller: 'cuentaCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.entradas', {
    url: '/entradas:idAlumno',
    views: {
      'alumnos': {
        templateUrl: 'templates/entradas.html',
        controller: 'entradasCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.alumno', {
    url: '/alumno:itemId',
    views: {
      'alumnos': {
        templateUrl: 'templates/alumno.html',
        controller: 'alumnoCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.profesor', {
    url: '/profesor:itemId',
    views: {
      'profesores': {
        templateUrl: 'templates/profesor.html',
        controller: 'profesorCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

  .state('tabsController.entrada', {
    url: '/entrada:itemId',
    views: {
      'alumnos': {
        templateUrl: 'templates/entrada.html',
        controller: 'entradaCtrl',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireSignIn();
          }]
        }
      }
    }
  })

$urlRouterProvider.otherwise('/welcome')
});
