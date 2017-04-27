import Clock from './clock.vue'

export default {
  id         : 'clock',
  name       : 'Clock',
  description: `Display a configurable clock`,
  components : [
    {
      name         : 'Clock',
      tag          : 'clock',
      vue          : Clock,
      defaultWidth : 8,
      defaultHeight: 3
    }
  ]
}
