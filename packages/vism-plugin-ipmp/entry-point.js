import Status from './status/status.vue'
import StatusList from './status-list/status-list.vue'

export default {
  id         : 'ipmp',
  name       : 'iPMP',
  description: 'A set of components for iPMP',
  components : [
    {
      name         : 'Status',
      tag          : 'status',
      vue          : Status,
      config       : {
        host          : '',
        username      : '',
        password      : '',
        card          : {
          width : 160,
          height: 160
        },
        values        : [
          {
            name  : 'A traiter',
            type  : 'status',
            status: [
              'recorded',
              'qualified',
              'accepted',
              'pending',
              're-opened'
            ]
          },
          {
            name  : 'EC correction',
            type  : 'status',
            status: [
              'in progress'
            ]
          },
          {
            name  : 'Livrés',
            type  : 'status',
            status: [
              'delivered'
            ]
          },
          {
            name  : 'Closed',
            type  : 'status',
            status: [
              'closed',
              'cancelled'
            ]
          },
          {
            name: 'Evolutions',
            type: 'count_evolution'
          }
        ],
        updateInterval: 60000
      },
      defaultWidth : 2,
      defaultHeight: 2
    },
    {
      name         : 'Status list',
      tag          : 'status-list',
      vue          : StatusList,
      config       : {
        host          : '',
        username      : '',
        password      : '',
        showCriticty  : {
          none    : false,
          minor   : true,
          major   : true,
          blocking: true
        },
        projects      : [
          {
            id            : 0,
            name          : '',
            ignoreTypes   : [],
            ignoreStatuses: []
          }
        ],
        updateInterval: 60000
      },
      defaultWidth : 2,
      defaultHeight: 2
    }
  ]
}
