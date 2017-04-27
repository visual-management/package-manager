import ResourceReporter from './resource-reporter/resource-reporter.vue';

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
    }
  ]
}
