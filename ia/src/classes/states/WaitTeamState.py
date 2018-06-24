# coding = utf-8
import enum

from src.classes.com.Controller import controller
from src.classes.ia_res.Ant import ant
from src.classes.ia_res.Mate import Mate
from src.classes.ia_res.MsgProtocol import MsgProtocol
from src.classes.states.SlaveState import SlaveState
from src.misc import dup_me, my_log
from src.classes.com.SafeController import safe_controller
from src.classes.ia_res.TrackableTransactions import ForkTransaction, LookTransaction, ConnectNbrTransaction, \
    BroadcastTransaction
from src.classes.states.StateMachine import AAIState, statemachine


class WaitTeamState(AAIState):

    def __init__(self):
        super().__init__("Wait")
        self._status_stack = list()
        if not ant.forked:
            self._status_stack = [
                lambda: ForkTransaction(self.fork),
                lambda: ConnectNbrTransaction(self.connect_nbr)
            ]
        self._status_stack += [
            lambda: LookTransaction(self.wait_enrol_msg),
            lambda: LookTransaction(self.wait_accept_msg),
        ]

    def connect_nbr(self, *args):
        if len(args) != 0 and args[0] > 0:
            dup_me()
            self._status_stack.pop(0)
        self.template()

    def fork(self, *args):
        ant.forked = True
        self._status_stack.pop(0)
        self.template()

    def wait_accept_msg(self, *args):
        for m in controller.msgQueue:
            allow = MsgProtocol.is_allowed_ants(m.text)
            if allow and allow['sender'] == ant.queen.uuid:
                if ant.uuid in allow['allowed_ants']:
                    statemachine.closure = lambda: statemachine.replace(SlaveState())
                    return
                else:
                    self._status_stack.insert(0, lambda: LookTransaction(self.wait_enrol_msg))
        self.template()

    def wait_enrol_msg(self, *args):
        for m in controller.msgQueue:
            enr = MsgProtocol.is_enrolment(m.text)
            if enr and int(enr['level']) == ant.lvl + 1:
                my_log("Apply for enrolment : ", enr['sender'])
                self._status_stack.pop(0)
                msg = MsgProtocol.apply(ant.uuid, enr['sender'])
                safe_controller.execute(BroadcastTransaction(msg, self.wait_accept_msg), rollback=False)
                ant.queen = Mate(enr['sender'])
                return
        self.template()

    def template(self):
            safe_controller.execute(self._status_stack[0](), rollback=False)

    def on_push(self, cli):
        super().on_push(cli)
        self.template()

