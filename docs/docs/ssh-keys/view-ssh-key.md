---
sidebar_position: 4
title: View SSH Key
intro: After adding SSH keys to your environment, you may want to review the details of a specific key, such as its label, fingerprint, or creation date. This helps in managing and auditing server access effectively.
links:
  overview:
  quickstart:
  previous: ssh-keys/list-ssh-keys
  next: ssh-keys/link-ssh-key
  guides:
  related:
    - ssh-keys/create-ssh-key-pair
    - ssh-keys/add-ssh-key
  featured:
---

## How to View Details of an SSH Key

1. In the Devopness dashboard, navigate to your project, then select the environment where the SSH key was added.
2. Locate the `SSH Keys` card and click `View` to open the list of SSH keys associated with the environment.
3. From the list, click on the SSH key you want to inspect.
4. The `SSH key` details page will display important information such as:
   - **Name**: A user-friendly name for the key.
   - **Fingerprint**: A unique identifier for the key.
   - **Created At**: When the key was added to the environment.

Use this view to verify key details or to confirm which keys have access to your servers.
