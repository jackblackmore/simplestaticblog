---
title:: Bash Cheat Sheet
tags: cheatsheet
---

## Redirection
## find

Usage: `find [path] [expression]` 

### Examples

`-exec .... \;` vs `-exec .... +`
```
{ dest } » ls -l
-rw-r--r-- 1 30137120 Domain Users 0 Aug 30 11:22 file1
-rw-r--r-- 1 30137120 Domain Users 0 Aug 30 11:22 file2
{ dest } » find . -type f -exec echo {} +
./file1 ./file2
{ dest } » find . -type f -exec echo {} \;
./file1
./file2
{ dest} »
```

## grep

## xargs

Usage: `xargs -I {} mv {} ./Newlocation/