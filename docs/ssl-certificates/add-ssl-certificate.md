---
title: Add an SSL Certificate
intro: Add an SSL Certificate to secure communication between clients and servers, ensuring data confidentiality and integrity.
links:
    overview:
    quickstart:
    previous: /docs/applications/deploy-application
    next: /docs/teams/add-team
    guides:
    related:
    featured:
required_permissions:
    - ssl-certificate:create
---

Before an SSL certificate can be issued, a valid DNS record must point to the server on which the application is deployed, so the SSL Certificate can be issued and validated for the configured application web domain. For example, if your application is publicly accessible through the domain `my-application.example.com`, the subdomain `my-application` on the domain `example.com` must be configured to point to your server IP address.

<details open>
  <summary>Steps to configure a DNS record pointing to your servers:</summary>

1. Copy the IP Address of the server where the application is running
    - Follow the {% mentionPost "/docs/servers/find-server-ip-address" %} guide for detailed instructions
1. Access your DNS service management panel
    - If you don't have your own domains configured with a DNS service, you can use free services such as [FreeDNS](https://freedns.afraid.org/) or hire paid managed DNS services such as [AWS Route53](https://aws.amazon.com/route53/), [Cloudflare DNS](https://www.cloudflare.com/dns/), or any [notable managed DNS service provider](https://en.wikipedia.org/wiki/List_of_managed_DNS_providers) that suits your needs.
1. Configure a DNS record for your application domain
    - Follow the specific instructions on your chosen DNS service documentation
1. Verify your DNS record is pointing to your Devopness managed server
    - This can be verified using a DNS propagation checker such as [whatsmydns](https://www.whatsmydns.net/) or [DNS Checker](https://dnschecker.org/)
</details>

Once you have your application DNS record correctly pointing to the IP Address of your Devopness managed server, please follow the instructions below to create an SSL Certificate:

1. On Devopness, navigate to a project then select an environment
1. Find the `SSL Certificates` card
1. Click `View` in the `SSL Certificates` card to see a list of existing `SSL Certificates`
1. On the upper-right corner of the list, click `ADD SSL CERTIFICATE`
1. On the `Virtual Host` dropdown menu, choose a virtual host
    - The name of your SSL certificate will be the name of the chosen virtual host
1. Follow the prompts then click `CONFIRM`
1. In the `SSL Certificates` list, the recently created `SSL Certificate` can be seen
