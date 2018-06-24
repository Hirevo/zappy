# coding = utf-8
from src.classes.com.Controller import controller, Resources
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.MsgProtocol import MsgProtocol
from src.classes.ia_res.TrackableTransactions import LookTransaction, \
    BroadcastTransaction
from src.classes.states.FollowQueenState import FollowQueenState
from src.classes.states.SeekItemsState import SeekItemsState
from src.classes.states.StateMachine import AAIState, statemachine
from src.misc import my_log


class SlaveState(AAIState):

    def __init__(self):
        super().__init__("SlaveState")

    def find_callback(self, _):
        for m in controller.msgQueue:
            seek = MsgProtocol.is_seek_slave(m.text)
            if seek and seek['recipient'] == ant.uuid and seek['sender'] == ant.queen.uuid:
                my_log('I have finally a real duty!! :')
                items = {
                    Resources(name): int(value)
                    for name, value in seek['items'].items()
                }
                ant.request = dict(items)
                statemachine.closure = lambda: statemachine.push(
                    SeekItemsState(items))
                return
        find = LookTransaction(self.find_callback)
        safe_controller.execute(find, rollback=False)

    def meet_callback(self, _):
        for m in controller.msgQueue:
            meet = MsgProtocol.is_meet_ants(m.text)
            if meet and ant.uuid in meet['recipients'] and meet['sender'] == ant.queen.uuid:
                my_log("My dear queen asked me to join her, let's go!")
                statemachine.closure = lambda ok=None: statemachine.replace(FollowQueenState())
                return
        meet = LookTransaction(self.meet_callback)
        safe_controller.execute(meet, rollback=False)

    def on_push(self, cli):
        super().on_push(cli)
        find = LookTransaction(self.find_callback)
        safe_controller.execute(find, rollback=False)

    def popped_over(self):
        super().popped_over()

        def callback():
            meet = LookTransaction(self.meet_callback)
            safe_controller.execute(meet, rollback=False)

        my_log('I accomplished my duty ! :)')
        msg = MsgProtocol.seek_end(ant.uuid, ant.queen.uuid)
        transaction = BroadcastTransaction(msg, callback)
        safe_controller.execute(transaction, rollback=False)
