#!/bin/bash
for HOOK_PATH in git-hooks/*
do 
    HOOK=$(basename $HOOK_PATH)
    HOOK_LINK=.git/hooks/$HOOK
    if [[ -e $HOOK_LINK || -L $HOOK_LINK ]]
    then
        echo "mv $HOOK_LINK $HOOK_LINK.old"
        mv $HOOK_LINK $HOOK_LINK.old
    fi
    echo "ln -s $HOOK_PATH $HOOK_LINK"
    ln -s $HOOK_PATH $HOOK_LINK
done
