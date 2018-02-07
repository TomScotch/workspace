#!/usr/bin/env python
# coding: utf-8

from argparse import (
    ArgumentParser,
    RawTextHelpFormatter
)
from .api import SORT_ELMS

parser = ArgumentParser(
    prog="github-repository-searcher",
    description="Searh the github repository and display name & url.",
    formatter_class=RawTextHelpFormatter
)

parser.add_argument(
    "query",
    action="store",
    help="A query string to search repository."
)

parser_group1 = parser.add_argument_group("optional search arguments")
parser_group2 = parser.add_argument_group("optional display arguments")

parser_group1.add_argument(
    "-l", "--language",
    metavar="LNG",
    action="store",
    help="The programming language what repository uses."
)

parser_group1.add_argument(
    "-s", "--sortby",
    action="store",
    choices=SORT_ELMS,
    help="Sort the search result by (stars|forks|updated)."
)

parser_group2.add_argument(
    "-c", "--clone",
    action="store_true",
    help="Display the repository clone url."
)

parser_group2.add_argument(
    "-d", "--desc",
    action="store_true",
    help="Display the repository description."
)

parser_group2.add_argument(
    "-p",
    metavar="NUM",
    dest="page",
    action="store",
    type=int,
    help="Page number."
)

parser.add_argument(
    "--stacktrace",
    action="store_true",
    help="Display stacktrace for debug."
)
