#!/bin/bash -ex
# Copyright 2015 The TensorFlow Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# ==============================================================================

DOWNLOADS_DIR=tensorflow/contrib/makefile/downloads
BZL_FILE_PATH=tensorflow/workspace.bzl

mkdir -p ${DOWNLOADS_DIR}

# Grab the current Eigen version name from the Bazel build file
EIGEN_HASH=$(cat "${BZL_FILE_PATH}" | egrep "eigen_version.*=.*\".*\"" | awk '{ print $3 }')
# Trim trailing and preceding double quotes
EIGEN_HASH="${EIGEN_HASH%\"}"
EIGEN_HASH="${EIGEN_HASH#\"}"

if [[ -z "${EIGEN_HASH}" ]]; then
    echo >&2 "Eigen hash does not exist."
    exit 1
else
    echo "Eigen hash = ${EIGEN_HASH}"
fi

curl "https://bitbucket.org/eigen/eigen/get/${EIGEN_HASH}.tar.gz" \
-o /tmp/eigen-${EIGEN_HASH}.tar.gz
tar xzf /tmp/eigen-${EIGEN_HASH}.tar.gz -C ${DOWNLOADS_DIR}

# Link to the downloaded Eigen library from a permanent directory name, since
# the downloaded name changes with every version.
cd ${DOWNLOADS_DIR}
rm -rf eigen-latest
ln -s eigen-eigen-${EIGEN_HASH} eigen-latest

# TODO(petewarden) - Some new code in Eigen triggers a clang bug with iOS arm64,
# so work around it by patching the source.
function replace_by_sed() {
  if echo "${OSTYPE}" | grep -q darwin; then
    sed -e "$1" -i '' "$2"
  else
    sed -e "$1" -i "$2"
  fi
}
replace_by_sed 's#static uint32x4_t p4ui_CONJ_XOR = vld1q_u32( conj_XOR_DATA );#static uint32x4_t p4ui_CONJ_XOR; // = vld1q_u32( conj_XOR_DATA ); - Removed by script#' \
eigen-latest/Eigen/src/Core/arch/NEON/Complex.h
replace_by_sed 's#static uint32x2_t p2ui_CONJ_XOR = vld1_u32( conj_XOR_DATA );#static uint32x2_t p2ui_CONJ_XOR;// = vld1_u32( conj_XOR_DATA ); - Removed by scripts#' \
eigen-latest/Eigen/src/Core/arch/NEON/Complex.h
replace_by_sed 's#static uint64x2_t p2ul_CONJ_XOR = vld1q_u64( p2ul_conj_XOR_DATA );#static uint64x2_t p2ul_CONJ_XOR;// = vld1q_u64( p2ul_conj_XOR_DATA ); - Removed by script#' \
eigen-latest/Eigen/src/Core/arch/NEON/Complex.h

git clone https://github.com/google/re2.git re2
git clone https://github.com/google/gemmlowp.git gemmlowp
git clone https://github.com/google/protobuf.git protobuf
git clone https://github.com/google/googletest.git googletest

# TODO(satok): Remove this once protobuf/autogen.sh is fixed.
replace_by_sed 's#https://googlemock.googlecode.com/files/gmock-1.7.0.zip#http://download.tensorflow.org/deps/gmock-1.7.0.zip#' \
protobuf/autogen.sh

echo "download_dependencies.sh completed successfully."
