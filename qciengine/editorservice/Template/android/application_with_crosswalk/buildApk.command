#!/bin/bash
filepath=$(cd "$(dirname "$0")"; pwd)
$filepath/gradlew :app:assembleRelease
read A
echo "您输入了${A}"