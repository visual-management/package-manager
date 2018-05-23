# iPMP - Status List

<p align="center">
  <img alt="iPMP - Status List" src="/plugins/visual-management-plugin-ipmp/assets/status-list.png" />
</p>

<p align="center">Show the number of <strong>minor</strong>, <strong>major</strong> and <strong>blocking</strong> issues for an iPMP project.</p>

---

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

### updateInterval

`number` (in milliseconds), defaults to `60000`

Update component info at this time interval.

### showCriticty

`{none: boolean, minor: boolean, major: boolean, blocking: Blocking}`, defaults to `{none: false, minor: true, major: true, blocking: true}`

Choose which criticity should be displayed.

### projects²

`Array<{id: number, name: string, ignoreTypes: Array<string>, ignoreStatuses: Array<string>}>`

#### projects.id

`number`

iPMP project ID.

#### projects.name

`string`

Name of the project to be displayed.

#### projects.ignoreTypes

`Array<string>`

When calculating the number of issues, these types will be ignored.

See iPMP's **type de ticket** for available types.

#### projects.ignoreStatuses

`Array<string>`

When calculating the number of issues, these statuses will be ignored.

See iPMP's **état** for available types.
