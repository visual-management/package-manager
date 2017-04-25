# Violation reporter

SonarQube violation counter

<p align="center">
  <img alt="Violation repoter" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-sonar/assets/violation-reporter.png?raw=true" />
  <img alt="Violation repoter" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-sonar/assets/violation-reporter-has-errors.png?raw=true" />
</p>

## Configuration

### host

`string`

SonarQube host.

### projectId

`number`, defaults to `0`

Project ID to retrieve information from.

### violation

`string`, defaults to `blocker`

Violation to be retrieved.

Possible values: `blocker`, `critical`, `major`, `minor`, `info`

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update counter at this time interval.
        
