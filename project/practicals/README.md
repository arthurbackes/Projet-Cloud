# :books: LINFO2145 Project: bootstrap tutorial

**LINFO2145 Autumn, 2026** -- *Etienne Rivière, Yinan Cao, Paul-Edouard Bertrand Van Ouytsel, Rémi Van Boxem, and Clément Delzotti*

This tutorial will guide you through the technologies and necessary tools to run the front-end.
The provided version uses non-persistent storage to save users' data (such as credentials or cart content) in the form of JSON objects.

## Prerequisites

If you have not read the [general description](../README.md) of the project, **do it before going through this tutorial.**

## Technologies involved in this project

This section gives you a list of pointers to other tutorials you can follow to be familiar with the technology used in the project.

- Learn all you want about Javascript, the programming language of the web, with: [Eloquent Javascript](http://eloquentjavascript.net/);
  - You can also follow this [interactive tutorial](https://javascript.info/).

- Start using Node.js with [this guide](https://nodejs.org/en/docs/guides/getting-started-guide/);
- Official documentation of the [NPM package manager](https://docs.npmjs.com/)
  - We encourage you to go through (at least) the following sections:
      1. [What is npm?](https://docs.npmjs.com/getting-started/what-is-npm);
      1. [How to Install Local Packages](https://docs.npmjs.com/getting-started/installing-npm-packages-locally);
      1. [Working with package.json](https://docs.npmjs.com/getting-started/using-a-package.json).

- The front-end is based on [Svelte](https://svelte.dev/) a Javascript framework for building dynamic web interfaces.
  - :pencil: **Note.** Start reading its [official documentation](https://svelte.dev/docs/svelte-components), and try its [interactive tutorial](https://learn.svelte.dev/tutorial/welcome-to-svelte).

**Do not panic**, all this documentation may seem a lot of content but it is an investment that will reward you later.

- For instance, you will continue to write code in Javascript for the back-end development.

## Development

In the following weeks, you will adapt the provided code (front-end and back-end) to complete the requested tasks for the project. In order to have one private repository per team member, you are asked to create a copy of the course repository in your GitHub account; this is commonly known as a *GitHub fork*. To do so, click on [this link](https://github.com/CloudLargeScale-UCLouvain/LINFO2145-2026-2027) to show the repository in your Web browser and click on the *Fork* button below your GitHub avatar.

:warning: **Important:
Only one private repository per team will be graded** and considered as deliverable for the project. Be sure to have every team member as well as the teaching assistants as contributors. These are the logins of the assistants:

- **YinanTsao** - Yinan Cao
- **PaulEdouardBertrandVO** - Paul-Edouard Bertrand Van Ouytsel
- **cdelzotti** - Clément Delzotti
- **remivanboxem** - Rémi Van Boxem

### Working in your Virtual Machine (VM)

In the previous practical sessions, you set up a VM with Docker. You will use this virtual machine for the project following these recommendations:

- **Use an Integrated Development Environment (IDE)**. Add your local copy of the repository as a new project in your favorite IDE.
- **Write code from your laptop and deploy in the VM**. Once you have completed a certain functionality for the project (new source code or update), build and deploy it in the VM with Docker. To avoid copying files back and forth, share the folder that contains your repository with your VMs using `multipass mount`:

  ```bash
  multipass mount LOCAL_PATH VM_NAME:VM_PATH
  ```

  You must replace:
  1. `LOCAL_PATH` with the path to the project folder on your host OS (e.g., `/home/jean/LINFO2145`);
  2. `VM_NAME` with the name of the VM you want to mount the folder on (e.g., `myvm`);
  3. `VM_PATH` with the path where the folder should appear in the guest OS (e.g., `/home/ubuntu/LINFO2145`).

  You can mount the **same folder on several VMs**: run the command once per VM. Every VM will then see the same files as your laptop, and any change you make in your IDE shows up in all VMs right away. You only need to rebuild your Docker images inside the VM.

  :bulb: **Tip.** You can also mount the folder when you create a VM: `multipass launch -n myvm-2 --mount LOCAL_PATH:VM_PATH --cloud-init cloud-init.yaml`

  :bulb: **Useful commands.** `multipass info VM_NAME` lists the folders mounted on a VM, and `multipass umount VM_NAME` removes them.

  :warning: **Windows users.** Mounts are disabled by default. Enable them once with `multipass set local.privileged-mounts=true`.

:bulb: Hint: We encourage you to manage your GitHub repository as well as changes in the provided source code from your laptop.

:checkered_flag: That's it. Now you are ready to deploy the front-end, find further instructions in front-end tutorial to start working with the Shopping Cart Application (SCApp).
