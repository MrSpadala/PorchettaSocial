#!/usr/bin/env python

# Cleans up all the Docker monnezza 

import sys
import subprocess

def call(args):
    return subprocess.call(args.split(' '))
    
def echo(msg):
    call('echo '+msg)



echo('---------- Deleting unused images ----------')
call('sudo docker image prune -f')


echo('---------- Deleting unused containers ----------')
call('sudo docker container prune -f')


echo('---------- Deleting unused networks ----------')
call('sudo docker network prune -f')

