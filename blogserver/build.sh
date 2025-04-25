#!/bin/env bash

find /vmstorage/Server/mattvandenberg.com/blog -mindepth 1 -not -path "/vmstorage/Server/mattvandenberg.com/blog/img*" -exec rm -rf {} \;
cd /home/matt/website/blogserver
npm run build
cd public
cp -r * /vmstorage/Server/mattvandenberg.com/blog
cd /vmstorage/Server/mattvandenberg.com/blog
systemctl restart apache2
