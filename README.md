# docker-authz-node
Experiment to build an docker authz plugin using Node.js

To install on Docker Toolbox:  
- run index.js on a host
- adjust the 'addr' in the nodejs-authz-example.json
- create a folder /etc/docker/plugins on your docker host
- place the nodejs-authz-example.json in /etc/docker/plugins
- edit /mnt/sda1/var/lib/boot2docker/profile and add
```
--authorization-plugin nodejs-authz-example
```
so the result looks like:
```
EXTRA_ARGS='
--label provider=virtualbox
--authorization-plugin nodejs-authz-example

'
```
- restart the docker daemon using /etc/init.d/docker restart
