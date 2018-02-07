#!/usr/bin/env python
# coding: utf-8

from setuptools import setup
from ghreposearch import __author__, __version__

with open("LICENSE", "r") as fp:
    license_msg = fp.read()

setup(
    name="github-repository-searcher",
    description="Search the github repository",
    author=__author__,
    version=__version__,
    license=license_msg,
    packages=["ghreposearch"],
    install_requires=["prettytable==0.7.2"],
    entry_points={
        "console_scripts": [
            "github-repository-searcher=ghreposearch.__main__:main"
        ]
    },
    classifiers=[
        "Development Status :: 2 - Pre-Alpha",
        "Environment :: Console",
        "Intended Audience :: Developers",
        "Operating System :: Unix",
        "Operating System :: MacOS :: MacOS X",
        "Operating System :: POSIX :: Linux",
        "Programming Language :: Python",
        "Programming Language :: Python :: 2",
        "Programming Language :: Python :: 2.7",
        "License :: OSI Approved :: MIT License"
    ]

)
