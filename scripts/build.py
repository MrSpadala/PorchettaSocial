#!/usr/bin/env python

# Builds all docker images

import os
import sys
import subprocess


wd = os.getcwd().split('/')[-1]
if  wd != 'scripts':
    print('Change your working directory to \'scripts/\' folder (current: '+wd+'/)')
    sys.exit(1)


def call(args):
    return subprocess.call(args.split(' '))
    
def echo(msg):
    call('echo '+msg)

def err():
    echo('---------- BUILD ERROR ----------')
    sys.exit(1)



echo('---------- Creating network ----------')
call('sudo docker network rm porchetta-net')
if call('sudo docker network create porchetta-net') != 0:
    err()


echo('---------- Building MainServer image ----------')
if call('sudo docker build -t mainserver ../MainServer') != 0:
    err()


echo('---------- Building Twitter image ----------')
if call('sudo docker build -t twitter ../Twitter') != 0:
    err()
    
    
echo('---------- Building Tumblr image ----------')
if call('sudo docker build -t tumblr ../Tumblr') != 0:
    err()


echo('---------- Building Flickr image ----------')
if call('sudo docker build -t flickr ../Flickr') != 0:
    err()



echo('OK')
