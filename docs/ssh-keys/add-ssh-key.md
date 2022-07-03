---
title: Add an SSH key
intro: Sometimes you and your team members need to connect to your servers to run commands from the terminal. Add SSH keys to environment servers to ensure secure server access by only the authorized SSH keys.
links:
    overview:
    quickstart:
    previous:
    next:
    guides:
    related:
        - /docs/ssh-keys/remove-ssh-key.md
    featured:
---

# Add an SSH key
1. On Devopness, navigate to a project then select an environment
2. Find the `SSH Keys` card
3. Click the `View` button in the `SSH Keys` card to see a list of existing SSH Keys
4. On the upper-right corner of the list click the `ADD SSH KEY` button
5. Provide a name to the `SSH Key` being added. For example, "Company Laptop"
6. Paste in your public key
>Note: the public key has to be issued using one of the following cryptography algorithms: RSA, DSA, DSS
>> the above note is an example of extra info that should not be added to documentation, as API validation rules
>> and support to extra ssh key types might change, and we should not need to update the docs when that happens
>> as the API error messages + the Devopness Web app forms should be clear enough to guide the user
7. Click `NEXT`
8. Follow the prompts to complete the configuration of the new `SSH Key`
9. Click `CONFIRM`
