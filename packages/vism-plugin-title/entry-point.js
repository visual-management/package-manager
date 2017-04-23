import Title from './title.component.vue'

export default {
  id         : 'title',
  name       : 'Title',
  description: `Display a title`,
  components : [
    {
      name         : 'Title',
      tag          : 'title-cmpt',
      vue          : Title,
      config       : {
        title  : 'A title',
        classes: [],
        align  : 'center center'
      },
      defaultWidth : 4,
      defaultHeight: 1
    }
  ]
}
