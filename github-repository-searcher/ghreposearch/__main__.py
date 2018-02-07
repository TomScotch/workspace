#!/usr/bin/env python
# coding: utf-8

import sys
import traceback

from .cli import parser
from .utils import display
from .api import (
    make_query,
    get_response
)


def program(args):

    query = make_query(
        args.query, language=args.language,
        sortby=args.sortby
    )

    api_response = get_response(query)
    display(api_response, args)

    return 0


def main(argv=sys.argv):

    # under develop:
    argv = argv[1:]

    if len(argv) == 0:
        parser.print_help()
        sys.exit(1)

    args = parser.parse_args(argv)

    try:
        exit_code = program(args)
        sys.exit(exit_code)

    except Exception as e:
        e_type = type(e).__name__
        stack_trace = traceback.format_exc()

        if args.stacktrace:
            print "{:=^30}".format(" STACK TRACE ")
            print stack_trace.strip()

        else:
            sys.stderr.write(
                "{0}: {1}\n".format(e_type, e.message))
            sys.exit(1)


if __name__ == "__main__":

    main()
