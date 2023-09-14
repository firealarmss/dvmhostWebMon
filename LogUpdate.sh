#!/bin/bash

config_file=~/dvmhostWebMon/config.example.yml

currentMonth=$(date +%Y-%m)
currentDate=$(date +%d)

new_logFiles="- /var/log/centrunk/DVM-${currentMonth}-${currentDate}.activity.log"

sed -i "s|- /var/log/centrunk/DVM-2023-[^.]*.activity.log|$new_logFiles|" "$config_file"

echo "Updated $config_file"

pkill -f "node index.js -c config.example.yml"

node index.js -c config.example.yml > /dev/null & echo "$!" > /tmp/webmon.pid