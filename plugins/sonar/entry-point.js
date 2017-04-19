import CriticalReporter from "./critical-reporter/critical-reporter.component.vue"

export default {
  version    : '0.0.1',
  name       : 'Sonar',
  id         : 'sonar',
  description: `List of components to show SonarQube rules`,
  components : [
    {
      name         : 'Critical reporter',
      tag          : 'critical-reporter',
      vue          : CriticalReporter,
      config       : {
        projectId: 0
      },
      defaultWidth : 1,
      defaultHeight: 1
    }
  ]
}
