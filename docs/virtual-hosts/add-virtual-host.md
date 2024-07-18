---
title: Add a Virtual host
intro: Add a Virtual Host to make an application accessible on the internet, by server IP address or a domain name
links:
    overview:
    quickstart:
    previous:
    next: /docs/ssl-certificates/add-ssl-certificate
    guides:
    related:
    featured:
required_permissions:
    - virtual-host:create
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Virtual hosts` card
1. Click `View` in the `Virtual hosts` card to see a list of existing `Virtual hosts`
1. On the upper-right corner of the list click `ADD VIRTUAL HOST`
1. Follow the prompts then click `CONFIRM`
1. In the `Virtual hosts` list, the recently created virtual host can be seen
    - A new deployment is required for your changes to take effect
        - Follow the guide {% mentionPost "/docs/pipelines/run-pipeline" %}

{% note %}

**NOTE**: If the virtual host type is domain name, follow the guide below to ensure a valid domain:

1. Copy the IP Address of the server to which the virtual host has been deployed
    - Follow the guide {% mentionPost "/docs/servers/find-server-ip-address" %}
1. Access your DNS service management panel
    - If you don't have your own domains configured with a DNS service, you can use free services such as [FreeDNS](https://freedns.afraid.org/) or hire paid managed DNS services such as [AWS Route53](https://aws.amazon.com/route53/), [Cloudflare DNS](https://www.cloudflare.com/dns/), or any [notable managed DNS service provider](https://en.wikipedia.org/wiki/List_of_managed_DNS_providers) that suits your needs
1. Configure a DNS record for your virtual host domain
    - Follow the specific instructions on your chosen DNS service documentation
1. Verify your DNS record is pointing to your Devopness managed server
    - This can be verified using a DNS propagation checker such as [whatsmydns](https://www.whatsmydns.net/) or [DNS Checker](https://dnschecker.org/)

{% endnote %}
