# coding = utf-8

from src.classes.com.HashManager import HashManager
from src.classes.ia_res.Mate import Mates
from src.classes.ia_res.Vector import Vector


class Ant(object):

    def __init__(self, team):
        self.is_queen = True
        self.queen = None
        self.team = team
        self.map_size = Vector()
        self.current_nbr = 0
        self.lvl = 1
        self.forked = False
        self.look = []
        self.inventory = {}
        self.request = {}
        self._uuid = HashManager.generate()

    def __next__(self):
        self._uuid = HashManager.hash(self._uuid)
        return self._uuid

    @property
    def uuid(self):
        return self._uuid

    @uuid.setter
    def uuid(self, uuid):
        raise Exception("Can't set UUID")

    @uuid.setter
    def uuid(self, value):
        raise Exception("Can't set uuid directly")


ant = Ant(None)
mates = Mates()


def init_ant(team):
    ant.team = team
    return ant
