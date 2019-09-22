import angular from 'angular'
import 'angular-sanitize'
import 'angular-loading-bar'
import 'angular-loading-bar/build/loading-bar.min.css'
import Dexie from 'dexie'
import 'dexie-observable'

const module = angular.module('app', [
  'ngSanitize',
  'angular-loading-bar',
])

export default module

