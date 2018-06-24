# coding = utf-8
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant, mates
from src.classes.ia_res.TrackableTransactions import ForkTransaction
from src.classes.states.LevelUpHandlingState import LevelUpHandlingState
from src.classes.states.StateMachine import AState, statemachine
from src.misc import my_log


class GameState(AState):

    def __init__(self):
        super().__init__("Game")

    def check(self):
        if ant.lvl < 8:
            statemachine.closure = lambda: statemachine.push(LevelUpHandlingState())
        else:
            my_log("END OF THE GAME")
            exit(0)

    def on_push(self, cli):
        super().on_push(cli)
        self.check()

    def popped_over(self):
        super().popped_over()
        mates.clear()
        my_log("RESETTING ...")
        self.check()

