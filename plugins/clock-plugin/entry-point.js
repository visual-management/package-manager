import Clock from "./clock.component.vue"

export default {
  name       : 'Clock Plugin',
  id         : 'clock-plugin',
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
