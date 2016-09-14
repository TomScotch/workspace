"""Cleverbot chats with himself."""
from __future__ import print_function
import traceback

import cleverbot


def main():
    # instantiate two Cleverbot objects
    cleverbot_client_one = cleverbot.Cleverbot()
    cleverbot_client_two = cleverbot.Cleverbot()

    print('>> Cleverbot #1: Hi.')
    answer = cleverbot_client_two.ask('Hello')

    while True:
        print('>> Cleverbot #2: {}'.format(answer).encode('utf-8'))
        answer = cleverbot_client_one.ask(answer)
        print('>> Cleverbot #1: {}'.format(answer).encode('utf-8'))
        answer = cleverbot_client_two.ask(answer)


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('>> Exiting...')
    except Exception as err:
        print(traceback.format_exc(err))
