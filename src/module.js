import angular from 'angular'
import 'angular-sanitize'
import 'angular-filter'
import 'angular-loading-bar'
import 'angular-loading-bar/build/loading-bar.min.css'

const module = angular.module('app', [
  'ngSanitize',
  'angular-loading-bar',
  'angular.filter',
])

export default module

