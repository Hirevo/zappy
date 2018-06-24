# coding = utf-8
from src.classes.com.Controller import controller
from src.classes.ia_res.Ant import ant, mates
from src.classes.ia_res.MsgProtocol import MsgProtocol
from src.classes.ia_res.TrackableTransactions import LookTransaction, BroadcastTransaction
from src.classes.com.SafeController import safe_controller
from src.classes.states.StateMachine import AAIState, statemachine
from src.misc import my_log


class WaitSlavesState(AAIState):

    def __init__(self, size, replacement_state):
        super().__init__("WaitSlavesState")
        self.size = size
        self.replacement_state = replacement_state

    def broadcast_team(self):
        safe_controller.execute(LookTransaction(self.look_for_players))

    def look_for_players(self, look):
        for msg in controller.msgQueue:
            ready = MsgProtocol.is_ready_inc(msg.text)
            if ready and ready["recipient"] == ant.uuid and ready['sender'] in (mate.uuid for mate in mates):
                mates.get_mate(ready['sender']).ready = True
        ok = True
        for mate in mates:
            if not mate.ready:
                ok = False
                break
        if look[0].count("player") == self.size and ok:
            statemachine.closure = lambda: statemachine.replace(self.replacement_state)
        else:
            msg = MsgProtocol.ping_team(ant.uuid)
            safe_controller.execute(BroadcastTransaction(msg, self.broadcast_team))

    def on_push(self, cli):
        super().on_push(cli)
        safe_controller.execute(LookTransaction(self.look_for_players))
