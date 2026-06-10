#!/bin/sh

cd /path/to/chromikius/ || exit 1
audit=$(npm audit)
if [ $? -ne 0 ];then
    curl \
        -H "Title: NPM Audit" \
        -H "Tags: rotating_light" \
        -d "$audit" \
        ntfy.sh/Chromikius<secret>
fi
