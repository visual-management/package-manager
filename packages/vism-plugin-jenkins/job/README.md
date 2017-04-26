# Job

Show a job state.

When a job is running, a blink animation is showed (through the `.blink` class).

<p align="center">
  <img alt="Job state" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-jenkins/assets/job-state.png?raw=true" />
</p>

## Configuration

### host

`string`

Jenkins host.

### username

`string`

Jenkins username. We can use it when an authentication to the API is needed.

### apiToken

`string`

Jenkins token for the API. We can use it when an authentication to the API is needed.

### job
        
`string`

Job identifier.

### name

`string`

Name to be displayed.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update counter at this time interval.
