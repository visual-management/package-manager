# Status

Count the number of tickets for a specific status.

## Configuration

### host

`string`

iPMP host.

### username

`string`

iPMP username.

### password

`string`

iPMP password.

### card

`Object{width: number, height: number}`, defaults to `{width: 160, height: 160}`

Width & height of a status card.

### values

`Array<{name: string, type: string, status?: Array<string>}>`

- **name**: name that should be displayed on the card
- **type**: `status` or `count_evolution`
- **status** (optional): if type equals `status`, the list of status to be used for the counting

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update count at this time interval.
