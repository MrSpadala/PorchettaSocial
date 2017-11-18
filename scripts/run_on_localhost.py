#!/usr/bin/env python

# Runs on localhost

import os
import sys
import subprocess


# RABBITMQ MUST BE RUNNING


wd = os.getcwd().split('/')[-1]
if  wd != 'scripts':
    print('Change your working directory to \'scripts/\' folder (current: '+wd+'/)')
    sys.exit(1)
    
    
def call(args):
    args += ' &'
    return subprocess.call(args, shell=True)
    
def echo(msg):
    call('echo '+msg)

def err():
    echo('---------- RUN ERROR ----------\nKilling...')
    call('sudo killall python3 python')
    sys.exit(1)




echo('---------- Starting MainServer ----------')
if call('cd ../MainServer/ && sudo node ../MainServer/mainserver.js') != 0:
    err()


echo('---------- Starting Twitter ----------')
if (call('python3 ../Twitter/queue_twt.py') or
    call('python3 ../Twitter/twitter_authentication_websocket.py')!= 0):
    err()
    
    
echo('---------- Starting Tumblr ----------')
if (call('python3 ../Tumblr/queue_tmb.py') or
    call('python3 ../Tumblr/tumblr_authentication_websocket.py')!= 0):
    err()


echo('OK')

