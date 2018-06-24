# coding = utf-8
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.Path import PathManipulator, Path
from src.classes.ia_res.TrackableTransactions import EmptyPathTransaction, InventoryTransaction, LookTransaction
from src.classes.ia_res.Vector import Vector
from src.classes.states.StateMachine import AAIState, statemachine
from src.misc import my_log


class SeekEmptyTileState(AAIState):

    def __init__(self, replacement_state):
        super().__init__("SeekEmptyTileState")
        self.replacement_state = replacement_state
        self.surface = max(ant.map_size.x, ant.map_size.y)
        self.progress = 0
        self.pathHandler = None

    def findEmptyTile(self, look):
        path = Path()
        found = False
        for i in range(len(look)):
            if 'player' not in look[i]:
                my_log("Seek empty tile : ", look[i], " ", i)
                found = True
                event = InventoryTransaction(lambda ok=None: None)
                path.addConePoint(i, event)
                break
        return found, path

    def goNextPlace(self):
        path = Path()
        if self.progress == self.surface:
            left_dist = ant.lvl
            path.addPoint(Vector(-left_dist, 0), EmptyPathTransaction())
            path.addPoint(Vector(-left_dist, 1), LookTransaction(lambda value: None))
            self.progress = 0
        else:
            path.addPoint(Vector(0, 1), LookTransaction(lambda value: None))
            self.progress += 1
        path, look = path.generateOrder(False)
        my_log(path)
        self.pathHandler = PathManipulator(path, self.updateAntLook)
        safe_controller.execute(self.pathHandler)

    def updateAntLook(self, look):
        ant.look = look
        found, path = self.findEmptyTile(look)
        if found:
            save = path.generateOrder(False)[0]
            my_log(save)
            self.pathHandler = PathManipulator(
                save,
                lambda ok=None: statemachine.replace(self.replacement_state)
            )
            safe_controller.execute(self.pathHandler)
        else:
            self.goNextPlace()

    def on_push(self, cli):
        super().on_push(cli)
        safe_controller.execute(LookTransaction(self.updateAntLook))
