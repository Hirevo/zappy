##
## EPITECH PROJECT, 2018
## zappy
## File description:
## Makefile
##

MAKESTR		=	make --no-print-directory -C lib/str
MAKEPOLL	=	make --no-print-directory -C lib/poll
MAKELIST	=	make --no-print-directory -C lib/list
MAKEOBJECT	=	make --no-print-directory -C lib/object
MAKEJSON	=	make --no-print-directory -C lib/json
MAKESOCKET	=	make --no-print-directory -C lib/socket

CC		=	gcc

NAME		=	zappy_server

SRCDIR		=	src
OBJDIR		=	build

FILES		=	args					\
			assigner				\
			consume					\
			create_client				\
			init					\
			interact_client				\
			main					\
			parser					\
			parser_helper				\
			request					\
			t_manager				\
			t_tools					\
			map					\
			exec					\
			resource_gen				\
			admin/adm_getids			\
			admin/adm_teams				\
			admin/adm_spawn				\
			admin/adm_tickrate			\
			admin/adm_move				\
			admin/adm_cast				\
			admin/adm_killall			\
			admin/adm_lvlup				\
			admin/adm_face				\
			gui/gui_entities			\
			gui/gui_map_size			\
			gui/gui_player				\
			gui/gui_tile				\
			gui/gui_tickrate			\
			gui/gui_tile_helper			\
			arguments/parse_clients			\
			arguments/parse_freq			\
			arguments/parse_height			\
			arguments/parse_help			\
			arguments/parse_names			\
			arguments/parse_port			\
			arguments/parse_width			\
			commands/cmd_broadcast			\
			commands/cmd_connect_nbr		\
			commands/cmd_eject			\
			commands/cmd_fork			\
			commands/cmd_forward			\
			commands/cmd_incantation		\
			commands/cmd_incantation_helper		\
			commands/cmd_incantation_helper2	\
			commands/cmd_inventory			\
			commands/cmd_left			\
			commands/cmd_look			\
			commands/cmd_right			\
			commands/cmd_set			\
			commands/cmd_take			\
			events/event_broadcast			\
			events/event_egg_drop_start		\
			events/event_egg_drop_end		\
			events/event_egg_hatch			\
			events/event_incantation_fail		\
			events/event_incantation_start		\
			events/event_incantation_success	\
			events/event_item_drop			\
			events/event_item_pickup		\
			events/event_player_death		\
			events/event_player_inventory		\
			events/event_player_join		\
			events/event_player_look		\
			events/event_player_move		\
			events/event_player_turn		\
			events/event_tickrate_switchover	\
			serializers/display_object		\
			serializers/errors			\
			serializers/events			\
			serializers/finalize_json		\
			serializers/free_list			\
			serializers/free_object			\
			serializers/free_json			\
			serializers/serialize_player		\
			serializers/serialize_position

SORTEDFILES	=	$(sort $(FILES))
SRCS		=	$(SORTEDFILES:%=$(SRCDIR)/%.c)
OBJS		=	$(SORTEDFILES:%=$(OBJDIR)/%.o)

CFLAGS 		=	-Ilib -Iinclude -W -Wall -Wextra -Wunused -Wuninitialized -D_GNU_SOURCE -g
LDFLAGS		=	-Llib/socket -lsocket -Llib/poll -lpoll -Llib/json -ljson -Llib/object -lobject
LDFLAGS		+=	-Llib/list -llist -Llib/str -lstr -lm

DIRS		=	admin			\
			arguments		\
			commands		\
			events			\
			gui			\
			serializers

SORTEDDIRS	=	$(sort $(DIRS))
SRCDIRS		=	$(SORTEDDIRS:%=$(SRCDIR)/%)
OBJDIRS		=	$(SORTEDDIRS:%=$(OBJDIR)/%)

REDDARK 	=       \033[31;2m
RED     	=       \033[31;1m
GREEN   	=       \033[32;1m
YEL     	=       \033[33;1m
BLUE    	=       \033[34;1m
PINK    	=       \033[35;1m
CYAN    	=       \033[36;1m
RES     	=       \033[0m

all:	$(NAME)

$(NAME):	$(OBJDIR) $(OBJDIRS) $(OBJS)
		@$(MAKESTR)
		@$(MAKEPOLL)
		@$(MAKELIST)
		@$(MAKESOCKET)
		@$(MAKEOBJECT)
		@$(MAKEJSON)
		@echo -e "[$(RED)LINKING$(RES)] $(YEL)$(OBJDIR)/server/*.o$(RES) $(BLUE)=>$(RES) $(YEL)$(NAME)$(RES)"
		@gcc -o $(NAME) $(OBJS) $(LDFLAGS)

clean:
	@$(MAKESTR) clean
	@$(MAKEPOLL) clean
	@$(MAKELIST) clean
	@$(MAKESOCKET) clean
	@$(MAKEOBJECT) clean
	@$(MAKEJSON) clean
	@rm -rf $(OBJDIR)

fclean:	clean
	@$(MAKESTR) fclean
	@$(MAKEPOLL) fclean
	@$(MAKEPOLL) fclean
	@$(MAKESOCKET) fclean
	@$(MAKEOBJECT) fclean
	@$(MAKEJSON) fclean
	@rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re

$(OBJDIR)/%.o:	$(SRCDIR)/%.c
	@echo -e "[$(RED)COMPILE$(RES)] $(YEL)$<$(RES) $(BLUE)=>$(RES) $(YEL)$@$(RES)"
	@$(CC) $(CFLAGS) -c -o $@ $<

$(OBJDIR):
	@echo -e "[$(RED)MKDIR$(RES)] $(YEL)build$(RES)"
	@mkdir -p $@

$(OBJDIR)/%:
	@echo -e "[$(RED)MKDIR$(RES)] $(YEL)$@$(RES)"
	@mkdir -p $@
