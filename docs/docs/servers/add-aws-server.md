---
sidebar_position: 5
title: Add a Server to Amazon Web Services (AWS)
intro: Devopness allows you to provision a server on AWS using Elastic Compute Cloud (EC2) and manage it through Devopness.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

> If you don't have an AWS credential, please follow the guide [/docs/credentials/add-aws-credential]

1. On Devopness, navigate to a project then select an environment
1. If there's no other server in the selected environment, just click `ADD SERVER`
1. If a list of resource cards is displayed, find the `Servers` card and click View on it
1. On the upper-right corner of the list click `ADD SERVER`
1. Choose `Amazon Web Services` as cloud provider
1. Select a `Credential`
    > If no credential is listed or you want to use a different one, click `Create a new credential` and follow the guide [/docs/credentials/add-credential]
1. Follow the prompts to complete the configuration of the new `Server`
1. Review server information and settings. If everything is correct, click `CONFIRM`
    > Use the `PREVIOUS` button if you need to modify any server details
1. Wait for the `server:provision` action to be completed
1. After the server is successfully provisioned it will be visible on `AWS` console
1. If you want to access the server on `AWS` console:
    - Access [AWS console](https://console.aws.amazon.com/)
    - On the Search box, enter “EC2” and select it from search results
    - In the upper-right corner select the region on which server was provisioned
    - Click `Instances`
    - An `EC2` instance will be listed, with the name of the new `Server` you provisioned on Devopness
