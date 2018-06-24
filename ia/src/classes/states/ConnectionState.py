# coding = utf-8
import re

from src.classes.states.GameState import GameState
from src.classes.states.LevelUpHandlingState import LevelUpHandlingState
from src.classes.states.StateMachine import AState, StateException, statemachine
from src.classes.ia_res.Ant import ant


class ConnectionState(AState):

    def __init__(self):
        super().__init__("Connection")

        self._welcome = False
        self._position = False
        self._team = False

        self._matches = {
            "^WELCOME$": self.welcome,
            "^(\d+) (\d+)$": self.map_size,
            "^(\d+)$": self.current_nbr,
            "^ko$": self.ko,
        }

    def ko(self, cli, value, match):
        del cli, value, match
        raise Exception("Can't connect to the server")

    def welcome(self, cli, value, match):
        if self._welcome:
            raise StateException("Welcomed twice")
        self._welcome = True
        cli.write(ant.team)
        del value, match

    def map_size(self, cli, value, match):
        del cli, value
        if self._position:
            raise StateException("Position set twice")
        self._position = True
        ant.map_size.x = int(match[0][0])
        ant.map_size.y = int(match[0][1])

        def replaceClosure():
            statemachine.replace(GameState())

        statemachine.closure = replaceClosure

    def current_nbr(self, cli, value, match):
        del cli, value
        if self._team:
            raise StateException("Team set twice")
        self._team = True
        ant.current_nbr = int(match[0])

    def update(self, cli, inputs):
        for elem in inputs:
            for k, v in self._matches.items():
                match = re.findall(k, elem)
                if match:
                    v(cli, elem, match)
