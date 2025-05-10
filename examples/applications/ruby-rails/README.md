# Ruby on Rails - Devopness Example

## Overview

Integrate a Ruby on Rails application with Devopness for streamlined management and deployment.

This guide covers adding an application, configuring environment variables, creating a daemon, setting up a virtual host, and deploying your application using the Devopness platform.

## 🚀 Adding an Application

Using the configuration below, follow the guide [Add an Application](https://www.devopness.com/docs/applications/add-application) to add your application to Devopness.

| Property       | Value                               |
| -------------- | ----------------------------------- |
| Repository     | `devopness/devopness`               |
| Stack          | `Ruby`                              |
| Engine Version | `3.4.2`                             |
| Framework      | `Ruby on Rails`                     |
| Root Directory | `/examples/applications/ruby-rails` |

## ⚙️ Configuring Environment Variables

Using the table below, follow the guide [Add an Environment Variable](https://www.devopness.com/docs/variables/add-variable) to configure the environment variables for your application.

| Variable Key | Variable Value |
| ------------ | -------------- |
| RAILS_ENV    | `development`  |
| PORT         | `9000`         |

## 🛠️ Creating a Daemon

Using the configuration below, follow the guide [Add a Daemon](https://www.devopness.com/docs/daemons/add-daemon) to create a daemon for your application.

| Property    | Value                      |
| ----------- | -------------------------- |
| Name        | `rails-server`             |
| Command     | `bundle exec rails server` |
| Application | `Your Application`         |

## 🌐 Creating a Virtual Host

Using the configuration below, follow the guide [Add a Virtual Host](https://www.devopness.com/docs/virtual-hosts/add-virtual-host) to create a virtual host for your application.

| Property       | Value                                                 |
| -------------- | ----------------------------------------------------- |
| Type           | `Server IP Address`                                   |
| Name           | **Server IP and Port** using the format `{IP}:{PORT}` |
| Application    | `Your Application`                                    |
| Listen Address | `http://localhost:{PORT}`                             |

## 🚢 Deploying the Application

Follow the guide [Deploy Application](https://www.devopness.com/docs/applications/deploy-application) to deploy your application.

## ✍️ Contributing

Contributions are highly encouraged! 🙏👊

See the [contributing guide](../../../CONTRIBUTING.md) for details on how to participate.

All communication and contributions to Devopness projects are subject to the [Devopness Code of Conduct](../../../CODE_OF_CONDUCT.md).

## 📜 License

All repository contents are licensed under the terms of the [MIT License](../../../LICENSE) unless otherwise specified.
