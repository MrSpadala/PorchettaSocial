#!/usr/bin/env python

# Cleans up all the Docker monnezza 

import sys
import subprocess

def call(args):
    subprocess.call(args.split(' '))

def err():
    print('Command returned non 0 value, see cleanup.log')
    sys.exit(1)

log = ' >> ./cleanup.log 2>&1'

print('Deleting unused images')
if call('sudo docker image prune -f') != None:
    err()

print('Deleting unused containers')
if call('sudo docker container prune -f') != None:
    err()

print('Deleting unused networks')
if call('sudo docker network prune -f') != None:
    err()
