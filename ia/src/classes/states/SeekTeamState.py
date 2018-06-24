# coding = utf-8
from src.classes.com.Controller import controller, requirement
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.MsgProtocol import MsgProtocol
from src.classes.ia_res.Ant import ant, mates
from src.classes.ia_res.TrackableTransactions import BroadcastTransaction
from src.classes.states.StateMachine import AAIState, statemachine
from src.classes.states.WaitAnswerState import WaitAnswerState
from src.misc import my_log


class SeekTeamState(AAIState):

    def __init__(self):
        super().__init__("SeekTeamState")

    def on_push(self, cli):
        super().on_push(cli)
        msg = MsgProtocol.enrolment(ant.uuid, ant.lvl + 1)
        my_log("Search a team lvl {}...".format(ant.lvl + 1))
        transaction = BroadcastTransaction(msg, lambda: statemachine.push(WaitAnswerState(40)))
        safe_controller.execute(transaction, rollback=False)

    def popped_over(self):
        super().popped_over()
        for m in controller.msgQueue:
            enr = MsgProtocol.is_apply(m.text)
            if enr and enr['recipient'] == ant.uuid:
                mates.add_mate(enr['sender'])
                my_log("Allow enrolment : ", enr['sender'])
            if len(mates) == requirement[ant.lvl + 1][0]:
                break
        if len(mates) < requirement[ant.lvl + 1][0] - 1:
            my_log("Failed to find a team lvl {} :'(".format(ant.lvl + 1))
            mates.clear()
            ant.is_queen = False
        allow_list = [m.uuid for m in mates]
        msg = MsgProtocol.allowed_ants(ant.uuid, allow_list)
        transaction = BroadcastTransaction(msg, lambda: statemachine.pop())
        safe_controller.execute(transaction, rollback=False)
