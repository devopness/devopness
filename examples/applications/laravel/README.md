# Laravel - Devopness Example

## Overview

Integrate a Laravel application with Devopness for streamlined management and deployment.

This guide covers adding an application, configuring environment variables, setting up a virtual host, and deploying your application using the Devopness platform.

## 🚀 Adding an Application

Using the configuration below, follow the guide [Add an Application](https://www.devopness.com/docs/applications/add-application) to add your application to Devopness.

| Property        | Value                            |
| --------------- | -------------------------------- |
| Repository      | `devopness/devopness`            |
| Stack           | `PHP`                            |
| Engine Version  | `8.3`                            |
| Framework       | `Laravel`                        |
| Root Directory  | `/examples/applications/laravel` |

## ⚙️ Configuring Environment Variables

Using the table below, follow the guide [Add an Environment Variable](https://www.devopness.com/docs/variables/add-variable) to configure the environment variables for your application.

Generate a value for `APP_KEY` locally with `php artisan key:generate --show` before saving it.

| Variable Key | Variable Value                  |
| ------------ | ------------------------------- |
| APP_ENV      | `production`                    |
| APP_DEBUG    | `false`                         |
| APP_KEY      | `base64:<generated-key>`        |
| APP_URL      | `http://<your-server-ip>`       |

## 🌐 Creating a Virtual Host

Using the configuration below, follow the guide [Add a Virtual Host](https://www.devopness.com/docs/virtual-hosts/add-virtual-host) to create a virtual host for your application.

| Property       | Value                  |
| -------------- | ---------------------- |
| Type           | `Server IP Address`    |
| Name           | **Server IP address**  |
| Application    | `Your Application`     |
| Root Directory | `public`               |

The Laravel framework serves all HTTP traffic through the `public/` directory; setting it as the virtual host root prevents direct access to `.env`, `composer.json`, `vendor/`, and other framework internals.

## 🚢 Deploying the Application

The shipped Laravel defaults use SQLite plus database-backed `cache`, `session`, and `queue` stores. Before the first deploy, create the database file and run migrations so those services have the tables they need:

```sh
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');"
php artisan migrate --force
```

Follow the guide [Deploy Application](https://www.devopness.com/docs/applications/deploy-application) to deploy your application. If you switch the `DB_CONNECTION` env variable to MySQL or PostgreSQL, point those services at a database your application can reach and run `php artisan migrate --force` against it instead.

## ✍️ Contributing

Contributions are highly encouraged! 🙏👊

See the [contributing guide](../../../CONTRIBUTING.md) for details on how to participate.

All communication and contributions to Devopness projects are subject to the [Devopness Code of Conduct](../../../CODE_OF_CONDUCT.md).

## 📜 License

All repository contents are licensed under the terms of the [MIT License](../../../LICENSE) unless otherwise specified.
