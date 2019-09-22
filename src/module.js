import angular from 'angular'
import 'angular-sanitize'
import 'angular-loading-bar'
import 'angular-loading-bar/build/loading-bar.min.css'
import moment from 'moment'
import 'moment/locale/id'
import Dexie from 'dexie'
import 'dexie-observable'

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
    put: (params, callback) => {
      $http
        .post(
          $rootScope.config.http.url, {
          to: [],
          action: "objects.put",
          params: params
        }, {
          headers: {
            'Content-Type': 'application/json',
            'token': $rootScope.token || 'development',
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
            'token': $rootScope.token || 'development',
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

module.filter('moment', [function () {
  return function (input, format) {
    if (input) {
      return moment(input).format(format)
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

module.run(['$rootScope',
  function ($rootScope) {

    let $ = $rootScope;
    $.api = {
      sync: true,
    }
    $.data = {
      counter: 1,
    }

    const db = new Dexie("app");

    db.version(1).stores({
        objects: 'id, type'
    });

    db.on('changes', function (changes) {
      changes.forEach(function (change) {
        let key
        if(change.type === 1) {
          key = change.obj.type + "s"
        }else{
          key = change.oldObj.type + "s"
        }
        switch (change.type) {
          case 1: // CREATED
            if ($.data[key] === undefined) {
              $.data[key] = []
            }
            const isLive = (!$.api.sync || change.obj.id === undefined) && typeof $.api.put === 'function'
            if(!isLive){
              $.data[key].push(Object.assign(change.obj, {id: change.key}))
              $.$evalAsync()
            }else{
              if(change.obj.id === undefined) {
                $.api.put(change.obj, (resp)=>{
                  if(resp.id) {
                    db[change.table].delete(change.key)
                    db[change.table].put(resp)
                  }
                })
              }             
            }
            
            break;
          case 2: // UPDATED            
            $.data[key].forEach(el=>{
              if(el.id === change.key){
                Object.assign(el, change.obj)
                $.$evalAsync()

                if($.api.sync) {
                  $.api.put(change.obj, (resp)=>{
                  })
                }
                return;
              }
            })
            
            break;

          case 3: // DELETED
            $.data[key].forEach(el=>{
              if(el.id === change.key){
                const idx = $.data[key].indexOf(el)
                $.data[key].splice(idx,1)
                $.$evalAsync()

                if($.api.sync) {
                  $.api.del({
                    id: el.id
                  }, (resp)=>{
                  })
                }
                return;
              }
            })
            break;
        }
      })
    })
    
    db.open()

    db.objects.toArray().then(function(row){
      row.forEach(function(el){
        const key = el.type + "s"
        if ($.data[key] === undefined) {
          $.data[key] = []
        }
        $.data[key].push(el)
        $.$evalAsync()
      })
    })

    window.db = db;

    $.inc = function() {
      $.data.counter++;
    }
  }
])

module.run(['$rootScope',
  function ($rootScope ) {
    let self = $rootScope
    self.app = {
      path: window.location.pathname,
      page: config.page
    }
  
    window.moment = moment
    window.moment.locale(config.locale)
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

