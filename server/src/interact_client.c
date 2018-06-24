/*
** EPITECH PROJECT, 2018
** zappy
** File description:
** interact_client
*/

#include "server.h"

void free_cmd(client_t *client, cmd_t *cmd, size_t idx)
{
	(void)(idx);
	(void)(client);
	free_json(cmd->json);
	clear_cmd(cmd);
}

bool evict_client(control_t *control, client_t *cl)
{
	event_player_death(control, cl, "disconnection");
	team_remove_client(control, cl);
	poll_rm(&control->list, cl->fd);
	llist_clear(cl->pending, true);
	llist_destroy(cl->pending);
	llist_for_each(
		cl->cmd, (void (*)(void *, void *, size_t))(free_cmd), cl);
	llist_destroy(cl->cmd);
	close(cl->fd);
	free(cl);
	return (true);
}

bool write_to_client(control_t *control, client_t *cl)
{
	char *str = llist_remove(cl->pending, 0);

	(void)(control);
	if (str)
		dprintf(cl->fd, "%s\n", str);
	free(str);
	if (cl->pending->length == 0)
		cl->node->evt = POLLIN;
	return (true);
}

bool append_special_client(control_t *control, client_t *client, char *type)
{
	(void)(control);
	if (lstr_equals(type, "gui"))
		client->state = GUI;
	else if (lstr_equals(type, "admin"))
		client->state = ADMIN;
	else {
		add_pending(client, strdup(KO_MSG));
		return (false);
	}
	add_pending(client, strdup(OK_MSG));
	return (true);
}

bool append_to_team(control_t *control, client_t *client)
{
	cmd_t *cmd = llist_remove(client->cmd, 0);
	char *str;

	if (lstr_equals(cmd->name, "gui") || lstr_equals(cmd->name, "admin"))
		return (append_special_client(control, client, cmd->name));
	for (size_t i = 0; i < control->params.nteam; ++i)
		if (control->teams[i].av &&
			lstr_equals(control->teams[i].name, cmd->name)) {
			team_add_client(control, client, cmd->name);
			asprintf(&str, "%lu", control->teams[i].av);
			add_pending(client, str);
			asprintf(&str, "%lu %lu", control->params.width,
				control->params.height);
			add_pending(client, str);
			client->state = PLAYER;
			event_player_join(control, client);
			return (true);
		}
	add_pending(client, strdup(KO_MSG));
	return (true);
}