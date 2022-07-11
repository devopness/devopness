---
title: Add an existing Server
intro: If you have servers provisioned outside of your desired environment on Devopness, you can still connect them to your Devopness account and take the most of the Devopness infrastructure management features.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
    featured:
---

# Add an existing Server
1. On Devopness, navigate to a project then select an environment
2. If there's no other server in the selected environment, just click `Add Server`
3. If a list of resource cards is displayed, find the `Servers` card
4. Click `View` in the `Servers` card to see a list of existing `Servers`
5. On the upper-right corner of the list click `ADD SERVER`
6. On the `Cloud Provider` drop-down menu choose `VPS/Self Hosted`
7. Provide the `Public IP address` of your existing server
6. Enter the `SSH Port` to be used to connect to the server
7. Click `NEXT`
8. Follow the prompts to complete the configuration of the new `Server`
9. Click `CONFIRM`
    - If you see a message saying `Error establishing a SSH connection to server`, please verify if the IP address and SSH port used are correct and if external SSH connections are allowed on this server
10. After the `Server` is added you will be redirected to the `Connect` page
11. Find the `Command to connect` field and click `Copy to clipboard`
12. Log into your server as the `root` user
13. Paste the command that has been copied to the clipboard and run it
14. A message will be displayed in the terminal window when the server is connected to Devopness
15. On Devopness, once the server is displayed as `Connected`, it's been added to the selected environment
