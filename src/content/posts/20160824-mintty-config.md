---
title:: MiNTTY Config
tags: config, mintty, cygwin, mingw32
date: 2016-08-24
---
`.bashrc`

    :::cfg
    PS1="\[\033[01;34m\]{ \[\033[01;34m\]\W \[\033[01;34m\]}\[\033[01;32m\] \$( git rev-parse --abbrev-ref HEAD 2> /dev/null || echo "" ) \[\033[01;31m\]» \[\033[00m\]"

    alias curl='curl -A "$USER_AGENT"'
    alias egrep='egrep --color=auto'
    alias emacs='emacs-nox'
    alias fgrep='fgrep --color=auto'
    alias grep='grep --color=auto'
    alias ls='ls --color=auto'
    alias open='cygstart'
    alias pbcopy='cat >/dev/clipboard'
    alias pbpaste='cat /dev/clipboard'
    alias vi='vim'
    alias wget='wget --user-agent="$USER_AGENT"'
    alias cyginstall='setup-x86_64.exe -q -P'
    
The last entry is mainly for cygwin, if you move the setup exe into cygwin BIN you can then call cyginstall to install files from the command line

`.inputrc`

Uncomment or add `set completion-ignore-case on`

`.mintty`

    :::cfg
    BoldAsFont=-1
    BackspaceSendsBS=yes
    Font=Consolas
    FontHeight=10
    Locale=en_GB
    Charset=UTF-8
    Columns=170
    Rows=35
    ScrollbackLines=99000
    Term=xterm-256color
    BellType=0
     
    ForegroundColour = 208, 208, 208
    BackgroundColour =  28,  28,  28
    CursorColour     = 255, 175,   0
    IMECursorColour  = 128, 224, 160
    Black            =  12,  12,  12
    BoldBlack        =  10,  10,  10
    Red              = 215, 135, 135
    BoldRed          = 223, 135, 135
    Green            = 175, 215, 135
    BoldGreen        = 175, 223, 135
    Yellow           = 247, 247, 175
    BoldYellow       = 255, 255, 175
    Blue             = 135, 175, 215
    BoldBlue         = 135, 175, 223
    Magenta          = 215, 175, 215
    BoldMagenta      = 223, 175, 223
    Cyan             = 175, 215, 215
    BoldCyan         = 175, 223, 223
    White            = 230, 230, 230
    BoldWhite        = 238, 238, 238