import angular from 'angular'
import 'angular-sanitize'
import 'angular-loading-bar'
import 'angular-loading-bar/build/loading-bar.min.css'
import moment from 'moment';
import config from './config';

function cleanUpObject(o) {
  return JSON.parse(JSON.stringify(o))
}

const module = angular.module('app', [
  'ngSanitize',
  'angular-loading-bar',
])

module.factory('client', ['$http', '$rootScope', function ($http, $rootScope) {
  return {
    http: {
      get: (url, callback) => {
        $http
          .get(url)
          .then(resp => resp.data)
          .then(resp => {
            typeof callback === 'function' && callback(resp)
          })
      },
      post: (url, params, callback) => {
        $http
          .post(url, params, {
            headers: config.http.headers
          })
          .then(resp => resp.data)
          .then(resp => {
            typeof callback === 'function' && callback(resp)
          })
      }
    },
    api: (action, params, callback) => {
      $http
        .post(
          config.http.url, {
          to: [],
          action: action,
          params: params
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': $rootScope.me.token || 'development',
          }
        })
        .then(resp => resp.data)
        .then(resp => {
          if (resp.status) {
            typeof callback === 'function' && callback(resp.response.data)
          } else {
            $rootScope.err = resp.message
          }
        })
    }
  }
}])

module.filter('fromNow', [function () {
  return function (input) {
    if (input) {
      return moment(input).fromNow()
    } else {
      return '-'
    }
  }
}])

module.directive('href', ['$rootScope', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      if (attrs.target) {
        if (element[0].tagName == 'A' && attrs.target.substr(0, 1) === '@') {
          element.on('click', (e) => {
            e.preventDefault()
            window.history.pushState(null, null, attrs.href)
            $rootScope.ddm = false
            $rootScope.app.path = attrs.href
            $rootScope.$evalAsync()
          })
        }
      }
    }
  }
}])

module.directive('render', ['$compile', function ($compile) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      scope.$watch(
        function (scope) {
          return scope.$eval(attrs.render);
        },
        function (value) {
          element.html(value && value.toString());
          var compileScope = scope;
          if (attrs.bindHtmlScope) {
            compileScope = scope.$eval(attrs.bindHtmlScope);
          }
          $compile(element.contents())(compileScope);
        }
      )
    } 
  }
}])

module.config(['$compileProvider', 'cfpLoadingBarProvider',
  function ($compileProvider, cfpLoadingBarProvider) {
    $compileProvider.debugInfoEnabled(false)
    cfpLoadingBarProvider.includeSpinner = false
  }
])

module.run(['$rootScope','client',
  function ($rootScope, client) {
    let self = $rootScope
    self.app = {
      path: window.location.pathname,
      page: config.page
    }
    
    moment.locale(config.locale)
    window.moment = moment
    self.me = {
      get: (callback) => {
      },
      signout: () => {
        var req = indexedDB.deleteDatabase('app')
        req.onsuccess = function(){
          window.location.href = '/'
        }
        req.onerror = function(){
          window.location.href = '/'
        }
        req.onblocked = function(){
          window.location.href = '/'
          console.log("Couldn't delete database due to the operation being blocked");
        }
      },
      set: ()=>{

      },
    }
  }
])

export default module

