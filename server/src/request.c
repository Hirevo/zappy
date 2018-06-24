/*
** EPITECH PROJECT, 2018
** zappy
** File description:
** request
*/

#include "server.h"

bool handle_client(control_t *control, client_t *cl, size_t idx)
{
	bool to_evict = ((cl->node->revt & POLLHUP) == POLLHUP);

	(void)(control);
	(void)(idx);
	if (!to_evict && (cl->node->revt & POLLIN))
		to_evict = !(receive_data(cl) && extract_rbuf_cmd(cl));
	return (to_evict == false);
}

void free_player(control_t *control, client_t *client)
{
	event_player_death(control, client, "starvation");
	dprintf(client->fd, "dead\n");
	close(client->fd);
	poll_rm(&control->list, client->fd);
	llist_clear(client->pending, true);
	llist_destroy(client->pending);
	llist_for_each(client->cmd,
		(void (*)(void *, void *, size_t))(free_cmd), client);
	llist_destroy(client->cmd);
	team_remove_client(control, client);
	free(client);
}

bool find_evicted(void *t, void *s, size_t l)
{
	(void)l;
	return (s == t);
}

bool handle_request(control_t *control)
{
	list_t *tmp = control->clients;
	client_t *cl;

	control->clients = llist_filter(control->clients,
		(bool (*)(void *, void *, size_t))(handle_client), control);
	for (size_t i = 0; i < tmp->length; ++i) {
		cl = llist_at(tmp, i);
		if (!llist_find(control->clients, find_evicted, cl))
			evict_client(control, cl);
	}
	for (list_elem_t *it = control->clients->head; it; it = it->next) {
		cl = it->payload;
		cl->node->evt = POLLIN | (cl->pending->length ? POLLOUT : 0);
	}
	return (true);
}

bool proceed_clients(control_t *ctrl)
{
	bool to_evict;
	client_t *cl;

	for (size_t i = 0; i < ctrl->clients->length; ++i) {
		cl = llist_at(ctrl->clients, (size_t)i);
		to_evict = ((cl->node->revt & POLLHUP) == POLLHUP);
		if (!to_evict && cl->cmd->length && cl->state == ANONYMOUS)
			append_to_team(ctrl, cl);
		else if (cl->cmd->length && cl->state != ANONYMOUS &&
			!to_evict && cl->task.type == NONE)
			proceed_cmd(ctrl, cl);
		if (cl->task.type != NONE && !to_evict)
			exec_task(ctrl, cl);
		if (to_evict)
			evict_client(ctrl, cl);
	}
	return (to_evict == false);
}