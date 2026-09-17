# :books: Lab Session 1: Virtual Machines

**LINFO2145 Autumn, 2026** -- _Etienne Rivière, Paul-Edouard Bertrand Van Ouytsel, Yinan Cao, Clément Delzotti and Rémi Van Boxem_

## Objectives

The goal of this tutorial is to show you how to set up a virtualized infrastructure similar to a remote cloud IaaS, on your own laptop.
This virtualized infrastructure will feature several virtual machines (VMs).
The virtual machine template you will build during this session will be reused for all tutorials and for the project.
As an additional exercise, you will deploy a Web hosting service as an example of an application running over multiple VMs.

At the end of this tutorial, you will know how to:

- create and deploy Virtual Machines (VMs);
- install and deploy a multi-tier web application using several VMs.

:warning:
We encourage you to **follow the tutorial solo**.

:warning:
This tutorial requires you to complete some exercises, which are tagged with this icon: :pencil2:

:warning:
**Prerequisites.** Before you continue, click on [THIS LINK](Prerequisites.md) to install the required software.

## Setup a virtual infrastructure with Multipass

In this section, you will learn how to configure and create a new Virtual Machine (VM), how to create templates to deploy multiple identical VMs, and how to deploy multiple VMs on the same host (your laptop). VMs host a minimalistic GNU/Linux Operating System (OS) with a reduced number of software packages.

:bulb:
We also want to limit the number of resources used by each VM (hard drive space, CPU, memory).

:warning:
From now on, you will be asked to write down different commands in a terminal of your laptop. For this tutorial the working directory is the folder `tutorials/01_VirtualMachines`, open a terminal and be sure to be in this directory.

### Create and set up your first VM

We start by creating a new (empty) VM and registering it with the name: **myvm**.

```bash
# creates a default Ubuntu VM
$ multipass launch -n myvm
```

Congratulations, you have just launched your first Ubuntu VM with Multipass! The default hardware specification of the VMs you create is as follows:

- CPU: 1 CPU
- Memory: 1GB RAM
- Disk: 5GB
- Network: Host

To make sure that this is correct we can prompt a new remote terminal with the Multipass utility `shell`:

```bash
# Spawn a terminal
$ multipass shell myvm

Welcome to Ubuntu 26.04 LTS (GNU/Linux 7.0.0-30-generic x86_64)

 * Documentation:  https://docs.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/pro

 System information as of Thu Sep 10 10:38:42 CEST 2026

  System load:  0.62              Processes:             113
  Usage of /:   57.3% of 3.70GB   Users logged in:       0
  Memory usage: 22%               IPv4 address for ens3: 10.75.234.25
  Swap usage:   0%


Expanded Security Maintenance for Applications is not enabled.

99 updates can be applied immediately.
90 of these updates are standard security updates.
To see these additional updates run: apt list --upgradable

Enable ESM Apps to receive additional future security updates.
See https://ubuntu.com/esm or run: sudo pro status


ubuntu@myvm:~$
```

We can notice that there is indeed 5GB of disk available. You can check the disk usage and partition using `lsblk`. The `free -m` shows us that we have 1000MB of RAM and `cat /proc/cpuinfo  | grep process| wc -l` tells us that we have 1 CPU. We can also see that our VM is using our host local network and we can reach it if we try to ping it. You can retrieve the VM ip address with `ip a` on the interface `enp0s1`.

```bash
# from the host machine
$ ping 10.75.234.25
PING 10.75.234.25 (10.75.234.25) 56(84) bytes of data.
64 bytes from 10.75.234.25: icmp_seq=1 ttl=64 time=0.431 ms
64 bytes from 10.75.234.25: icmp_seq=2 ttl=64 time=0.638 ms
```

:bulb:
When dealing with multiple VMs, the `multipass list` command might be useful. It lists the state of your VMs, and their local ip addresses.

```bash
$ multipass list
Name                    State             IPv4             Image
myvm                    Running           10.75.234.25     Ubuntu 26.04 LTS
```

### Create a custom hardware requirement

It is easy to create Ubuntu VMs with custom hardware requirement with the following flags: `--cpus, --disk, --memory`

```bash
# creates a custom VM
$ multipass launch -n my-custom-vm --cpus 2 --mem 5G --disk 10G
```

### Access the guest OS from your laptop

We previously used the multipass utility `shell` to connect to our VM remotely but we would like to access it from anywhere with SSH.

:pencil2: From a terminal **on the host system** (laptop), run `ssh ubuntu@GUEST_OS_IP_ADDRESS`.
Type `yes` to accept the key fingerprint. You should then see a message telling you that you don't have permission to connect to this host. This is because we haven't set up the information needed to tell the VM that we do have permission to access it.

#### Login using an RSA key pair

We will set up a [RSA key pair](https://en.wikipedia.org/wiki/Public-key_cryptography) on the host OS and use it for automated authentication in the guest VM OS.

Follow the instructions [HERE](RSAKeyPair.md) to configure your host and guest VM with RSA authentication.

## Launching multiple VMs

Now that we have set up one VM with a minimalistic guest OS, we want to be able to launch new instances or clones of this VM.

### Cloud-init

The manual configuration of multiple identical VM can quickly become cumbersome. Thankfully, we are lazy computer scientists and we would like to automate some of the boring operations we just did, like copying our RSA key.

The way to do this with Multipass is to create what is called a [**`cloud-init`**](https://cloudinit.readthedocs.io/en/latest/topics/examples.html) containing instructions of operations to be performed on a newly created VM, like install packages with `apt-get install`, modify some files, configure network interfaces, create new users, ...

To show you a simple example, we will add our public RSA key to a newly created VM with the following steps:

1. Create a new file called `cloud-init.yaml` with `nano cloud-init.yaml`
2. Copy the following content:

```yaml
#cloud-config
ssh_authorized_keys:
  - your-rsa-public-key
```

3. Save and quit the file.
4. Launch a new VM with `multipass launch -n myvm-2 --cloud-init cloud-init.yaml`
5. Connect via SSH with `ssh ubuntu@IP_OF_YOUR_NEW_VM`

:warning: You should now have two VMs, `myvm` and `myvm-2`. If not, make sure you followed the last step with Cloud-init.

## Final comments

:checkered_flag: **Congrats, you complete your first tutorial.**
You learned how to deploy a virtual infrastructure with some VMs and set up a connection (via SSH) to the guest OSs from your laptop. You may want to make use of this infrastructure for deploying an application. As an additional exercise, [this tutorial](DeployWebApp.md) shows you how to deploy a Web hosting service on your virtual infrastructure.
