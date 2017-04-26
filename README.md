# visual-management-pm

Package manager & plugins list for [Visual Management](https://github.com/ValentinGot/visual-management).

## Usage

### Installation

```bash
npm install @visual-management/cli -g
# or
yarn global add @visual-management/cli
```

### Options

```bash
vism help
# or
vism help [command]
```

## How to install a new plugin ?

Just run the following:

```bash
vism add [plugin]
```

It will:

1. Download the new plugin via NPM
2. Register it in your reference file (see .visual-management.json in Visual Management project)

## Available plugins

* [@visual-management/plugin-clock](packages/vism-plugin-clock)
* [@visual-management/plugin-jenkins](packages/vism-plugin-jenkins)
* [@visual-management/sonar](packages/vism-plugin-sonar)
* [@visual-management/title](packages/vism-plugin-title)

## Contributing

## License

MIT License
