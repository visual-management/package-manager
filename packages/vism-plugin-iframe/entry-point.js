import iframe from './iframe.vue'

export default {
  id         : 'iframe',
  name       : 'iframe',
  description: `Show whatever url you want in an iframe`,
  components : [
    {
      name         : 'iframe',
      tag          : 'iframe',
      vue          : iframe,
      config       : {
        url: ''
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
