![Logo](admin/boschebike.png)
# ioBroker.boschebike

[![NPM version](http://img.shields.io/npm/v/iobroker.boschebike.svg)](https://www.npmjs.com/package/iobroker.boschebike)
[![Downloads](https://img.shields.io/npm/dm/iobroker.boschebike.svg)](https://www.npmjs.com/package/iobroker.boschebike)
![Number of Installations (latest)](https://iobroker.live/badges/boschebike-installed.svg)
![Number of Installations (stable)](https://iobroker.live/badges/boschebike-stable.svg)
[![Dependency Status](https://img.shields.io/david/gaudes/iobroker.boschebike.svg)](https://david-dm.org/gaudes/iobroker.boschebike)
![Test and Release](https://github.com/gaudes/ioBroker.boschebike/workflows/Test%20and%20Release/badge.svg)

[![NPM](https://nodei.co/npm/iobroker.boschebike.png?downloads=true)](https://nodei.co/npm/iobroker.boschebike/)

[Deutsche Beschreibung](#deutsch)
[English description](#english)


## <a name="deutsch"></a>Bosch eBike Adapter für ioBroker
Dieser Adapter für ioBroker verwendet die API von Bosch eBike Connect um Statistikdaten über die Nutzung des Bosch eBikes zu erhalten.

Analog zur Webseite von Bosch eBike Connect werden hierbei die Gesamtdaten, die Daten des aktuellen und letzten Monats sowie des Monats mit der höchsten Fahrleistung abgerufen.

Aufgrund der Integration des [Adapters SourceAnalytix](https://github.com/iobroker-community-adapters/ioBroker.sourceanalytix) werden diese Statistkdaten weiter aufbereitet. Hierüber sind dann exakte Wochen-, Monats- und Jahresdaten in ioBroker für eigene Auswertungen und zur Darstellung in VIS vorhanden.

Zusätzlich können optional Informationen zum Benutzer und zum eBike abgerufen werden.

### Konfiguration
In den Einstellungen des Adapters müssen hauptsächlich die Zugangsdaten für Bosch eBike Connect eingetragen werden.

Der Abruf der optionalen Daten (Informationen zu Benutzer und eBike) können aktiviert werden.

Das Intervall für den Abruf der Daten von Bosch eBike Connect kann eingestellt werden. Das Minimum sind 10 Minuten.

Sofern der [Adapter SourceAnalytix](https://github.com/iobroker-community-adapters/ioBroker.sourceanalytix) installiert ist, kann die Option zur Integration aktiviert werden.

## <a name="english"></a>Bosch eBike Adapter for ioBroker
This adapter for ioBroker uses the API of Bosch eBike Connect to receive statistic data about usage of the Bosch eBike.

Analog to the website of Bosch eBike Connect the totals, data of the current and last month and the month with the highest performance are received.

With integration of the [Adapter SourceAnalytix](https://github.com/iobroker-community-adapters/ioBroker.sourceanalytix) these statistic data are enhanced. Exactly data for weeks, months and years exist then in ioBroker and could be used for reporting and presentation in VIS.

Additionally optional informations about user and the eBike can be revceived.

## Configuration
In the adapter settings mainly the account data for Bosch eBike Connect has to be entered.

The receiving of the optional data (informations about user and eBike) can be activated.

The interval for conneting to Bosch eBike Connect can be configured, the minimum is 10 minutes.

The option for integration with the [adapter SourceAnalytix](https://github.com/iobroker-community-adapters/ioBroker.sourceanalytix) can be enabled when the adapter is installed.

### Getting started

You are almost done, only a few steps left:
1. Create a new repository on GitHub with the name `ioBroker.boschebike`
1. Initialize the current folder as a new git repository:  
	```bash
	git init
	git add .
	git commit -m "Initial commit"
	```
1. Link your local repository with the one on GitHub:  
	```bash
	git remote add origin https://github.com/gaudes/ioBroker.boschebike
	```

1. Push all files to the GitHub repo:  
	```bash
	git push origin master
	```
1. Add a new secret under https://github.com/gaudes/ioBroker.boschebike/settings/secrets. It must be named `AUTO_MERGE_TOKEN` and contain a personal access token with push access to the repository, e.g. yours. You can create a new token under https://github.com/settings/tokens.

1. Head over to [src/main.ts](src/main.ts) and start programming!

### Best Practices
We've collected some [best practices](https://github.com/ioBroker/ioBroker.repositories#development-and-coding-best-practices) regarding ioBroker development and coding in general. If you're new to ioBroker or Node.js, you should
check them out. If you're already experienced, you should also take a look at them - you might learn something new :)

### Scripts in `package.json`
Several npm scripts are predefined for your convenience. You can run them using `npm run <scriptname>`
| Script name | Description |
|-------------|-------------|
| `build:ts` | Compile the TypeScript sources. |
| `watch:ts` | Compile the TypeScript sources and watch for changes. |
| `watch` | Shortcut for `npm run watch:ts` |
| `test:ts` | Executes the tests you defined in `*.test.ts` files. |
| `test:package` | Ensures your `package.json` and `io-package.json` are valid. |
| `test:unit` | Tests the adapter startup with unit tests (fast, but might require module mocks to work). |
| `test:integration` | Tests the adapter startup with an actual instance of ioBroker. |
| `test` | Performs a minimal test run on package files and your tests. |
| `check` | Performs a type-check on your code (without compiling anything). |
| `lint` | Runs `ESLint` to check your code for formatting errors and potential bugs. |

### Writing tests
When done right, testing code is invaluable, because it gives you the 
confidence to change your code while knowing exactly if and when 
something breaks. A good read on the topic of test-driven development 
is https://hackernoon.com/introduction-to-test-driven-development-tdd-61a13bc92d92. 
Although writing tests before the code might seem strange at first, but it has very 
clear upsides.

The template provides you with basic tests for the adapter startup and package files.
It is recommended that you add your own tests into the mix.

### Publishing the adapter
Since you have chosen GitHub Actions as your CI service, you can 
enable automatic releases on npm whenever you push a new git tag that matches the form 
`v<major>.<minor>.<patch>`. The necessary steps are described in `.github/workflows/test-and-release.yml`.

To get your adapter released in ioBroker, please refer to the documentation 
of [ioBroker.repositories](https://github.com/ioBroker/ioBroker.repositories#requirements-for-adapter-to-get-added-to-the-latest-repository).

### Test the adapter manually on a local ioBroker installation
In order to install the adapter locally without publishing, the following steps are recommended:
1. Create a tarball from your dev directory:  
	```bash
	npm pack
	```
1. Upload the resulting file to your ioBroker host
1. Install it locally (The paths are different on Windows):
	```bash
	cd /opt/iobroker
	npm i /path/to/tarball.tgz
	```

For later updates, the above procedure is not necessary. Just do the following:
1. Overwrite the changed files in the adapter directory (`/opt/iobroker/node_modules/iobroker.boschebike`)
1. Execute `iobroker upload boschebike` on the ioBroker host

## Changelog
<!--
	Placeholder for the next version (at the beginning of the line):
	### __WORK IN PROGRESS__
-->

### 0.0.1
* (Gaudes) initial release

## License
MIT License

Copyright (c) 2020 Gaudes <ralf@gaudes.net>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.