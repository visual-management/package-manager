# Jobs list

Show a jobs list and there current state.

When a job is running, a blink animation is showed (through the `.blink` class).

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

### jobs
        
`Object{id: string, name: string}`

Jobs information.

### showSuccessful

`boolean`, defaults to `false`

Whether to show successful builds or not.

### paginationInterval

`number` (in milliseconds), defaults to `5000`

Switch page at this time interval.

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update jobs info at this time interval.
