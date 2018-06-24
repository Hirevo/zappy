# coding = utf-8

import enum
from src.classes.com.HashManager import HashManager


class Roles(enum.Enum):
    QUEEN = 0
    FOOD_SEEKER = 1
    STONE_SEEKER = 2


class Mates(object):

    def __init__(self):
        self.mates = []

    def __iter__(self):
        return self.mates.__iter__()

    def __len__(self):
        return len(self.mates)

    def clear(self):
        self.mates.clear()

    def add_mate(self, uuid):
        self.mates.append(Mate(uuid))

    def get_mate(self, uuid):
        for mate in self:
            if mate.uuid == uuid:
                return mate

    def pop_mate(self, uuid):
        for mate in self:
            if mate.uuid == uuid:
                self.mates.pop()


class Mate(object):

    def __init__(self, uuid):
        self._uuid = uuid
        self.inventory = dict()
        self.ready = False

    def __next__(self):
        self._uuid = HashManager.hash(self._uuid)
        return self._uuid

    @property
    def uuid(self):
        return self._uuid

    @uuid.setter
    def uuid(self, uuid):
        raise Exception("Can't set UUID")
