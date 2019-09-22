import module from './module'

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
