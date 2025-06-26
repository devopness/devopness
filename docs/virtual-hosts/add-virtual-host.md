---
title: Add a Virtual host
intro: Add a Virtual Host to make an application accessible on the internet, by server IP address or a domain name
links:
    overview:
    quickstart:
    previous: applications/deploy-application
    next: virtual-hosts/list-virtual-hosts
    guides:
    related:
        - virtual-hosts/list-virtual-hosts
        - virtual-hosts/view-virtual-host
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
        - Follow the guide [/docs/pipelines/run-pipeline]

:::note

For virtual hosts of type `Server IP address` ("ip-based virtual host"), please make sure:

    - the virtual host *hostname* is the IP address of the server to which the virtual host was successfully deployed

:::

:::note

For virtual hosts of type `Domain name` ("name-based virtual host") please make sure:

    - a DNS record with the same name of the "name-based virtual host" exists

    - the DNS record is pointing to the IP address of the server to which the virtual host was successfully deployed

Follow the steps below to configure a DNS record pointing to your server:

1. Copy the IP Address of the server to which the virtual host has been deployed
    - Follow the guide [/docs/servers/find-server-ip-address]
1. Access your DNS service management panel
    - If you don't have your own domains configured with a DNS service, you can use free services such as [FreeDNS](https://freedns.afraid.org/) or hire paid managed DNS services such as [AWS Route53](https://aws.amazon.com/route53/), [Cloudflare DNS](https://www.cloudflare.com/dns/), or any [notable managed DNS service provider](https://en.wikipedia.org/wiki/List_of_managed_DNS_providers) that suits your needs
1. Configure a DNS record for your virtual host domain
    - Follow the specific instructions on your chosen DNS service documentation
1. Verify your DNS record is pointing to your Devopness managed server
    - This can be verified using a DNS propagation checker such as [whatsmydns](https://www.whatsmydns.net/) or [DNS Checker](https://dnschecker.org/)

:::

:::note

in order to secure all network connections with your virtual host, and ensure all data submitted to your domain name is encrypted over the HTTPS protocol, follow the guide on how to [/docs/ssl-certificates/add-ssl-certificate]

:::
