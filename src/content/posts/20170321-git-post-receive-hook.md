---
title:: Using POST-RECEIVE hook to auto-checkout bare repo
tags: GIT
date: 2017-03-21
---
Referenced from [http://toroid.org/git-website-howto](http://toroid.org/git-website-howto)

Update the post-receive hook in your bare GIT repo to automatically checkout your repo after each push.
    
    :::bash
    $ echo '#!/bin/sh' > hooks/post-receive
    $ echo 'GIT_WORK_TREE=/location/you/want/to/checkout/to git checkout -f' > hooks/post-receive
    $ chmod +x hooks/post-receive