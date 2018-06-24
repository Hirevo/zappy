import hashlib
import time
import os


class HashManager(object):

    @staticmethod
    def hash(value):
        return hashlib.sha256(str.encode(value)).hexdigest()[:12]

    @staticmethod
    def generate():
        return HashManager.hash(str(time.time() * os.getpid()))
