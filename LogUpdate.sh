#!/bin/bash
# Updates config.example.yml with the current year, month, and date. 
# $(date +%Y-%m) is stored as currentMonth, and $(date +%d) is stored as currentDate. 
# That is updated in example.yml on new_logFiles. 
# Kills the process and then relaunches it.

config_file=~/dvmhostWebMon/config.example.yml

currentMonth=$(date +%Y-%m)
currentDate=$(date +%d)

new_logFiles="- /var/log/centrunk/DVM-${currentMonth}-${currentDate}.activity.log"

sed -i "s|- /var/log/centrunk/DVM-2023-[^.]*.activity.log|$new_logFiles|" "$config_file"

echo "Updated $config_file"

pkill -f "node index.js -c config.example.yml"

node index.js -c config.example.yml > /dev/null & echo "$!" > /tmp/webmon.pid