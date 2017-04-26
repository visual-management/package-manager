import Job from './job/job.vue'

export default {
  id         : 'jenkins',
  name       : 'Jenkins',
  description: `A set of components for Jenkins`,
  components : [
    {
      name         : 'Job',
      tag          : 'job',
      vue          : Job,
      config       : {
        host          : '',
        username      : '',
        apiToken      : '',
        job           : '',
        name          : '',
        updateInterval: 60000
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
