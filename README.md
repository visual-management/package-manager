# visual-management-pm
Pack management for the visual management project

## Contributing

### Register plugin

To register plugin, add an entry into manifest.js with the following pattern :

```js
  {
    plugins: [
      {
        name: "my-new-plugin-folder"
      }
    ]
  };

```

### Create plugin

* Create folder with pattern `my-idea-plugin` with a `entry-point.js` that contain plugin description like 
```js
import CriticalReporter from "./critical-reporter/critical-reporter.component.vue"

export default {
  name      : 'Sonar plugin',
  components: [
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
```
* Then create one folder per component (e.g. : for sonar plugin, there is a graphical component for critical issues, one other for major issues...)
Each component will be instanciate with a config attribute composed with edited config from your `entry-point.js`

See example for more information.
