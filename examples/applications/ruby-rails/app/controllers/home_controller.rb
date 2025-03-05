class HomeController < ApplicationController
  def index
    @title = "Devopness ❤️ Rails"

    @devopnessLogoURL = "https://assets.devopness.com/images/logo-devopness-primary.svg"
    @railsLogoURL = "https://assets.devopness.com/images/icons_svgs/ruby-rails.svg"

    @descriptions = [
      "With Devopness, you can easily set up and manage your Rails app deployments in the cloud without hassle.",
      "Automate server provisioning, implement CI/CD pipelines, and scale your project with just a few clicks."
    ]
  end
end
