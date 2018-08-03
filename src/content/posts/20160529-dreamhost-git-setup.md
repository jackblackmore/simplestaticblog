---
title:: Dreamhost GIT Setup
tags: git, web
date: 2016-05-29
---
Used the following article to install GIT: [https://craigjolicoeur.com/blog/hosting-git-repositories-on-dreamhost](https://craigjolicoeur.com/blog/hosting-git-repositories-on-dreamhost)

Create newgit function in server `.bashrc`

    :::bash
    newgit()
    {
        if [ -z $1 ]; then
            echo "usage: $FUNCNAME project-name.git"
        else
            user="USERNAME"
            gitdir="/home/$USER/git/repos/$1"
            mkdir $gitdir
            pushd $gitdir
            git --bare init
            git --bare update-server-info
            mv hooks/post-update.sample hooks/post-update
            chmod a+x hooks/post-update
            touch git-daemon-export-ok
            popd
        fi
    }
    
Using Git-Bash locally, create pushnewgit function in git-bash .bashrc, turns the local folder into a git repo, runs newgit on the server via ssh, sets up the remote connection then pushes everything

    :::bash
    pushnewgit()
    {
        if [ -z $1 ]; then
            echo "usage: $FUNCNAME project-name.git"
        else
            USER="USERNAME"
            gitdir="$1"
            ssh $USER@ckmo.re newgit $gitdir
            git init
            git update-server-info
            mv ./.git/hooks/post-update.sample ./.git/hooks/post-update
            chmod a+x ./.git/hooks/post-update
            touch ./.git/git-daemon-export-ok
            git remote add origin ssh://$USER@ckmo.re:/home/$USER/git/repos/$1
            git add *
            git commit -m "Initial Repo Creation"
            git push origin master
        fi
    }

Notes:

* git –bare init on server repo (remote repos do not contain working directory) git init locally sets up git in .git folder
* connecting using ssh-keygen -t rsa to generate keys, move public key to ~.ssh then use cat id_rsa.pub >> ~/.ssh/authorized_keys to append to authorized_keys file.
* Ensure private key is in ~/.ssh/ locally, this is currently different for mobaxterm and git-bash