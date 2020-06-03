#!/bin/bash
for HOOK_FROM in git-hooks/*
do 
    HOOK=$(basename $HOOK_FROM)
    HOOK_TO=.git/hooks/$HOOK
    if [[ -e $HOOK_LINK || -L $HOOK_LINK ]]
    then
        echo "mv $HOOK_LINK $HOOK_LINK.old"
        mv $HOOK_LINK $HOOK_LINK.old
    fi
    echo "cp $HOOK_FROM $HOOK_TO"
    cp $HOOK_FROM $HOOK_TO
    echo "chmod 766 $HOOK_FROM"
    chmod 766 $HOOK_TO
done
