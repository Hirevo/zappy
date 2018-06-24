# coding = utf-8
import enum
from src.classes.com.Controller import requirement
from src.classes.ia_res.Ant import ant
from src.classes.states.QueenState import QueenState
from src.classes.states.StateMachine import AAIState, statemachine
from src.classes.states.WaitTeamState import WaitTeamState


class Status(enum.Enum):
    StandBy = 0
    Farming = 1
    Casting = 2


class LevelUpHandlingState(AAIState):

    def __init__(self):
        super().__init__("LevelUpHandler")
        self.lvl = ant.lvl + 1

    def on_push(self, cli):
        from src.classes.states.LvlAloneState import LevelUpAlone
        super().on_push(cli)
        if requirement[self.lvl][0] == 1:
            statemachine.closure = lambda: statemachine.push(LevelUpAlone())
        elif ant.is_queen:
            statemachine.closure = lambda: statemachine.push(QueenState())
        else:
            statemachine.closure = lambda: statemachine.push(WaitTeamState())

    def popped_over(self):
        super().popped_over()
        statemachine.closure = lambda: statemachine.pop()
