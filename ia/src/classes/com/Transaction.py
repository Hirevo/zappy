# coding = utf-8
from src.classes.com.Controller import CmdCost
from src.classes.ia_res.Vector import Vector


class Transaction:
    def __init__(self, estimated_time, end):
        if not isinstance(estimated_time, int):
            raise TypeError("Invalid type")
        self.estimated_time = estimated_time
        self._end = end

    def execute(self):
        raise NotImplementedError("Invalid Transaction")

    def end(self, *args, **kwargs):
        self._end(*args, **kwargs)

    def get_estimated_time(self):
        return self.estimated_time

    def __repr__(self):
        return repr("Transaction %d " % self.estimated_time)


class TrackableTransaction(Transaction):

    def execute(self):
        raise NotImplementedError("Invalid Transaction")

    def __init__(self, estimated_time, end, position):
        super().__init__(estimated_time, end)
        self.position = position

    def __repr__(self):
        return repr(super().__repr__() + " " + self.position.__repr__() + " ")