# Fish completions for eush77/readman (npm install readman -g).
#
# Install: put this file to a directory listed in $fish_complete_path.
#

complete -c readman -xa "(ls -1 node_modules ^/dev/null)"
complete -c readman -l help -d "Show help"
complete -c readman -l version -d "Print version"
complete -c readman -l global -d "Show readme for a globally installed module"
