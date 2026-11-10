# Python + FastAPI - Devopness Example

## Overview

A simple Python 3.13 API using FastAPI and Uvicorn, with no database, external services, or required environment variables.

This guide covers running locally, adding an application, creating a daemon, setting up a virtual host, and deploying using Devopness.

## 💻 Running Locally

From `examples/applications/python-fastapi`, create a virtual environment and install the pinned dependencies:

```sh
python3.13 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m pip check
```

Activate the environment and start the API:

```sh
. .venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Stop the local server with `Ctrl+C`.

## 🔌 Available Endpoints

Both endpoints return HTTP 200 and `application/json`:

| Method | Path | Response |
| ------ | ---- | -------- |
| GET | `/` | `{"message":"Hello from Python and FastAPI!"}` |
| GET | `/health` | `{"status":"ok"}` |

```sh
curl http://localhost:8000/
curl http://localhost:8000/health
```

Automatic API documentation and OpenAPI schema routes are disabled so only these two endpoints are registered.

## 🧪 Running Tests

From the example directory, install the separate test dependencies and run the tests:

```sh
.venv/bin/python -m pip install -r requirements-dev.txt
.venv/bin/python -m pip check
.venv/bin/python -m unittest discover -s tests -v
```

## 🚀 Adding an Application

Using the configuration below, follow the guide [Add an Application](https://www.devopness.com/docs/applications/add-application) to add your application to Devopness.

| Property | Value |
| -------- | ----- |
| Repository | `devopness/devopness` |
| Stack | `Python` |
| Engine Version | `3.13` |
| Framework | Select the available Python option for a custom ASGI application (see deployment notes below) |
| Root Directory | `/examples/applications/python-fastapi` |
| Install dependencies command | `python3.13 -m venv .venv && .venv/bin/python -m pip install -r requirements.txt` |

Run the install command from the application's configured root directory on each deployment. This explicitly installs dependencies into the release's `.venv`; no automatic `requirements.txt` installation is assumed. No build step or environment variables are required.

## 🛠️ Creating a Daemon

Using the configuration below, follow the guide [Add a Daemon](https://www.devopness.com/docs/daemons/add-daemon) to create a daemon for your application.

| Property | Value |
| -------- | ----- |
| Name | `python-fastapi-server` |
| Command | `.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000` |
| Application | `Your Application` |

Run one daemon process with the application's configured root directory as its working directory. The explicit executable path uses the installed virtual environment without depending on shell activation. Devopness keeps the process running and restarts it on failure.

After deployment installs dependencies, start the daemon through Devopness. Restart it after subsequent deployments so it loads the current release's code and virtual environment.

## 🌐 Creating a Virtual Host

Using the configuration below, follow the guide [Add a Virtual Host](https://www.devopness.com/docs/virtual-hosts/add-virtual-host) to create a virtual host for your application.

| Property | Value |
| -------- | ----- |
| Type | `Server IP Address` |
| Name | **Server IP and Port** using the format `{IP}:{PORT}` |
| Application | `Your Application` |
| Listen Address | `http://localhost:8000` |

The virtual host proxies incoming traffic to the daemon on port `8000`.

## 🚢 Deploying the Application

Follow the guide [Deploy Application](https://www.devopness.com/docs/applications/deploy-application) to deploy your application with the dependency installation command above. Start or restart the daemon after the release is activated, then request `/` and `/health` through the virtual host and check the expected responses.

### Deployment Notes

The existing examples do not establish the exact Python framework selector label or default Python dependency installation behavior. Choose the Python framework option available in your Devopness environment and explicitly configure the install command above. Verify the daemon's working directory points to the current release's configured application root. A live Devopness deployment is not required to run or test this example.

## ✍️ Contributing

Contributions are highly encouraged! 🙏👊

See the [contributing guide](../../../CONTRIBUTING.md) for details on how to participate.

All communication and contributions to Devopness projects are subject to the [Devopness Code of Conduct](../../../CODE_OF_CONDUCT.md).
