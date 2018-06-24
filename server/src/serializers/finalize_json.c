/*
** EPITECH PROJECT, 2018
** zappy
** File description:
** finalize_json
*/

#include "server.h"

void finalize_json(client_t *cl, object_t *ret, cmd_t *cmd)
{
	elem_t *elem = lobj_elem_init("object", ret);

	add_pending(cl, ljson_serialize(elem));
	free_elem(elem, false);
	if (cmd && cmd->json) {
		free_json(cmd->json);
		cmd->json = 0;
	}
}
