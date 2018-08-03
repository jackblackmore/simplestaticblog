---
title:: Git Config
tags: GIT
date: 2016-08-24
---
Some bits and bobs for GIT setup
    
    :::cfg
    git config --global user.name "bla.ckmo.re"
    git config --global user.email "bl@ckmo.re"
    git config --global alias.lg "log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all"