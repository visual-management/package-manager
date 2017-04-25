import ResourceReporter from './resource-reporter/resource-reporter.vue';
import ViolationReporter from './violation-reporter/violation-reporter.component.vue';

export default {
  id         : 'sonar',
  name       : 'Sonar',
  description: `A set of components to show SonarQube rules`,
  components : [
    {
      name         : 'Resource reporter',
      tag          : 'resource-reporter',
      vue          : ResourceReporter,
      config       : {
        host          : '',
        projectId     : 0,
        name          : '',
        unit          : '',
        metric        : '',
        onError       : 0,
        updateInterval: 60000
      },
      defaultWidth : 2,
      defaultHeight: 2
    },
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
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
