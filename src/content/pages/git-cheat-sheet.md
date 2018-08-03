---
title: GIT Cheat Sheet
tags: cheatsheet
date: 2017-12-28
---
Hopefully this will take shape once there's enough to properly categorise! At the moment it's nothing more than some bits and pieces I don't want to google again.

#General (until there's enough for a proper category)
- To untrack files from index if you've updated `.gitignore` use: `git rm --cached <files>`
- To overwrite a previous commit you can use the `--amend` flag: `git commit -m "message" --amend`.
    - This can cause issues with shared repos so be careful. If you're sure you're the only one using the repo you can use `--force` with `push` to correct the remote but be prepared for a scolding
    
#Todo:
- Branches
- Merging
- Switching commits / stashing changes

