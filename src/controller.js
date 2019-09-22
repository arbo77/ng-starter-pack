import module from './module'
import URL from 'url-pattern'

module.controller('main', ['$rootScope', 'config', function ($rootScope, config) {
  let self = $rootScope;
  self.now = moment()
  self.ddm = false;

  if (config.page.header) {
    self.header = config.template[config.page.header]
  }

  if (config.page.footer) {
    self.footer = config.template[config.page.footer]
  }

  function loadFromPage(pathname) {
    const page = pathname.split('/')[1]
    if(config.template[page]) {
      return page
    }else{
      return config.page.default
    }
  }
  self.$watch('app.path', (pathname) => {
    for (const url in config.page.routes) {
      const found = new URL(url).match(pathname)
      self.app.params = found || {}
      self.app.page = found ? config.page.routes[url] : loadFromPage(pathname)
      try {
        self.main = config.template[self.app.page]
      } catch (ex) {
        self.main = config.template[self.app.default]
      }
      window.scrollTo(0, 0)
      if (found) break;
    }
  })

  window.addEventListener('popstate', (e) => {
    self.app.path = window.location.pathname
    self.$evalAsync()
  })
}])