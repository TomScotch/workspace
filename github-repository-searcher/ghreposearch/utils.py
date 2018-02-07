#!/usr/bin/env python
# coding: utf-8

from prettytable import PrettyTable
from .api import SORT_ELMS


def is_int(obj):

    try:
        int(obj)
        return True

    except ValueError:
        return False


def calc_display_range(page):

    start = 0
    end = 10
    page_next = 2

    if page:
        end = page * 10
        start = end - 10
        page_next = page + 1

    return start, end, page_next


def make_table(sortby, desc):

    if desc:
            table = PrettyTable(["No", "Name", "Description"])

    else:

        if sortby:
            table = PrettyTable(["No", "Name", "URL", sortby.upper()])

        else:
            table = PrettyTable(["No", "Name", "URL"])

    # align
    table.align["No"] = "r"
    table.align["Name"] = "l"

    if desc:
        table.align["Description"] = "l"
    else:
        table.align["URL"] = "l"

    if sortby:
        table.align[sortby.upper()] = "l"

    return table


def get_sortby_value(data, sortby):

    sort_elm_db = dict(zip(
        SORT_ELMS, ("stargazers_count", "forks_count", "updated_at")
    ))

    if sortby in SORT_ELMS:

        sort_elm_value = data[sort_elm_db[sortby]]

        if is_int(sort_elm_value):
            sortby = "{:,}".format(sort_elm_value)
        else:
            sortby = sort_elm_value

    return sortby


def display(response, args):

    hit_count = len(response["items"])

    range_start, range_end, page_next = calc_display_range(args.page)
    page_last = hit_count / 10

    table = make_table(args.sortby, args.desc)
    items = response["items"][range_start:range_end]
    enumerate_start = range_start + 1

    if len(items) == 0:
        raise IndexError("Page index out of range, there is no data.")

    for index, data in enumerate(items, start=enumerate_start):

        name = data["full_name"]
        url = data["clone_url"] if args.clone else data["html_url"]
        desc = data["description"]
        sortby = get_sortby_value(data, args.sortby)

        if args.desc:
                table.add_row([index, name, desc])

        else:
            if args.sortby:
                table.add_row([index, name, url, sortby])

            else:
                table.add_row([index, name, url])

    # display data
    print "Hits {:,} repositories".format(hit_count)

    if page_next > page_last:

        if page_last != 0:
            print "Page: last: {}".format(page_last)

    else:
        print "Page: next: {}, last: {}".format(page_next, page_last)

    print table

    return 0
