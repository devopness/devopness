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

1. On Devopness, navigate to a project then select an environment
1. Find the `SSL Certificates` card
3. Click `View` in the `SSL Certificates` card to see a list of existing `SSL Certificates`
4. On the upper-right corner of the list, click `ADD SSL CERTIFICATE`
5. On the `Virtual Host` dropdown menu, choose a virtual host
   > The name of your SSL certificate will be the name of the chosen virtual host
6. Choose the certificate authority, for example `Let's Encrypt`, and click `CONFIRM`
7. An action will be started by Devopness to issue an SSL Certificate and install it for the chosen Virtual Host
