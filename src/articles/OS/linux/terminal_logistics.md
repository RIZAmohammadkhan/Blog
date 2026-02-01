---
title: Pilot the Terminal
subtitle: Navigating with intent
readTime: 10 min
date: 2026-02-01
tags: terminal, cd, bash, ls
---
# I Opened Terminal, Now What?

Alright, so you've just opened the terminal for the first time. Let's get you comfortable with it.

## Understanding the Prompt

The first thing staring at you is the prompt. It looks something like this:

```bash
riza@laps:~$
```

Let me break this down for you. The `riza` part is your username, then you see `@` followed by `laps` which is your computer's hostname (basically your system's name). That squiggly line `~` is shorthand for your home directory. Think of it as your personal folder where all your stuff lives.

Want to see exactly where you are? Just type `pwd` (print working directory) and hit enter:

```bash
riza@laps:~$ pwd
/home/riza
```

See? The `~` was just a friendly way of saying `/home/riza`. Every time you open a terminal, you start here in your home directory.

## Let's Start Creating Stuff

### Making Files

Time to create your first file. We'll use the `touch` command:

```bash
riza@laps:~$ touch new.txt
```

Done! You just created an empty file called `new.txt`. The command runs silently no news is good news in the terminal world.

But wait, how do we know it actually worked? Let's check what's in our directory using `ls` (list):

```bash
riza@laps:~$ ls
Documents   Downloads   Music   Pictures   new.txt
```

There it is! Your `new.txt` sitting right there with all your other folders.

### Deleting Files

Changed your mind about that file? No problem. The `rm` command (remove) will delete it:

```bash
riza@laps:~$ rm new.txt
```

Let's confirm it's gone:

```bash
riza@laps:~$ ls
Documents   Downloads   Music   Pictures
```

Yep, it's gone. Just be careful with `rm`there's no trash bin or undo button in the terminal!

### Creating Directories

Now let's make a folder (we call them "directories" in terminal-speak). Use the `mkdir` command (make directory):

```bash
riza@laps:~$ mkdir IamAfolder
```

Check it out:

```bash
riza@laps:~$ ls
IamAfolder   Documents   Downloads   Music   Pictures
```

Sweet! Your folder is there.

### Working with Nested Folders and Files

Let's get a bit fancier. We'll create a folder called `parent` and put a file called `child.txt` inside it:

```bash
riza@laps:~$ mkdir parent
riza@laps:~$ touch ./parent/child.txt
```

Let me explain that second command. The `.` means "current directory" (where you are right now). Then we use `/` to navigate into the `parent` folder, and finally we create `child.txt` inside it. In Linux, `/` is how we separate folders in a path.

### Moving Between Directories

Want to actually go inside that folder? Use `cd` (change directory):

```bash
riza@laps:~$ cd parent
riza@laps:~/parent$
```

Notice how the prompt changed? Now it shows `~/parent` instead of just `~`. You're inside the parent folder now.

Let's see what's in here:

```bash
riza@laps:~/parent$ ls
child.txt
```

Perfect! Our file is there.

Now, how do we get back? Use `..` which means "go up one level":

```bash
riza@laps:~/parent$ cd ..
riza@laps:~$
```

You're back home. The `..` is super useful—think of it as the "back" button.

Want to jump straight home from anywhere? Just type `cd` with no arguments:

```bash
riza@laps:~/parent$ cd
riza@laps:~$
```

### Deleting Directories

If you want to remove an empty directory, use `rmdir`:

```bash
riza@laps:~$ mkdir empty_folder
riza@laps:~$ rmdir empty_folder
```

But what if the directory has stuff in it? `rmdir` won't work. You need `rm -rf` (remove recursively with force):

```bash
riza@laps:~$ rm -rf parent
```

The `-r` means "recursive" (delete everything inside), and `-f` means "force" (don't ask for confirmation). Be VERY careful with this command it's powerful and unforgiving!

### Moving and Renaming Files

Let's create a file and move it into a directory:

```bash
riza@laps:~$ touch move.txt
riza@laps:~$ mkdir dirrr
riza@laps:~$ mv move.txt dirrr/move.txt
```

The `mv` command (move) takes two arguments: the source and the destination. We just moved `move.txt` into the `dirrr` folder.

Here's a cool trick: `mv` also renames files! If you "move" a file to a new name in the same directory, you're actually renaming it:

```bash
riza@laps:~$ touch oldname.txt
riza@laps:~$ mv oldname.txt newname.txt
```

### Copying Files

To copy instead of move, use `cp`:

```bash
riza@laps:~$ touch original.txt
riza@laps:~$ cp original.txt copy.txt
```

Now you have both files—the original and the copy.

For directories, you need the `-r` flag (recursive):

```bash
riza@laps:~$ mkdir original_folder
riza@laps:~$ cp -r original_folder copy_folder
```

---
now as we have completed the basic navigation we are ready to install our packages checkout `linux/arch/package_management.md` for next steps.

## HAPPY PACKING
