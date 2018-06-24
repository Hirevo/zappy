# coding = utf-8
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.TrackableTransactions import LookTransaction
from src.classes.states.StateMachine import AAIState, statemachine


class WaitAnswerState(AAIState):

    def __init__(self, lap_nbr):
        super().__init__("WaitAnswerState")
        self.lap_nbr = lap_nbr

    def look_end(self, _):
        self.lap_nbr -= 1
        if self.lap_nbr:
            transaction = LookTransaction(self.look_end)
            safe_controller.execute(transaction)
        else:
            statemachine.closure = lambda: statemachine.pop()

    def on_push(self, cli):
        super().on_push(cli)
        transaction = LookTransaction(self.look_end)
        safe_controller.execute(transaction)

    def popped_over(self):
        super().popped_over()
