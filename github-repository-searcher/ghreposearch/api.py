#!/usr/bin/env python
# coding: utf-8

import sys
import json
import requests

APIURL = "https://api.github.com/search/repositories?"
SORT_ELMS = ("stars", "forks", "updated")


def make_query(query_string, language=None, sortby=None):

    query = "q={}".format(query_string)

    if language:
        query += "+language:{}".format(language)

    if sortby:
        if sortby in SORT_ELMS:
            query += "&sort={}".format(sortby)
        else:
            sys.stderr.write("sortby is (stars|forks|updated) only.\n")
            sys.exit(1)

    return query


def get_response(query):

    response = requests.get(APIURL + query)
    return json.loads(response.text)
