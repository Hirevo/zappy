wget 172.17.0.5:80/private-blih-sshkey
chmod 400 private-blih-sshkey

git remote set-url --push origin git@git.epitech.eu:/maxime.jenny@epitech.eu/PSU_zappy_2017
GIT_SSH_COMMAND="ssh -i private-blih-sshkey" git push
