#!/bin/bash
filepath=$(cd "$(dirname "$0")"; pwd)
export GEM_HOME=$filepath/GEMS
ruby $@
