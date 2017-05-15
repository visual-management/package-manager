import Job from './job/job.vue'
import JobsList from './jobs-list/job-list.vue'

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
    },
    {
      name         : 'Jobs list',
      tag          : 'jobs-list',
      vue          : JobsList,
      config       : {
        host          : '',
        username      : '',
        apiToken      : '',
        jobs          : [],
        updateInterval: 60000
      },
      defaultWidth : 4,
      defaultHeight: 2
    }
  ]
}
