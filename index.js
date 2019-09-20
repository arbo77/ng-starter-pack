import URL from 'url-pattern'
const m = require('./src/module');

module.exports = (config) => {
  m.default.controller('main', ['$rootScope', 'client', function ($rootScope, client) {
    let self = $rootScope;
  
    client.config = config

    self.me.get()
    self.now = moment()
    self.ddm = false;

    if (config.page.header) {
      self.header = config.template[config.page.header]
    }
  
    if (config.page.footer) {
      self.footer = config.template[config.page.footer]
    }
  
    self.$watch('app.path', (pathname) => {
      console.log(pathname)
      if (pathname === '/signout') {
        self.me.signout();
        return;
      }
      for (const url in config.page.routes) {
        const found = new URL(url).match(pathname)
        self.app.params = found || {}
        self.app.page = found ? config.page.routes[url] : config.page.default
        try {
          self.main = config.template[self.app.page]
        } catch (ex) {
          console.error(ex.message)
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

  return m
}