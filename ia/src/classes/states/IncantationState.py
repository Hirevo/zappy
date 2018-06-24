# coding = utf-8
import json

from src.classes.com.Controller import requirement, Resources
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant
from collections import Counter
from src.classes.ia_res.TrackableTransactions import TakeTransaction, SetTransaction, InventoryTransaction, \
    LookTransaction, PackedTransaction, IncantationTransaction, ForwardTransaction
from src.classes.states.StateMachine import AAIState, statemachine
from src.misc import my_log, my_print


# look + inventory chained => take set combo
# on failure => ant doesn't lvl up

class IncantationState(AAIState):

    def __init__(self):
        super().__init__("Incantation -> " + str(ant.lvl + 1))
        self.require = requirement[ant.lvl + 1][1]
        self.look = dict()
        self.inventory = dict()
        self.validIncantation = True
        self.removingItems = list()
        self.addingItems = list()

    # region incantation callbacks

    def incantationStart(self):
        pass

    def incantationEnd(self, level=None):
        if level:
            ant.lvl = level
            my_print("LvL up : ", level)
        else:
            my_print("Failed to LvL up !")

    def endIncantationState(self, *args):
        my_log("INCANT ", statemachine._stack)
        statemachine.closure = lambda: statemachine.pop()

    # endregion incantation callbacks

    def castIncantation(self, incantation):
        incant = IncantationTransaction(self.incantationStart, self.incantationStart, self.incantationEnd, self.incantationEnd, lambda ok=None: None)
        incantation.addTransaction(LookTransaction(lambda ok: my_log(ok[0])))
        incantation.addTransaction(incant)
        safe_controller.execute(incantation)

    def add_usefull_items(self, transactions):
        for k in self.inventory:
            if k not in self.require:
                continue
            if k in self.look and self.look[k] < self.require[k]:
                event = SetTransaction(Resources(k), self.require[k] - self.look[k], lambda value: None, lambda value: None, lambda value: None)
                self.addingItems.append(k)
                transactions.addTransaction(event)
            elif k not in self.look:
                event = SetTransaction(Resources(k), self.require[k], lambda value: None, lambda value: None, lambda value: None)
                self.addingItems.append(k)
                transactions.addTransaction(event)
        return transactions

    def remove_useless_items(self, transactions):
        for k, v in self.look.items():
            if k not in self.require:
                event = TakeTransaction(Resources(k), v, lambda value: None, lambda value: None, lambda value: None)
                self.removingItems.append(k)
                transactions.addTransaction(event)
            elif k in self.require and self.require[k] < v:
                event = TakeTransaction(Resources(k), v - self.require[k], lambda value: None, lambda value: None, lambda value: None)
                self.removingItems.append(k)
                transactions.addTransaction(event)
        return transactions

    def execute_incantation(self, *args):
        if not self.validIncantation:
            statemachine.closure = lambda: statemachine.pop()
            return
        transactions = PackedTransaction(self.endIncantationState)
        transactions = self.add_usefull_items(self.remove_useless_items(transactions))
        self.castIncantation(transactions)

    # region precheck

    def store_inventory(self, inventory):
        ant.inventory = inventory
        self.inventory = inventory

        merge = dict(Counter(self.inventory) + Counter(self.look))
        for k, v in self.require.items():
            if k not in merge or merge[k] < v:
                self.validIncantation = False
                return

    def store_look(self, look):
        ant.look = look
        enum_values = [res.value for res_name, res in Resources.__members__.items()]
        look_converted = dict()
        for i in look[0]:
            look_converted[i] = look_converted.get(i, 0) + 1
        look_converted = {Resources(k): v for k, v in look_converted.items() if k in enum_values}
        self.look = look_converted

    # endregion precheck

    # region inherit

    def on_push(self, cli):
        super().on_push(cli)
        transactions = PackedTransaction(self.execute_incantation)
        transactions.addTransaction(LookTransaction(self.store_look))
        transactions.addTransaction(InventoryTransaction(self.store_inventory))
        safe_controller.execute(transactions)

    # endregion inherit
