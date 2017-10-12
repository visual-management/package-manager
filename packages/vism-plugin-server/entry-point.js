import Health from './health/health.vue'

export default {
  id         : 'server',
  name       : 'Server',
  description: `Show some information about servers`,
  components : [
    {
      name         : 'Health',
      tag          : 'health',
      vue          : Health,
      config       : {
        urls           : [
          {
            name: '',
            url : ''
          }
        ],
        showWorkingUrls: false,
        updateInterval : 60000
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
