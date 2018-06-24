/*
** EPITECH PROJECT, 2018
** PSU_zappy_2017
** File description:
** server.h
*/

#pragma once

#include "list/src/list.h"
#include "object/src/object.h"
#include "json/src/json.h"
#include "poll/src/common.h"
#include <netinet/in.h>
#include <stddef.h>

#define RBUFFER_SIZE 4096
#define CMD_SIZE 2048
#define PLAYER_CMD_COUNT 12
#define GUI_CMD_COUNT 5
#define ADMIN_CMD_COUNT 8
#define FOOD_DELAY 126

#define OK_MSG "ok"
#define KO_MSG "ko"
#define WELCOME_MSG "WELCOME"
#define ELEVATION_MSG "Elevation underway"
#define LVLUP_MSG "Current level: %lu"
#define HELP_MSG                                                              \
	"USAGE: %s -p port -x width -y height -n name1 name2 ... -c "         \
	"clientsNb -f freq\n"                                                 \
	"\tport\t\tis the port number\n"                                      \
	"\twidth\t\tis the width of the world\n"                              \
	"\theight\t\tis the height of the world\n"                            \
	"\tnameX\t\tis the name of the team X\n"                              \
	"\tclientsNb\tis the number of authorized clients per team\n"         \
	"\tfreq\t\tis the reciprocal of time unit for execution of actions\n"

#ifndef CHECK
#define CHECK(x, y, z)                                                        \
	if ((x)y) {                                                           \
		dprintf(2, "[%s:%d]: %s\n", __FILE__, __LINE__,               \
			__FUNCTION__);                                        \
		return (z);                                                   \
	}
#endif

typedef enum facing_e { NORTH = 0, WEST, SOUTH, EAST } facing_t;

typedef enum state_e { ANONYMOUS = 0, PLAYER, GUI, ADMIN } state_t;

typedef enum task_type_e {
	NONE = 0,
	FORWARD,
	LEFT,
	RIGHT,
	LOOK,
	INVENTORY,
	BROADCAST,
	CONNECT_NBR,
	FORK,
	EJECT,
	TAKE,
	SET,
	INCANTATION
} task_type_t;

typedef enum item_s {
	FOOD = 0,
	LINEMATE,
	DERAUMERE,
	SIBUR,
	MENDIANE,
	PHIRAS,
	THYSTAME,
	ITEM_COUNT
} item_t;

typedef struct cell_s {
	size_t x;
	size_t y;
	list_t *items;
} cell_t;

typedef struct rbuf_s {
	char buffer[RBUFFER_SIZE];
	int start;
	int end;
	int size;
} rbuf_t;

typedef struct cmd_s {
	char cmd[CMD_SIZE];
	char name[CMD_SIZE];
	char **param;
	int nparam;
	json_t *json;
} cmd_t;

typedef struct params_s {
	bool help;
	size_t port;
	size_t width;
	size_t height;
	char **teams;
	size_t nteam;
	size_t nclt;
	size_t tickrate;
} params_t;

typedef struct vec2_s {
	size_t x;
	size_t y;
} vec2_t;

typedef struct vec2f_s {
	float x;
	float y;
} vec2f_t;

typedef struct task_s {
	size_t time;
	task_type_t type;
	char *data;
} task_t;

typedef struct client_s {
	int fd;
	char ip[INET_ADDRSTRLEN];
	size_t level;
	list_t *cmd;
	rbuf_t rbuf;
	size_t id;
	vec2_t pos;
	facing_t facing;
	size_t food_delay;
	poll_t *node;
	list_t *pending;
	task_t task;
	struct team_s *team;
	state_t state;
	size_t inventory[ITEM_COUNT];
} client_t;

typedef struct team_s {
	char *name;
	client_t **cl;
	size_t av;
	size_t size;
} team_t;

typedef struct egg_s {
	size_t id;
	size_t delay;
	team_t *team;
	vec2_t pos;
} egg_t;

typedef struct control_s {
	int fd;
	poll_t *list;
	list_t *eggs;
	list_t *clients;
	team_t *teams;
	cell_t *map;
	params_t params;

} control_t;

typedef struct tuple_s {
	char *cmd;
	void (*func)(control_t *, client_t *);
} tuple_t;

typedef struct param_parse_s {
	char *cmd;
	bool (*func)(size_t, const char **, params_t *, size_t *);
} param_parse_t;

/*
** Message flow management function
*/
void add_pending(client_t *, char *);

/*
** Client management function
*/
bool evict_client(control_t *, client_t *);

/*
** Command pre-processing
*/
void cmd_forward(control_t *, client_t *);
void cmd_right(control_t *, client_t *);
void cmd_left(control_t *, client_t *);
void cmd_look(control_t *, client_t *);
void cmd_inventory(control_t *, client_t *);
void cmd_broadcast(control_t *, client_t *);
void cmd_connect_nbr(control_t *, client_t *);
void cmd_fork(control_t *, client_t *);
void cmd_eject(control_t *, client_t *);
void cmd_take(control_t *, client_t *);
void cmd_set(control_t *, client_t *);
void cmd_incantation(control_t *, client_t *);

/*
** Command execution
*/
void exec_forward(control_t *, client_t *);
void exec_right(control_t *, client_t *);
void exec_left(control_t *, client_t *);
void exec_look(control_t *, client_t *);
void exec_inventory(control_t *, client_t *);
void exec_broadcast(control_t *, client_t *);
void exec_connect_nbr(control_t *, client_t *);
void exec_fork(control_t *, client_t *);
void exec_eject(control_t *, client_t *);
void exec_take(control_t *, client_t *);
void exec_set(control_t *, client_t *);
void exec_incantation(control_t *, client_t *);

/*
** Argument parsers
*/
bool parse_port(size_t, const char **, params_t *, size_t *);
bool parse_width(size_t, const char **, params_t *, size_t *);
bool parse_height(size_t, const char **, params_t *, size_t *);
bool parse_names(size_t, const char **, params_t *, size_t *);
bool parse_clients(size_t, const char **, params_t *, size_t *);
bool parse_freq(size_t, const char **, params_t *, size_t *);
bool parse_help(size_t, const char **, params_t *, size_t *);

/*
** JSON free utilities
*/
void free_elem_str(char *);
void free_list(void *, elem_t *, size_t);
void free_elem_list(list_t *);
void free_object(void *, char *, elem_t *);
void free_elem_obj(object_t *);
void free_elem(elem_t *, bool);
void free_json(json_t *);

/*
** Data serializers
*/
object_t *serialize_player(client_t *);
object_t *serialize_position(vec2_t);

/*
** Events
*/
void event_player_move(control_t *, client_t *);
void event_player_turn(control_t *, client_t *);
void event_incantation_start(control_t *, client_t *);
void event_incantation_fail(control_t *, client_t *);
void event_incantation_success(control_t *, client_t *);
void event_tickrate_switchover(control_t *);
void event_item_drop(control_t *, client_t *, item_t);
void event_item_pickup(control_t *, client_t *, item_t);
void event_player_death(control_t *, client_t *, char *);
void event_player_join(control_t *, client_t *);
void event_egg_drop_start(control_t *, client_t *);
void event_egg_drop_end(control_t *, client_t *, egg_t *);
void event_egg_hatch(control_t *, egg_t *);
void event_broadcast(control_t *, client_t *, char *);

bool display_object(object_t *);
void *double_to_void_ptr(double);
bool extract_rbuf_cmd(client_t *);
void proceed_cmd(control_t *, client_t *);
bool exec_task(control_t *, client_t *);
bool place_resources(control_t *);
void finalize_json(client_t *, object_t *, cmd_t *);
object_t *emit_command_error(char *);
object_t *emit_syntax_error(char *);
list_t *create_tile_data(control_t *, vec2_t);
void forward_event(control_t *, object_t *);
void clear_cmd(cmd_t *);
vec2_t move(control_t *, vec2_t, long, long);
item_t get_chosen_item(client_t *);
bool add_new_client(control_t *);
void free_cmd(client_t *, cmd_t *, size_t);

/*
** Teams
*/
bool team_add_client(control_t *, client_t *, char *);
bool team_remove_client(control_t *, client_t *);
void team_add(control_t *, char *);
bool team_remove(control_t *, char *);
bool team_init(control_t *);
void team_realloc_arr(control_t *);
void team_release(team_t *);
void helper_team_remove(control_t *, size_t);
bool *same_level(client_t *client, bool *acc, client_t *elem, size_t idx);

/*
** Args parsing
*/
int disp_help(const char *);
bool parse_args(size_t, const char **, params_t *);
void add_param(cmd_t *, char *);

/*
** Resource consuming
*/
bool consume_food(control_t *);
void consume_eggs(control_t *);

/*
** Requests
*/
bool handle_request(control_t *);
bool find_evicted(void *, void *, size_t);
void free_player(control_t *, client_t *);
bool handle_client(control_t *, client_t *, size_t );
bool proceed_clients(control_t *);
bool write_to_client(control_t *, client_t *);
bool evict_client(control_t *, client_t *);
bool append_special_client(control_t *, client_t *, char *);
bool append_to_team(control_t *, client_t *);
bool ctrl_init(control_t *);
ssize_t receive_data(client_t *);

/*
** Map
*/
bool init_map(control_t *);
list_t *map_get(control_t *, size_t, size_t);
void map_add(control_t *, size_t, size_t, item_t);
void map_remove(control_t *, size_t, size_t, item_t);
bool display_map(control_t *);
void move_forward(control_t *, client_t *);
void move_directed(control_t *, client_t *, facing_t);

/*
** Incantation
*/
list_t *count_clients(control_t *, vec2_t);
size_t count_items(control_t *, vec2_t, item_t);
void upgrade_level(control_t *, client_t *, size_t);

/*
** resource_gen
*/
bool place_resources(control_t *);

/*
** admin commands
*/
void adm_teams(control_t *, client_t *);
void adm_spawn(control_t *, client_t *);
void adm_tickrate(control_t *, client_t *);
void adm_lvlup(control_t *, client_t *);
void adm_cast(control_t *, client_t *);
void adm_killall(control_t *, client_t *);
void adm_move(control_t *, client_t *);
void adm_getids(control_t *, client_t *);

/*
** GUI commands
*/
void gui_map_size(control_t *, client_t *);
void gui_entities(control_t *, client_t *);
void gui_tile(control_t *, client_t *);
void gui_player(control_t *, client_t *);
void gui_tickrate(control_t *, client_t *);