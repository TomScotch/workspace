# github-repository-searcher

[![forthebadge](http://forthebadge.com/images/badges/made-with-python.svg)](http://forthebadge.com)


## overview

The **github-repository-searcher** search a github repositories from `query`, `language`
and display result with *repository name, url, description* etc by **ascii table**.

github-repository-searcher developped by [![python2.7](https://img.shields.io/badge/python-2.7-blue.svg)](http://shields.io/)

## usage

### basic

```
$ github-repository-searcher [query]
```

### search arguments

* `-l`, `--language` *[LANG]* - The programming language what repository uses.

```
$ github-repository-searcher --language python requests
```

* `-s`, `--sortby`  - Sort the search result by (`stars`|`forks`|`updated`).

```
$ github-repository-searcher --sortby stars requests
```

### display arguments

* `-c`, `--clone` - Display the repository clone url.
* `-d`, `--desc` - Display the repository description.
* `-p` *NUM* - github-repository-searcher display only **10** items. you can show next 10 items when use `-p` argument.

## result example

```
$ github-repository-searcher --language python --sortby stars requests
```

result:

```
Hits 30 repositories
Page: next: 2, last: 3
+----+-------------------------------+--------------------------------------------------+--------+
| No | Name                          | URL                                              | STARS  |
+----+-------------------------------+--------------------------------------------------+--------+
|  1 | requests/requests             | https://github.com/requests/requests             | 29,987 |
|  2 | kennethreitz/httpbin          | https://github.com/kennethreitz/httpbin          | 5,415  |
|  3 | jazzband/django-debug-toolbar | https://github.com/jazzband/django-debug-toolbar | 4,562  |
|  4 | SirVer/ultisnips              | https://github.com/SirVer/ultisnips              | 3,526  |
|  5 | buildbot/buildbot             | https://github.com/buildbot/buildbot             | 3,252  |
|  6 | MechanicalSoup/MechanicalSoup | https://github.com/MechanicalSoup/MechanicalSoup | 2,412  |
|  7 | kennethreitz/grequests        | https://github.com/kennethreitz/grequests        | 2,410  |
|  8 | SpiderClub/weibospider        | https://github.com/SpiderClub/weibospider        | 1,859  |
|  9 | getsentry/responses           | https://github.com/getsentry/responses           | 1,756  |
| 10 | idan/oauthlib                 | https://github.com/idan/oauthlib                 | 1,520  |
+----+-------------------------------+--------------------------------------------------+--------+
```

## installation

```
git clone git@github.com:alice1017/github-repository-searcher.git
cd github-repository-searcher
pip install -r requirements.txt
python setup.py build install
```
