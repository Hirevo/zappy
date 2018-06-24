# coding = utf-8
import enum
from src.classes.com.Controller import requirement, controller, defaultError
from src.classes.ia_res.Ant import ant
from src.classes.states.IncantationState import IncantationState
from src.classes.states.SeekEmptyTileState import SeekEmptyTileState
from src.classes.states.SeekItemsState import SeekItemsState
from src.classes.states.StateMachine import AAIState, statemachine
from src.misc import my_log


class Status(enum.Enum):
    StandBy = 0
    Farming = 1
    Casting = 2


class LevelUpAlone(AAIState):

    def __init__(self):
        super().__init__("LevelUpAlone : " + str(ant.lvl + 1))
        self.aimed_lvl = ant.lvl + 1
        self.status = Status.StandBy

    # region Lvls event

    def aloneLvl(self, inventory):
        require = {k: max(v - inventory[k], 0) for k, v in requirement[self.aimed_lvl][1].items() if v > inventory[k]}
        statemachine.push(SeekItemsState(require))
        self.status = Status.Farming

    # endregion

    # region transition events

    def endFarming(self):
        statemachine.push(SeekEmptyTileState(IncantationState()))
        self.status = Status.Casting
        pass

    def endCasting(self):
        statemachine.closure = lambda: statemachine.pop()

    # endregion

    # region inheritence

    def on_push(self, cli):
        super().on_push(cli)
        controller.inventory(self.aloneLvl)

    def popped_over(self):
        super().popped_over()
        calls = {
            Status.StandBy: lambda: None,
            Status.Farming: self.endFarming,
            Status.Casting: self.endCasting
        }
        status = self.status
        self.status = Status.StandBy
        calls[status]()

    def on_pop(self, cli):
        super().on_pop(cli)

    # endregion inheritence
