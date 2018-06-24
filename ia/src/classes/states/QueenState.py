# coding = utf-8
import itertools
from collections import Counter

from src.classes.com.Controller import requirement, controller
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.Ant import ant, mates
from src.classes.ia_res.MsgProtocol import MsgProtocol
from src.classes.ia_res.TrackableTransactions import PackedTransaction, BroadcastTransaction, LookTransaction
from src.classes.states.IncantationState import IncantationState
from src.classes.states.SeekEmptyTileState import SeekEmptyTileState
from src.classes.states.SeekTeamState import SeekTeamState
from src.classes.states.StateMachine import AAIState, statemachine
from src.classes.states.WaitSlavesState import WaitSlavesState
from src.classes.states.WaitTeamState import WaitTeamState
from src.misc import my_log


def split_seq(seq, p):
    newseq = []
    n = len(seq) / p
    r = len(seq) % p
    b, e = 0, int(n + min(1, r))
    for i in range(p):
        newseq.append(seq[b:e])
        r = int(max(0, r - 1))
        b, e = int(e), int(e + n + min(1, r))
    return newseq


class QueenState(AAIState):

    def __init__(self):
        super().__init__("QueenState")

    def on_push(self, cli):
        super().on_push(cli)
        statemachine.closure = lambda: statemachine.push(SeekTeamState())

    def resource_repart(self):
        full_list = list(itertools.chain(*[[k.value] * v for k, v in requirement[ant.lvl + 1][1].items()]))
        full_list = split_seq(full_list, len(mates))
        full_dict = [dict(Counter(e)) for e in full_list]
        transaction = PackedTransaction(self.wait_answers)
        for m, items in zip(mates, full_dict):
            m.inventory = items
            msg = MsgProtocol.seek_slave(ant.uuid, m.uuid, items)
            transaction.addTransaction(BroadcastTransaction(msg, lambda ok=None: None))
        safe_controller.execute(transaction, rollback=False)

    def ping(self):
        incantation = IncantationState()
        state = SeekEmptyTileState(WaitSlavesState(requirement[ant.lvl + 1][0], incantation))
        statemachine.closure = lambda ok=None: statemachine.replace(state)

    def wait_answers(self, *args):
        for msg in controller.msgQueue:
            end = MsgProtocol.is_seek_end(msg.text)
            if end and end['sender'] in (mate.uuid for mate in mates):
                my_log(end['sender'], " finished all the tasks")
                mates.get_mate(end['sender']).inventory.clear()
        end = True
        for mate in mates:
            if len(mate.inventory):
                end = False
                break

        if end:
            my_log("All resources was found by slaves! Meeting required")
            msg = MsgProtocol.meet_ants(ant.uuid, [m.uuid for m in mates])
            transaction = BroadcastTransaction(msg, self.ping)
        else:
            transaction = LookTransaction(self.wait_answers)
        safe_controller.execute(transaction, rollback=False)

    def popped_over(self):
        super().popped_over()
        if not ant.is_queen:
            statemachine.closure = lambda: statemachine.replace(WaitTeamState())
        else:
            my_log("IM THE QUEEN !!")
            self.resource_repart()


if __name__ == "__main__":
    my_log(split_seq(range(10), 3))
    my_log(split_seq(range(11), 3))
    my_log(split_seq(range(1), 2))
    my_log(split_seq(range(10), 5))
    my_log(split_seq(range(10), 2))

