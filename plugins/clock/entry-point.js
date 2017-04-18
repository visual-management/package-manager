import Clock from "./clock.component.vue"

export default {
  version    : '0.0.1',
  name       : 'Clock',
  id         : 'clock',
  description: `Display a configurable clock`,
  components : [
    {
      name         : 'Clock',
      tag          : 'clock',
      vue          : Clock,
      config       : {
        projectId: 0
      },
      defaultWidth : 2,
      defaultHeight: 1
    }
  ]
}
