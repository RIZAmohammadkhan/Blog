---
title: Installing the ARCH Way
subtitle: System Maintenance That Just Hits Different
readTime: 15 min
date: 2026-02-01
tags: pacman, yay, AUR
---

## Wait, what even is the difference between official repos and AUR?

Before we jump into commands, you need to understand that Arch gives you two completely different ways to get software, and they work in fundamentally different ways. Think of the official repositories as the curated, pre-built software that Arch developers have personally tested, packaged, and signed off on. These packages are built on Arch's servers, tested to work together, and receive regular security updates from the core team. When you install from the official repos, you're downloading a pre-compiled binary that's ready to run immediately.

The Arch User Repository takes a radically different approach. Instead of giving you pre-built packages, the AUR gives you build instructions called PKGBUILDs. These are essentially recipes that tell your computer how to download the source code, compile it, and install it. Anyone can upload to the AUR, which means you get access to an absolutely massive collection of software including the newest, most niche, and most experimental programs. But here's the catch: you're compiling this code yourself, and you're trusting whoever wrote that PKGBUILD. The AUR is community-maintained, not officially supported, which gives you incredible freedom but also more responsibility.

Almost every piece of software that has ever been written for Linux is available in the AUR. That's not an exaggeration. Whether you need some obscure academic tool, a bleeding-edge development version of a program, or someone's personal project, it's probably there.

## How do I actually install apps on Arch?

The official repositories are where you'll get most of your core system components, popular applications, and well-established software. To install a package using pacman, Arch's official package manager, you'll use the `-S` flag which stands for "sync" because you're synchronizing this package from the repository to your system.

```bash 
sudo pacman -S zed
```

This command will install Zed, my favorite modern code editor. When you run this, pacman will check if there are any dependencies Zed needs, show you exactly what's about to be installed, and ask for your confirmation before proceeding. You'll need sudo privileges because installing system-wide software requires administrative access, and pacman needs to write to protected system directories.

## What if I want to remove something I installed?

If you later decide a package isn't for you, removing it is just as straightforward. You'll use the `-R` flag for "remove":

```bash
sudo pacman -R zed
```

This removes the package itself, but if you want to also remove any dependencies that were installed alongside it and are no longer needed by other packages, you can use the `-Rs` flags together. The lowercase `s` removes unneeded dependencies, keeping your system clean.

```bash
sudo pacman -Rs zed
```

## How do I install things from the AUR?

This is where Arch really flexes its muscles. The AUR is home to an absolutely staggering amount of software, from obscure utilities to cutting-edge development builds. However, since AUR packages need to be built on your system from source code, you'll want to use an AUR helper to streamline the process.

While you can manually download and build AUR packages, most users rely on an AUR helper like `yay` to streamline the process. The name "yay" stands for "Yet Another Yogurt" (a playful reference to another AUR helper called "yaourt"), but it's also fitting because it makes working with the AUR genuinely easy.

Now here's where things get a bit circular, and it's one of those classic chicken-and-egg problems that Arch users love to joke about. To install AUR packages easily, you want yay. But yay itself is in the AUR, not in the official repositories. So how do you get the tool that helps you install AUR packages when that tool is itself an AUR package?

Some Arch-based distributions like `EndeavourOS` or `Omarchy` come with yay pre-installed, which neatly sidesteps this whole problem. But if you're running vanilla Arch or a minimal distribution, you'll need to do what the community affectionately calls the "Manual Dance" just this one time. Think of it as your initiation into the AUR world.

Here's how you bootstrap yay into existence:

First, you need to install the build tools that will let you compile software from source. These are the fundamental tools that turn source code into executable programs:

```bash
sudo pacman -S --needed base-devel git
```

The `--needed` flag is a nice touch that tells pacman to skip any packages you already have installed, so if you've already got some of these tools from a previous installation, they won't be reinstalled unnecessarily. The `base-devel` package group includes essentials like the GCC compiler, make, and other build utilities. Git is version control software that you'll use to download yay's source code from the AUR.

Next, you'll clone yay's build recipe (the PKGBUILD) from the AUR repository. This is downloading the instructions for how to build yay, not yay itself:

```bash
git clone https://aur.archlinux.org/yay.git
```

This creates a directory called `yay` with all the files you need. Now you'll move into that directory and actually build the package:

```bash
cd yay
makepkg -si
```

Let's break down what `makepkg -si` does because it's doing several important things in one command. The `makepkg` command reads the PKGBUILD file and follows its instructions to download yay's source code, compile it, and package it up. The `-s` flag tells it to automatically install any dependencies yay needs before building, and the `-i` flag tells it to install the package once it's successfully built. So in one command, you're handling dependencies, building the software, and installing it.

Once this process completes, congratulations! You now have yay installed and you'll never have to do this manual process again. From this point forward, yay can update itself and install any other AUR packages you want. It's a one-time rite of passage.

Now that yay is installed, using it feels almost identical to using pacman. To install a package from the AUR:

```bash 
yay -S trix-player
```

This will install a terminal-based music player. When you run an AUR installation, yay will show you the build script (called a PKGBUILD) and ask if you want to review it. This is an important security step, since you're essentially running code from the internet on your machine. Taking a moment to glance through it helps ensure nothing malicious is hiding in there.

After installation, you can launch the program by typing `trix` in your terminal, and it will open your music directory if you have audio files ready to play.

To remove an AUR package, the process is the same as with official packages:

```bash
yay -R trix-player
```

Though I'd encourage you to keep trix around if you enjoy music in the terminal—there's something satisfying about a lightweight player that doesn't need a graphical interface.

## How do I update my system?

One of Arch's greatest strengths is its rolling release model, which means you never need to reinstall your operating system for major version upgrades. Instead, you continuously update your system with the latest packages. This is done with a single command:

```bash
yay -Syu
```

And that's all you need to do! Breaking this down: the `-S` means sync (install or update packages), the `-y` refreshes your package database so you know about the latest versions available, and the `-u` upgrades all packages that have newer versions. Running this through yay rather than pacman means both your official repository packages and your AUR packages get updated in one go.

It's generally recommended to update your Arch system regularly—at least once a week if you use it daily. This keeps you current with security patches and new features, though you should always check the Arch news page before major updates in case there are manual intervention steps required for certain package changes.

As now we can now install any package we like next we will move to setting up our developer environment, check `tools/IDE.md` next

## HAPPY DEVX
