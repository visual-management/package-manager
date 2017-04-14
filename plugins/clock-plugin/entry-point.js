import Clock from "./clock.component.vue"

export default {
  name      : 'Clock Plugin',
  id        : 'clock-plugin',
  components: [
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
