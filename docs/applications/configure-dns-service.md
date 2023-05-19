---
title: Configure a Domain Name Server (DNS) Service
intro: Your web application users may benefit from using a domain name instead of an IP address to access your services. Configure a Domain Name Server (DNS) service to manage the routing to your website, redirecting the user accessing the human readable domain to your server IP Address. Some examples of DNS services that can be used include FreeDNS, AWS route 53, cloudflare DNS.
links:
    overview:
    quickstart:
    previous:
        - /docs/applications/add-ssl-certificate
    next:
        - /docs/roles/add-role
    guides:
    related:
    featured:
---

1. On Devopness, navigate to a project then select an environment
1. Find the `Servers` card
1. Click the `View` in the `Servers` card to see a list of existing `Servers`
1. In the list of servers, find the server you want to connect and copy the server' IP Address
    > The ip address should be a number separated by dots, e.g: 41.234.56.78
1. Use the IP Address to configure the DNS on your provider, e.g: FreeDNS

