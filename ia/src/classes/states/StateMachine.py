# coding = utf-8

import select
import src.classes.com.Client as COM
from src.classes.com.Controller import controller, Resources
from src.classes.ia_res.Ant import ant
from src.misc import my_log


class StateException(Exception):

    def __init__(self, value):
        self.value = value

    def __str__(self):
        return repr("StateException : " + self.value)


class AState(object):

    def __init__(self, name):
        self._name = name

    def update(self, cli, inputs):
        pass

    def on_push(self, cli):
        pass

    def pushed_over(self):
        pass

    def popped_over(self):
        pass

    def on_pop(self, cli):
        pass

    def __repr__(self):
        return repr(self._name)


class AAIState(AState):

    def __init__(self, name):
        super().__init__(name)
        self.min_food = 10
        self.need_food = 30
        self.actions = 0
        self.actions_max = 7

    def update(self, cli, inputs):
        del cli
        for elem in inputs:
            controller.applyTop(elem)

class StateMachine(object):

    def __init__(self):
        self.block_trans_detect = False
        self._stack = []
        self._closure = None

    @property
    def closure(self):
        return self._closure

    @closure.setter
    def closure(self, value):
        self._closure = value

    def push(self, state):
        #my_log("PUSH ", state)
        if not issubclass(type(state), AState) and not issubclass(type(state), AAIState):
            raise Exception("State is not a valid variable type")
        if self._stack and not self.block_trans_detect:
            self._stack[0].pushed_over()
        self._stack.insert(0, state)
        self._stack[0].on_push(COM.cli)

    def pop(self):
        #my_log("POP ", self._stack[0])
        self._stack[0].on_pop(COM.cli)
        self._stack.pop(0)
        if self._stack and not self.block_trans_detect:
            self._stack[0].popped_over()

    def replace(self, state):
        if not issubclass(type(state), AState) and not issubclass(type(state), AAIState):
            raise Exception("State is not a valid variable type")
        save = self.block_trans_detect
        self.block_trans_detect = True
        #my_log("REPLACE STATE ", self._stack[0], " -> ", state)
        self.pop()
        self.push(state)
        self.block_trans_detect = save

    def update(self):
        if len(self._stack) == 0:
            raise StateException("All the states ends")
        value = COM.cli.poll()
        if select.POLLIN & value:
            msgs = COM.cli.consult()
            controller.checkEndGame(msgs)
            self._stack[0].update(COM.cli, msgs)
        if controller.hasBufferizedCmds():
            controller.flushCmds()
        while self.closure:
            closure = self.closure
            self.closure = None
            closure()


statemachine = StateMachine()
