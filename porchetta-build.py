#!/usr/bin/env python

# Builds all docker images

import sys
import subprocess

def call(args):
    subprocess.call(args.split(' '))

def err():
    print('Command returned non 0 value, see build.log')
    sys.exit(1)

log = ' >> ./build.log 2>&1'

print('Creating network')
if call('sudo docker network create porchetta-net '+log) != None:
    err()

print('Building MainServer image')
if call('sudo docker build -t mainserver ./MainServer '+log) != None:
    err()

print('Building Twitter image')
if call('sudo docker build -t twitter ./Twitter '+log) != None:
    err()
