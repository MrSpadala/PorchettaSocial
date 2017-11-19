#!/usr/bin/env python

# Stops all porchetta containers

import sys
import subprocess

def call(args):
    return subprocess.call(args.split(' '))
    
def echo(msg):
    call('echo '+msg)


echo('---------- Stopping twitter module ----------')
call('sudo docker stop -t 10 twitter')

echo('---------- Stopping tumblr module ----------')
call('sudo docker stop -t 10 tumblr')
    
echo('----------Stopping flickr module ----------')
call('sudo docker stop -t 10 flickr')
 

echo('----------Stopping main server ----------')
call('sudo docker stop -t 10 mainserver')
   
    
echo('---------- Stopping rabbitmq ----------')
call('sudo docker stop -t 10 rabbitmq')
   
   
echo('OK')
