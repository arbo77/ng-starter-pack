export default {
  locale: 'id',
  err: null,
  page: {
    routes: {
      '/': 'index',
    },
    default: 'index',
    err404: '404',
    header: 'header',
    footer: 'footer',
  },
  db: {
    stores: [
      'account',
      'objects',
    ]
  }
}