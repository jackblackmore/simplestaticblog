---
title:: Terminal environment setup with ConEmu, Cygwin, Zsh and Oh-My-Zsh
tags: config, conemu, cygwin, zsh, oh-my-zsh
---

# Cygwin
1. [Download Cygwin](https://cygwin.com/install.html)
2. Install and ensure `wget` included

## apt-cyg
3. `wget rawgit.com/transcode-open/apt-cyg/master/apt-cyg`
4. `install apt-cyg /bin`
5. `apt-cyg install git gdb dos2unix openssh zsh nano`

## Zsh and Oh-My-Zsh
1.  Install Oh-My-Zsh `sh -c "$(wget -qO- https://raw.githubusercontent.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"`
2.  Add the following changes to `~/.zshrc`
    ```
    ZSH_THEME="agnoster"
    plugins=(git colorize)
    prompt_context() {} 
    ```
3. `cp ~/.oh-my-zsh/themes/agnoster.zsh-theme  ~/.oh-my-zsh/themes/`
    Add the following changes taken from this [github page](https://gist.github.com/atrakeur/1885c4b279d73c4f84c5b1223b5981ac)

    ```bash
    # Git: branch/detached head, dirty status
    prompt_git() {
    local ref dirty mode repo_path
    repo_path=$(git rev-parse --git-dir 2>/dev/null)

    if $(git rev-parse --is-inside-work-tree >/dev/null 2>&1); then
        ref=$(git symbolic-ref HEAD 2> /dev/null) || ref="➦ $(git show-ref --head -s --abbrev |head -n1 2> /dev/null)"

        # --- Atrakeur's mod START ---
        # Status is ten time faster that native is dirty
        if [[ -z $(git status -s) ]]; then
        prompt_segment green black
        else
        prompt_segment yellow black
        fi
        # --- Atrakeur's mod END ---

        if [[ -e "${repo_path}/BISECT_LOG" ]]; then
        mode=" <B>"
        elif [[ -e "${repo_path}/MERGE_HEAD" ]]; then
        mode=" >M<"
        elif [[ -e "${repo_path}/rebase" || -e "${repo_path}/rebase-apply" || -e "${repo_path}/rebase-merge" || -e "${repo_path}/../.dotest" ]]; then
        mode=" >R>"
        fi

        setopt promptsubst
        autoload -Uz vcs_info

        zstyle ':vcs_info:*' enable git
        zstyle ':vcs_info:*' get-revision true
        zstyle ':vcs_info:*' check-for-changes true
        zstyle ':vcs_info:*' stagedstr '✚'
        zstyle ':vcs_info:git:*' unstagedstr '●'
        zstyle ':vcs_info:*' formats ' %u%c'
        zstyle ':vcs_info:*' actionformats ' %u%c'

        # --- Atrakeur's mod START ---
        # that line kills perfs (+0.5ms!!),and doesnt seems to change the output
        # vcs_info
        # --- Atrakeur's mod END ---
        echo -n "${ref/refs\/heads\// }${vcs_info_msg_0_%% }${mode}"
    fi
    }
    ```

Even with the above changes I was finding the prompt too slow when in a large repo so I ended up disabling the status checking all together
    ``` bash
    prompt_git() {
    (( $+commands[git] )) || return
    if [[ "$(git config --get oh-my-zsh.hide-status 2>/dev/null)" = 1 ]]; then
        return
    fi
    local PL_BRANCH_CHAR
    () {
        local LC_ALL="" LC_CTYPE="en_US.UTF-8"
        PL_BRANCH_CHAR=$'\ue0a0'         # 
    }
    local ref dirty mode repo_path

    if $(git rev-parse --is-inside-work-tree >/dev/null 2>&1); then
        ref=$(git symbolic-ref HEAD 2> /dev/null) || ref="➦ $(git rev-parse --short HEAD 2> /dev/null)"
        prompt_segment red black

        if [[ -e "${repo_path}/BISECT_LOG" ]]; then
        mode=" <B>"
        elif [[ -e "${repo_path}/MERGE_HEAD" ]]; then
        mode=" >M<"
        elif [[ -e "${repo_path}/rebase" || -e "${repo_path}/rebase-apply" || -e "${repo_path}/rebase-merge" || -e "${repo_path}/../.dotest" ]]; then
        mode=" >R>"
        fi
                                    
        setopt promptsubst                         
        autoload -Uz vcs_info                      
                                                
        zstyle ':vcs_info:*' enable git            
        zstyle ':vcs_info:*' get-revision true     
        zstyle ':vcs_info:*' check-for-changes true
        zstyle ':vcs_info:*' stagedstr '✚'
        zstyle ':vcs_info:*' unstagedstr '●'
        zstyle ':vcs_info:*' formats ' %u%c'
        zstyle ':vcs_info:*' actionformats ' %u%c'

    #    vcs_info

        echo -n "${ref/refs\/heads\//$PL_BRANCH_CHAR }${vcs_info_msg_0_%% }${mode}"
    fi
    }
    ```

    ```bash
        ## Main prompt
    build_prompt() {
    RETVAL=$?
    prompt_status
    #  prompt_virtualenv
    #  prompt_aws
    prompt_context
    prompt_dir
    prompt_git
    #  prompt_bzr
    #  prompt_hg
    prompt_end
    }
    ```

4. Install powerline font
    `git clone https://github.com/powerline/fonts.git`
    Open in explorer and double click the fonts to install, currently using Ubuntu Mono derivative Powerline size 13

## ConEmu
1. Download and install [ConEmu](https://conemu.github.io/)
2. Create zsh shell / task
    ```
    Name: Cygwin:zsh
    Command: set CHERE_INVOKING=1 & set "PATH=%ConEmuDrive%\cygwin64\bin;%PATH%" & %ConEmuBaseDirShort%\conemu-cyg-64.exe -new_console:p %ConEmuDrive%\cygwin64\bin\zsh.exe --login -i -new_console:C:"%ConEmuDrive%\cygwin64\Cygwin.ico"
    ```
3. Colour theme made from Monokai Pro, add to ConEmu.xml or lift whole config file from my github
    ```xml
    <key name="Colors" modified="2019-08-30 14:37:40" build="190714">          
         <value name="Count" type="long" data="1"/>                         
         <key name="Palette1" modified="2019-08-30 14:37:40" build="190714">
                 <value name="Name" type="string" data="Monokai Pro"/>      
                 <value name="TextColorIdx" type="hex" data="10"/>          
                 <value name="BackColorIdx" type="hex" data="10"/>          
                 <value name="PopTextColorIdx" type="hex" data="10"/>       
                 <value name="PopBackColorIdx" type="hex" data="10"/>       
                 <value name="ColorTable00" type="dword" data="005c595b"/>  
                 <value name="ColorTable01" type="dword" data="00e86680"/>  
                 <value name="ColorTable02" type="dword" data="0076dca9"/>  
                 <value name="ColorTable03" type="dword" data="00dabe76"/>  
                 <value name="ColorTable04" type="dword" data="008861e1"/>  
                 <value name="ColorTable05" type="dword" data="00f29dab"/>  
                 <value name="ColorTable06" type="dword" data="003197cd"/>  
                 <value name="ColorTable07" type="dword" data="00fafcfc"/>  
                 <value name="ColorTable08" type="dword" data="005c595b"/>  
                 <value name="ColorTable09" type="dword" data="00e8dc78"/>  
                 <value name="ColorTable10" type="dword" data="0076dca9"/>  
                 <value name="ColorTable11" type="dword" data="00e8dc78"/>  
                 <value name="ColorTable12" type="dword" data="008861e1"/>  
                 <value name="ColorTable13" type="dword" data="00f200f0"/>  
                 <value name="ColorTable14" type="dword" data="0066d8ff"/>  
                 <value name="ColorTable15" type="dword" data="00fafcfc"/>  
         </key>                                                             
    </key>                                                                     
    ```
4. Add right click integration from `Settings > Integration` 
    ```
    Menu Item: Open ConEmu Cygwin Here
    Command: {Cygwin::zsh} -cur_console:n
    Icon file: C:\cygwin64\cygwin.ico
    ```
5.  If you have issues with backspace (usually after 80 characters) adding a new line mine was due to the editor `nano` returning funny exit codes. Make sure you run it through winpty i.e. `winpty nano` and it fixed the issue.
    It helped to add `alias nano=winpty nano` in `~/.zshrc` and also update your git config `git config --global core.editor "winpty nano"`

# WSL
Will add full details at some point but now using Windows Subsystem for Linux (WSL) Ubuntu so no need for Cygwin

## Ubuntu / ZSH
I really struggled getting `ls` autocomplete colours to match what was specified in `LS_COLORS` / `dircolors` with bash but didn't have the same issue with zsh. It looks like the `ls` and `cd` autocomplete are using the WSL default colours.

I'm using `dircolors.256dark` and added the following to `~/.zshrc`

    ```bash
    eval `dircolors ~/dircolors.256dark`
    zstyle ':completion:*:default' list-colors ${(s.:.)LS_COLORS}
    ```

## ConEmu
Uing the wsl-bridge recommended on the conemu website slowed down ZSH autocomplete massively so using the following task and all working fine so far
    ```
    Name: Ubuntu::zsh
    Command: %windir%\system32\bash.exe -cur_console:p5 -c zsh 
    ```

