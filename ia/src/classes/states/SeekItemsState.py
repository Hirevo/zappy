from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Path import Path, PathManipulator, PositionTracker
from src.classes.ia_res.TrackableTransactions import TakeTransaction, LookTransaction, EmptyPathTransaction
from src.classes.states.StateMachine import AAIState, statemachine
from src.classes.com.Controller import Resources
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.Vector import Vector
from src.misc import my_log, my_print


class SeekItemsState(AAIState):

    def findLooksItems(self, look):
        dup_items = dict(self.items_dict)
        path = Path()
        found = False
        for item in dup_items:
            for i in range(len(look)):
                if dup_items[item] != 0 and item.value in look[i] and "player" not in look[i]:
                    #my_log(i, look[i], "found ", item.value)
                    found = True
                    nb = min(look[i].count(item.value), dup_items[item])
                    if nb < 0:
                        nb = look[i].count(item.value)
                    dup_items[item] -= nb
                    event = TakeTransaction(item, nb, lambda value: None, self.take_ok, self.take_ko)
                    path.addConePoint(i, event)
                if Resources.Food in look[i] and item.value in look[i] and "player" not in look[i]:
                    nb = look[i].count(item.value)
                    event = TakeTransaction(item, nb, lambda value: None, self.take_ok, self.take_ko)
                    path.addConePoint(i, event)
        return found, path

    def goNextPlace(self):
        path = Path()
        if self.progress == self.surface:
            #my_log("TURN ", self.progress)
            left_dist = ant.lvl
            path.addPoint(Vector(-left_dist, 0), EmptyPathTransaction())
            path.addPoint(Vector(-left_dist, 1), LookTransaction(lambda value: None))
            move = Vector(-left_dist, 1)
            self.progress = 0
        else:
            #my_log("UP ", self.progress)
            path.addPoint(Vector(0, 1), LookTransaction(lambda value: None))
            move = Vector(0, 1)
            self.progress += 1
        path, look = path.generateOrder(False)
        #my_log(path)
        self.tracker.addMove(move, look)
        self.pathHandler = PathManipulator(path, self.updateAntLook)  # TODO estimate ?
        safe_controller.execute(self.pathHandler)

    def updateAntLook(self, look):
        ant.look = look
        found, path = self.findLooksItems(look)
        if found:
            save = path.generateOpti(True)[0]
            #my_log(save)
            self.pathHandler = PathManipulator(save, self.checkEnd)  # TODO estimate ?
            safe_controller.execute(self.pathHandler)
        else:
            self.goNextPlace()

    def take_ko(self, value):
        import json
        #my_print("TAKE ITEM KO : ", value)
        #my_log(json.dumps(ant.look, indent=4))
        #exit(0)
        del value

    def take_ok(self, value):
        #my_log("TAKE ITEM OK : ", value)
        self.items_dict[Resources(value)] -= 1

    def on_push(self, cli):
        super().on_push(cli)
        safe_controller.execute(LookTransaction(self.updateAntLook))

    def update(self, cli, inputs):
        super().update(cli, inputs)

    def checkEnd(self, *args):
        del args
        check = True

        for k, v in self.items_dict.items():
            if v > 0:
                check = False
        if check and (not self.rollback or self.tracker.stayed()):
            statemachine.closure = lambda: statemachine.pop()
        elif check and self.rollback:
            self.rollback = False
            look, path = self.tracker.returnHome()
            self.pathHandler = PathManipulator(path, self.checkEnd)
            safe_controller.execute(self.pathHandler)
        else:
            safe_controller.execute(LookTransaction(self.updateAntLook))

    def __init__(self, items_dict, rollback=False):
        super().__init__("SeekItems")
        self.progress = 0
        self.tracker = PositionTracker()
        self.pathHandler = None
        self.surface = max(ant.map_size.x, ant.map_size.y)
        self.items_dict = items_dict
        self.rollback = rollback
