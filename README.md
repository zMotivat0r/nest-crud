<div align="center">
  <h1>CRUD</h1>
</div>
<div align="center">
  <strong>for RESTful APIs built with NestJs</strong>
</div>

<br />

<div align="center">
  <a href="https://travis-ci.org/nestjsx/crud">
    <img src="https://github.com/nestjsx/crud/workflows/Tests/badge.svg" alt="Build" />
  </a>
  <a href="https://coveralls.io/github/nestjsx/crud?branch=master">
    <img src="https://coveralls.io/repos/github/nestjsx/crud/badge.svg" alt="Coverage" />
  </a>
  <a href="https://github.com/nestjsx/crud/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nestjsx/crud.svg" alt="License" />
  </a>
  <a href="https://www.npmjs.com/package/@nestjsx/crud">
    <img src="https://img.shields.io/npm/v/@nestjsx/crud.svg" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/org/nestjsx">
    <img src="https://img.shields.io/npm/dm/@nestjsx/crud.svg" alt="npm downloads" />
  </a>
  <a href="https://npm.packagequality.com/#?package=@nestjsx%2Fcrud">
    <img src="https://npm.packagequality.com/shield/%40nestjsx%2Fcrud.svg" alt="Package Quality" />
  </a>
  <a href="https://renovatebot.com/">
    <img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" alt="Renovate" />
  </a>
  <a href="http://makeapullrequest.com">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs welcome" />
  </a>
  <a href="https://github.com/marmelab/awesome-rest#nodejs">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/awesome-rest.svg?sanitize=true" alt="Awesome REST" />
  </a>
  <a href="https://github.com/juliandavidmr/awesome-nestjs#components--libraries">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/awesome-nest.svg?sanitize=true" alt="Awesome Nest" />
  </a>
  <a href="https://github.com/nestjs/nest">
    <img src="https://raw.githubusercontent.com/nestjsx/crud/master/img/nest-powered.svg?sanitize=true" alt="Nest Powered" />
  </a>
  <a href="#individuals" alt="Sponsors on Open Collective">
    <img src="https://opencollective.com/nestjsx/backers/badge.svg" />
  </a>
  <a href="#organizations" alt="Sponsors on Open Collective">
    <img src="https://opencollective.com/nestjsx/sponsors/badge.svg" />
  </a> 
</div>

<div align="center">
  <sub>Built with :purple_heart: by
  <a href="https://twitter.com/MichaelYali">@MichaelYali</a> and
  <a href="https://github.com/nestjsx/crud/graphs/contributors">
    Contributors
  </a>
  <div align="center">
    :star2: :eyes: :zap: :boom:
  </div>
</div>

<br />

We believe that everyone who's working with NestJs and building some RESTful services and especially some CRUD functionality will find `@nestjsx/crud` microframework very useful.

## Features

<img align="right" src="img/crud-usage2.png" alt="CRUD usage" />

- :electric_plug: Super easy to install and start using the full-featured controllers and services :point_right:

- :octopus: DB and service agnostic extendable CRUD controllers

- :mag_right: Reach query parsing with filtering, pagination, sorting, relations, nested relations, cache, etc.

- :telescope: Framework agnostic package with query builder for a frontend usage

- :space_invader: Query, path params and DTOs validation included

- :clapper: Overriding controller methods with ease

- :wrench: Tiny config (including globally)

- :gift: Additional helper decorators

- :pencil2: Swagger documentation

## Packages

- [**@nestjsx/crud**](https://www.npmjs.com/package/@nestjsx/crud) - core package which provides `@Crud()` decorator for endpoints generation, global configuration, validation, helper decorators ([docs](https://github.com/nestjsx/crud/wiki/Controllers#description))
- [**@nestjsx/crud-request**](https://www.npmjs.com/package/@nestjsx/crud-request) - request builder/parser package which provides `RequestQueryBuilder` class for a frontend usage and `RequestQueryParser` that is being used internally for handling and validating query/path params on a backend side ([docs](https://github.com/nestjsx/crud/wiki/Requests#frontend-usage))
- [**@nestjsx/crud-typeorm**](https://www.npmjs.com/package/@nestjsx/crud-typeorm) - TypeORM package which provides base `TypeOrmCrudService` with methods for CRUD database operations ([docs](https://github.com/nestjsx/crud/wiki/ServiceTypeorm))

## Documentation

- :dart: [General Information](https://github.com/nestjsx/crud/wiki#why)
- :video_game: [CRUD Controllers](https://github.com/nestjsx/crud/wiki/Controllers#description)
- :horse_racing: [CRUD ORM Services](https://github.com/nestjsx/crud/wiki/Services#description)
- :trumpet: [Handling Requests](https://github.com/nestjsx/crud/wiki/Requests#description)

## Support

Any support is welcome. At least you can give us a star :star:

## Contributors

### Code Contributors

This project exists thanks to all the people who contributed. [[Contribute](CODE_OF_CONDUCT.md)].
<a href="https://github.com/nestjsx/crud/graphs/contributors"><img src="https://opencollective.com/nestjsx/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/nestjsx#backer)]

#### Individuals

<a href="https://opencollective.com/nestjsx#backers" target="_blank"><img src="https://opencollective.com/nestjsx/backers.svg?width=890&button=false"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/nestjsx#sponsor)]

<a href="https://opencollective.com/nestjsx/sponsor/0/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/1/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/2/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/3/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/4/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/5/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/6/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/7/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/8/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/nestjsx/sponsor/9/website" target="_blank"><img src="https://opencollective.com/nestjsx/sponsor/9/avatar.svg"></a>

## License

[MIT](LICENSE)
