---
title: Why Windows?
subtitlle: Short answer don't use windows
readTime: 10 min
date: 2026-01-29
tags: why-windows, windows-sucks, use-linux
---

## Why not use Windows?
I’ve been a Windows user for most of my journey with computers. At the beginning, it feels nice, you install stuff and it just works. No stress, no drama.

But once you start doing real development, things start falling apart. Installing programming languages is annoying, PATH management is a SUCKS and SUCKS REALLY HARD, and Windows Terminal feels like an afterthought compared to Linux Bash. All most all cloud servers use linux or freebsd so when deploying your app you end up fighting the OS instead of writing code.

On top of that, Windows updates are painful, the system keeps forcing defaults like Edge, and the settings and menus are all over the place. Sometimes BitLocker randomly activates, and suddenly you’re locked out of your own machine while trying to finish important work, hunting for recovery credentials.

A good machine running Windows often **feels** like a bad machine.

There’s also very limited real customizability. Many modern tools require WSL (Windows Subsystem for Linux), and setting that up is another pain. If your dev workflow already depends on Linux, using Windows just adds unnecessary friction.

If you want your dev journey to be smooth and uninterrupted, Windows is not the move.

Bleeding-edge software is rarely ready for Windows on day one. Linux usually gets support first, while Windows users have to wait. Even installing something like Rust which is a single `curl` command on Linux comes with extra requirements on Windows.

Some tools that need C/C++ during their build process depend on Microsoft’s C++ build tools (MSVC and Windows SDK). This means installing Visual Studio Build Tools, which is heavy and annoying compared to a simple package install on Linux.

Long story short: for development, Windows is a terrible choice.

## I need Windows for work or college. What should I do?
If you have to use Windows, the best option is to dual boot — Linux on one partition and Windows on the other.

But if you can get away with it, I’d honestly recommend removing Windows entirely. Life is just easier without it.

## Will I be able to use Linux? I’m afraid.
Yes. You don’t need to install Gentoo or some other insane distro. There are plenty of Linux distros that are easy to install, beginner-friendly, and support all modern packages and applications.

To learn more, check out:
`os/linux/beginners.md`

I’ve made a cheat sheet there with distro recommendations so you don’t have to repeat the same mistakes I did — breaking and fixing my system hundreds of times and spending countless hours only to find a perfect fit. The goal is simple: save your time and keep your focus on learning and building things.

### AT LAST I WILL SAY DON'T USE WINDOWS


