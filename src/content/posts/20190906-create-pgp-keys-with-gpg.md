---
title:: Create PGP keypair with GPG
tags: GPG, PGP, encryption
---

May flesh out at some point

``` bash
gpg --gen-key

Please select what kind of key you want:
    (1) RSA and RSA (default)
    (2) DSA and Elgamal
    (3) DSA (sign only)
    (4) RSA (sign only)
Your selection? 1

RSA keys may be between 1024 and 4096 bits long.
What keysize do you want? (2048) 2048

Please specify how long the key should be valid.
        0 = key does not expire
    <n>  = key expires in n days
    <n>w = key expires in n weeks
    <n>m = key expires in n months
    <n>y = key expires in n years
Key is valid for? (0) 0
Key does not expire at all
Is this correct? (y/N) y
```

Add user details and passphrase

`gpg --list-keys` shows all keys
```
/c/Users/User/.gnupg/pubring.gpg
------------------------------------
pub   2048R/E571D109 2019-09-06
uid                  User Name (Comment) <email@address.com>
sub   2048R/8B8EA319 2019-09-06
```
Export keys with, `-a` armours the key i.e. exports as ascii
```
gpg -a --export-secret-key E571D109 > secret-key.asc
gpg -a --export E571D109 > public-key.asc
```

