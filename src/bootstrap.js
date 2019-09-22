import module from './module'
import config from './config'
import moment from 'moment'

module.config(['$compileProvider', 'cfpLoadingBarProvider',
  function ($compileProvider, cfpLoadingBarProvider) {
    $compileProvider.debugInfoEnabled(false)
    cfpLoadingBarProvider.includeSpinner = false
  }
])

module.run(['$rootScope',
  function ($rootScope) {
    let self = $rootScope
    self.app = {
      path: window.location.pathname,
      page: config.page
    }

    window.moment = moment
    window.moment.locale(config.locale)
  }
])