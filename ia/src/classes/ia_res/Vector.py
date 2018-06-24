# coding = utf-8
import math


def vecSize(vector):
    return math.sqrt(vector.x * vector.x + vector.y * vector.y)


def normalize(vector):
    size = vecSize(vector)
    if size == 0:
        return Vector()
    return Vector(vector.x / size, vector.y / size)


def dotProduct(a, b):
    return a.x * b.x + a.y * b.y


class Vector(object):

    def __init__(self, x=0, y=None):
        if y is None:
            y = x
        self.x = x
        self.y = y

    def __repr__(self):
        return repr("({}, {})".format(self.x, self.y))
