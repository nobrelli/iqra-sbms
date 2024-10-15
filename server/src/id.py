import math
import os
from datetime import datetime


class ID:
    # Source: https://github.com/appwrite/sdk-for-python/blob/1cf23ad2f7e7dd6e73f6dd33be8aadb77472ea9c/appwrite/id.py
    # Generate an hex ID based on timestamp
    # Recreated from https://www.php.net/manual/en/function.uniqid.php
    @staticmethod
    def __hex_timestamp() -> str:
        now = datetime.now()
        sec = int(now.timestamp())
        usec = now.microsecond % 1000
        hex_timestamp = f"{sec:08x}{usec:05x}"
        return hex_timestamp

    # Generate a unique ID with padding to have a longer ID
    @staticmethod
    def unique(padding: int = 7) -> str:
        base_id = ID.__hex_timestamp()
        random_bytes = os.urandom(math.ceil(padding / 2))
        random_padding = random_bytes.hex()[:padding]
        return base_id + random_padding
