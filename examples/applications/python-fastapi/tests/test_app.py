import unittest

from fastapi.testclient import TestClient

from app.main import app


class AppTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.addCleanup(self.client.close)

    def test_endpoint_responses(self):
        for path, expected in (
            ("/", {"message": "Hello from Python and FastAPI!"}),
            ("/health", {"status": "ok"}),
        ):
            with self.subTest(path=path):
                response = self.client.get(path)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.headers["content-type"], "application/json")
                self.assertEqual(response.json(), expected)

    def test_only_requested_routes_are_registered(self):
        self.assertEqual(
            [(route.path, route.methods) for route in app.routes],
            [("/", {"GET"}), ("/health", {"GET"})],
        )

    def test_documentation_and_schema_are_unavailable(self):
        for path in ("/docs", "/redoc", "/openapi.json"):
            with self.subTest(path=path):
                self.assertEqual(self.client.get(path).status_code, 404)
