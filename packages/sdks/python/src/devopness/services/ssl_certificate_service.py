"""
Devopness API Python SDK - Painless essential DevOps to everyone
"""

from ..generated.api.ssl_certificates_api import (
    SSLCertificatesApiService,
    SSLCertificatesApiServiceAsync,
)

__all__ = ["SSLCertificateService", "SSLCertificateServiceAsync"]


class SSLCertificateService(
    SSLCertificatesApiService,
):
    """Service for ssl certificates in the Devopness API."""


class SSLCertificateServiceAsync(
    SSLCertificatesApiServiceAsync,
):
    """Async service for ssl certificates in the Devopness API."""
