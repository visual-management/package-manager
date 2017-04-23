import ViolationReporter from './violation-reporter/violation-reporter.component.vue'

export default {
  id         : 'sonar',
  name       : 'Sonar',
  description: `A set of components to show SonarQube rules`,
  components : [
    {
      name         : 'Violation reporter',
      tag          : 'violation-reporter',
      vue          : ViolationReporter,
      config       : {
        host          : '',
        projectId     : 0,
        violation     : 'blocker',
        updateInterval: 60000
      },
      defaultWidth : 1,
      defaultHeight: 1
    }
  ]
}
