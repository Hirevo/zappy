/*
** EPITECH PROJECT, 2018
** zappy
** File description:
** main
*/

#include "server.h"
#include "socket/src/socket.h"
#include <math.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <sys/types.h>
#include <time.h>
#include <unistd.h>

void add_pending(client_t *cl, char *msg)
{
	llist_push(cl->pending, 1, msg);
	cl->node->evt = POLLIN | POLLOUT;
}

ssize_t receive_data(client_t *cl)
{
	ssize_t ret = 0;
	char data[CMD_SIZE];
	int len = cl->rbuf.size;
	int *epos = &cl->rbuf.end;
	char *rbuf = cl->rbuf.buffer;

	ret = recv(cl->fd, data, CMD_SIZE, 0);
	for (int i = 0; i < ret; ++i) {
		rbuf[*epos] = data[i];
		*epos = (*epos + 1) % len;
	}
	return (ret);
}

static bool perfom_poll_actions(control_t *ctrl)
{
	client_t *client;

	if (poll_canread(ctrl->list, ctrl->fd)) {
		CHECK(add_new_client(ctrl), == false, 84);
	}
	else if (ctrl->clients->length)
		handle_request(ctrl);
	for (list_elem_t *it = ctrl->clients->head; it; it = it->next) {
		client = it->payload;
		if (client->pending->length && (client->node->revt & POLLOUT))
			write_to_client(ctrl, client);
	}
	return (true);
}

static bool cycle_adjustment(control_t *ctrl)
{
	struct timeval stop, start;
	long tr = (long)(round(1 * 1e3 / ctrl->params.tickrate));
	long ms = tr;
	double i1;
	double i2;

	CHECK(gettimeofday(&start, NULL), == -1, -1);
	while (ms > 0) {
		if (poll_wait(ctrl->list, (int)ms) > 0)
			perfom_poll_actions(ctrl);
		CHECK(gettimeofday(&stop, NULL), == -1, -1);
		i1 = stop.tv_sec * 1e6 + stop.tv_usec;
		i2 = start.tv_sec * 1e6 + start.tv_usec;
		ms = tr - (long)((round(i1 - i2) / 1e3));
	}
	return (true);
}

int main(int ac, const char **av)
{
	control_t ctrl = {0};
	params_t params = {false, 4242, 20, 20, 0, 0, 5, 100};
	int ret;

	srand(getpid() * time(0));
	ctrl.params = params;
	if (parse_args((size_t)(ac), av, &ctrl.params) == false)
		return (84);
	if (ctrl.params.help)
		return (disp_help(av[0]));
	CHECK(ctrl_init(&ctrl), == false, 84);
	CHECK(ctrl.fd = create_server(ctrl.params.port), == -1, 84);
	CHECK(poll_add(&ctrl.list, ctrl.fd, POLLIN), == 0, 84);
	while (1) {
		CHECK(ret = cycle_adjustment(&ctrl), == false, 84);
		proceed_clients(&ctrl);
		consume_food(&ctrl);
		consume_eggs(&ctrl);
	}
	return (0);
}
