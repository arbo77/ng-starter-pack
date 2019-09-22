import module from './module'
import './bootstrap'
import './directive'
import './filter'
import './controller'

const loader = (config) => {
  module.factory('config', [function(){
    return config
  }])
  return module
}

export default {
  start: loader,
  module: module,
};