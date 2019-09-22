import module from './module'
import moment from 'moment'
import 'moment/locale/id'

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
