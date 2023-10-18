---
title: Add an SSL Certificate
intro: Add an SSL certificate to an application to allow HTTPS requests to it.
links:
    overview:
    quickstart:
    previous:
        - /docs/applications/deploy-application
    next:
        - /docs/teams/add-team
    guides:
    related:
    featured:
required_permissions:
    - application:update
---

Before an SSL certificate can be issued a valid DNS record must point to the server on which the application is deployed, so the SSL Certificate can be issued and validated for the configured application web domain. For example, if your application is publicly accessible through the domain `my-application.example.com` the subdomain `my-application` on the domain `example.com` must be configured to point to your server IP address.

<details open>
  <summary>Steps to configure a DNS record pointing to your servers:</summary>

1. Copy the IP Address of the server where the application is running
    > Follow the {% mentionPost "/docs/servers/find-server-ip-address" %} guide for detailed instructions
1. Access your DNS service management panel
    > If you don't have your own domains configured with a DNS service, you can use free services such as [FreeDNS](https://freedns.afraid.org/) or hire paid managed DNS services such as [AWS Route53](https://aws.amazon.com/route53/), [Cloudflare DNS](https://www.cloudflare.com/dns/), or any [notable managed DNS service provider](https://en.wikipedia.org/wiki/List_of_managed_DNS_providers) that suits your needs.
1. Configure a DNS record for your application domain
    > Follow the specific instructions on your chosen DNS service documentation
1. Verify your DNS record is pointing to your Devopness managed server
  > This can be verified using a DNS propagation checker such as [whatsmydns](https://www.whatsmydns.net/) or [DNS Checker](https://dnschecker.org/)

</details>

Once you have your application DNS record correctly pointing to the IP Address of your Devopness managed server, please follow the instructions below to issue a SSL Certificate to your application:

1. On the chosen Devopness environment, click `View` in the `Applications` card to see a list of existing `Applications`
1. Click `DETAILS` on the application you want to add an SSL certificate to
1. On the upper-right corner click `SSL` (open lock icon)
1. Choose the certificate authority and click `CONFIRM`
1. An action to install the SSL certificate will start
