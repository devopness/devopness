require "test_helper"

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get "/"

    assert_response :success
    assert_select "title", "Devopness ❤️ Rails"
    assert_select "img[src=?]", "https://assets.devopness.com/images/logo-devopness-primary.svg"
    assert_select "img[src=?]", "https://assets.devopness.com/images/icons_svgs/ruby-rails.svg"

    @expected_descriptions = [
      "With Devopness, you can easily set up and manage your Rails app deployments in the cloud without hassle.",
      "Automate server provisioning, implement CI/CD pipelines, and scale your project with just a few clicks."
    ]

    assert_select ".description p", @expected_descriptions.size
    @expected_descriptions.each do |description|
      assert_select ".description p", description
    end
  end
end
