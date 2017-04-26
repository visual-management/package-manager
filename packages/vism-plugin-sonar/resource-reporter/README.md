# Violation reporter

SonarQube resource reporter.

<p align="center">
  <img alt="Resource repoter" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-sonar/assets/violation-reporter.png?raw=true" />
  <img alt="Resource repoter - On error" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-sonar/assets/violation-reporter-has-errors.png?raw=true" />
  <img alt="Resource repoter - With unit" src="https://github.com/ValentinGot/visual-management-pm/blob/master/packages/vism-plugin-sonar/assets/violation-reporter-has-unit.png?raw=true" />
</p>

## Configuration

### host

`string`

SonarQube host.

### projectId

`number`, defaults to `0`

Project ID to retrieve information from.

### name

`string`

Name to be displayed.

### unit

`string`

Unit to be displayed.

> Disclaimer
>
> If a unit is found on the API return, it will use this one instead of the given one.
> e.g: For **test_execution_time** metric, it will use the returned time unit (ms, s, ...).

### metric

`string`

One of the available SonarQube metrics.

Some on the available metrics can be found [here](https://docs.sonarqube.org/display/SONAR/Metric+definitions).

> Disclaimer
>
> SonarQube documentation on metrics seems not to be exhaustive, you can use {{SONAR_HOST}}/api/metrics to show all available metrics.

### onError

`number`, defaults to `0`

If the result is greater (or equal) than the given `onError` value, it will add the `has-error` class to your component.

Useful add some styles on error.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update counter at this time interval.
