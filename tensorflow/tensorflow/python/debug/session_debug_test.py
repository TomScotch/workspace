# Copyright 2016 The TensorFlow Authors. All Rights Reserved.
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
"""Tests for debugger functionalities in tf.Session."""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import os
import shutil
import tempfile

import numpy as np
from six.moves import xrange  # pylint: disable=redefined-builtin

from tensorflow.core.protobuf import config_pb2
from tensorflow.python.client import session
from tensorflow.python.debug import debug_data
from tensorflow.python.debug import debug_utils
from tensorflow.python.framework import constant_op
from tensorflow.python.framework import test_util
from tensorflow.python.ops import control_flow_ops
from tensorflow.python.ops import math_ops
from tensorflow.python.ops import state_ops
from tensorflow.python.ops import variables
from tensorflow.python.platform import googletest
from tensorflow.python.platform import test


class SessionDebugTest(test_util.TensorFlowTestCase):

  def setUp(self):
    self._dump_root = tempfile.mkdtemp()

    if test.is_gpu_available():
      self._expected_partition_graph_count = 2
    else:
      self._expected_partition_graph_count = 1

  def tearDown(self):
    # Tear down temporary dump directory.
    shutil.rmtree(self._dump_root)

  def _addDebugTensorWatch(self,
                           run_opts,
                           node_name,
                           output_slot,
                           debug_op="DebugIdentity",
                           debug_urls=None):
    watch_opts = run_opts.debug_tensor_watch_opts

    # Add debug tensor watch for u.
    watch = watch_opts.add()
    watch.node_name = node_name
    watch.output_slot = 0
    watch.debug_ops.append(debug_op)

    if debug_urls:
      for debug_url in debug_urls:
        watch.debug_urls.append(debug_url)

  def testDumpToFileOverlappingParentDir(self):
    with session.Session() as sess:
      u_init_val = np.array([[5.0, 3.0], [-1.0, 0.0]])
      v_init_val = np.array([[2.0], [-1.0]])

      # Use node names with overlapping namespace (i.e., parent directory) to
      # test concurrent, non-racing directory creation.
      u_name = "testDumpToFile/u"
      v_name = "testDumpToFile/v"

      u_init = constant_op.constant(u_init_val, shape=[2, 2])
      u = variables.Variable(u_init, name=u_name)
      v_init = constant_op.constant(v_init_val, shape=[2, 1])
      v = variables.Variable(v_init, name=v_name)

      w = math_ops.matmul(u, v, name="testDumpToFile/matmul")

      u.initializer.run()
      v.initializer.run()

      run_options = config_pb2.RunOptions()
      run_options.output_partition_graphs = True
      debug_url = "file://%s" % self._dump_root

      # Add debug tensor watch for u.
      self._addDebugTensorWatch(
          run_options, "%s/read" % u_name, 0, debug_urls=[debug_url])
      # Add debug tensor watch for v.
      self._addDebugTensorWatch(
          run_options, "%s/read" % v_name, 0, debug_urls=[debug_url])

      run_metadata = config_pb2.RunMetadata()

      # Invoke Session.run().
      sess.run(w, options=run_options, run_metadata=run_metadata)

      self.assertEqual(self._expected_partition_graph_count,
                       len(run_metadata.partition_graphs))

      dump = debug_data.DebugDumpDir(self._dump_root)

      # Verify the dumped tensor values for u and v.
      self.assertEqual(2, dump.size)

      self.assertAllClose([u_init_val], dump.get_tensors("%s/read" % u_name, 0,
                                                         "DebugIdentity"))
      self.assertAllClose([v_init_val], dump.get_tensors("%s/read" % v_name, 0,
                                                         "DebugIdentity"))

      self.assertGreaterEqual(
          dump.get_rel_timestamps("%s/read" % u_name, 0, "DebugIdentity")[0], 0)
      self.assertGreaterEqual(
          dump.get_rel_timestamps("%s/read" % v_name, 0, "DebugIdentity")[0], 0)

  def testDumpStringTensorsToFileSystem(self):
    with session.Session() as sess:
      str1_init_val = np.array(b"abc")
      str2_init_val = np.array(b"def")

      str1_init = constant_op.constant(str1_init_val)
      str2_init = constant_op.constant(str2_init_val)

      str1_name = "str1"
      str2_name = "str2"
      str1 = variables.Variable(str1_init, name=str1_name)
      str2 = variables.Variable(str2_init, name=str2_name)
      # Concatenate str1 and str2
      str_concat = math_ops.add(str1, str2, name="str_concat")

      str1.initializer.run()
      str2.initializer.run()

      run_options = config_pb2.RunOptions()
      run_options.output_partition_graphs = True
      debug_url = "file://%s" % self._dump_root

      # Add debug tensor watch for u.
      self._addDebugTensorWatch(
          run_options, "%s/read" % str1_name, 0, debug_urls=[debug_url])
      # Add debug tensor watch for v.
      self._addDebugTensorWatch(
          run_options, "%s/read" % str2_name, 0, debug_urls=[debug_url])

      run_metadata = config_pb2.RunMetadata()
      sess.run(str_concat, options=run_options, run_metadata=run_metadata)

      # String ops are located on CPU.
      self.assertEqual(1, len(run_metadata.partition_graphs))

      dump = debug_data.DebugDumpDir(self._dump_root)

      self.assertEqual(2, dump.size)

      self.assertEqual([str1_init_val], dump.get_tensors("%s/read" % str1_name,
                                                         0, "DebugIdentity"))
      self.assertEqual([str2_init_val], dump.get_tensors("%s/read" % str2_name,
                                                         0, "DebugIdentity"))

      self.assertGreaterEqual(
          dump.get_rel_timestamps("%s/read" % str1_name, 0, "DebugIdentity")[0],
          0)
      self.assertGreaterEqual(
          dump.get_rel_timestamps("%s/read" % str2_name, 0, "DebugIdentity")[0],
          0)

  def testDumpToFileWhileLoop(self):
    with session.Session() as sess:
      num_iter = 10

      # "u" is the Variable being updated in the loop.
      u_name = "testDumpToFileWhileLoop/u"
      u_namespace = u_name.split("/")[0]

      u_init_val = np.array(11.0)
      u_init = constant_op.constant(u_init_val)
      u = variables.Variable(u_init, name=u_name)

      # "v" is the increment.
      v_name = "testDumpToFileWhileLoop/v"
      v_namespace = v_name.split("/")[0]

      v_init_val = np.array(2.0)
      v_init = constant_op.constant(v_init_val)
      v = variables.Variable(v_init, name=v_name)

      u.initializer.run()
      v.initializer.run()

      i = constant_op.constant(0, name="testDumpToFileWhileLoop/i")

      def cond(i):
        return math_ops.less(i, num_iter)

      def body(i):
        new_u = state_ops.assign_add(u, v)
        new_i = math_ops.add(i, 1)
        op = control_flow_ops.group(new_u)
        new_i = control_flow_ops.with_dependencies([op], new_i)
        return [new_i]

      loop = control_flow_ops.while_loop(cond, body, [i], parallel_iterations=1)

      # Create RunOptions for debug-watching tensors
      run_options = config_pb2.RunOptions()
      run_options.output_partition_graphs = True
      debug_url = "file://%s" % self._dump_root

      # Add debug tensor watch for u.
      self._addDebugTensorWatch(run_options, u_name, 0, debug_urls=[debug_url])
      # Add debug tensor watch for v.
      self._addDebugTensorWatch(
          run_options, "%s/read" % v_name, 0, debug_urls=[debug_url])
      # Add debug tensor watch for while/Identity.
      self._addDebugTensorWatch(
          run_options, "while/Identity", 0, debug_urls=[debug_url])

      run_metadata = config_pb2.RunMetadata()
      r = sess.run(loop, options=run_options, run_metadata=run_metadata)

      self.assertEqual(self._expected_partition_graph_count,
                       len(run_metadata.partition_graphs))

      self.assertEqual(num_iter, r)

      u_val_final = sess.run(u)
      self.assertAllClose(u_init_val + num_iter * v_init_val, u_val_final)

      # Verify dump files
      self.assertTrue(os.path.isdir(self._dump_root))

      self.assertTrue(os.path.isdir(os.path.join(self._dump_root, u_namespace)))
      self.assertTrue(
          os.path.isdir(os.path.join(self._dump_root, v_namespace, "v")))

      dump = debug_data.DebugDumpDir(self._dump_root)

      # Expected dumped tensors: u, v/read, and 10 iterations of while/Identity.
      self.assertEqual(12, dump.size)

      # Verify tensor values.
      self.assertAllClose([u_init_val], dump.get_tensors(u_name, 0,
                                                         "DebugIdentity"))
      self.assertAllClose([v_init_val], dump.get_tensors("%s/read" % v_name, 0,
                                                         "DebugIdentity"))

      while_id_tensors = dump.get_tensors("while/Identity", 0, "DebugIdentity")
      self.assertEqual(10, len(while_id_tensors))
      for k in xrange(len(while_id_tensors)):
        self.assertAllClose(np.array(k), while_id_tensors[k])

      # Verify ascending timestamps from the while loops.
      while_id_rel_timestamps = dump.get_rel_timestamps("while/Identity", 0,
                                                        "DebugIdentity")
      self.assertEqual(10, len(while_id_rel_timestamps))
      prev_rel_time = 0
      for rel_time in while_id_rel_timestamps:
        self.assertGreaterEqual(rel_time, prev_rel_time)
        prev_rel_time = rel_time

  def testFindNodesWithBadTensorValues(self):
    with session.Session() as sess:
      u_name = "testFindNodesWithBadTensorValues/u"
      v_name = "testFindNodesWithBadTensorValues/v"
      w_name = "testFindNodesWithBadTensorValues/w"
      x_name = "testFindNodesWithBadTensorValues/x"
      y_name = "testFindNodesWithBadTensorValues/y"
      z_name = "testFindNodesWithBadTensorValues/z"

      u_init = constant_op.constant([2.0, 4.0])
      u = variables.Variable(u_init, name=u_name)
      v_init = constant_op.constant([2.0, 1.0])
      v = variables.Variable(v_init, name=v_name)

      # Expected output: [0.0, 3.0]
      w = math_ops.sub(u, v, name=w_name)

      # Expected output: [inf, 1.3333]
      x = math_ops.div(u, w, name=x_name)

      # Expected output: [nan, 4.0]
      y = math_ops.mul(w, x, name=y_name)

      z = math_ops.mul(y, y, name=z_name)

      u.initializer.run()
      v.initializer.run()

      run_options = config_pb2.RunOptions()
      debug_utils.watch_graph(
          run_options,
          sess.graph,
          debug_ops=["DebugIdentity"],
          debug_urls="file://%s" % self._dump_root)

      run_metadata = config_pb2.RunMetadata()
      sess.run(z, options=run_options, run_metadata=run_metadata)

      dump = debug_data.DebugDumpDir(self._dump_root)

      def has_bad_value(_, tensor):
        return np.any(np.isnan(tensor)) or np.any(np.isinf(tensor))

      # Find all "offending tensors".
      bad_data = dump.find(has_bad_value)

      # Verify that the nodes with bad values are caught through running find
      # on the debug dump.
      self.assertEqual(3, len(bad_data))
      self.assertEqual(x_name, bad_data[0].node_name)
      self.assertEqual(y_name, bad_data[1].node_name)
      self.assertEqual(z_name, bad_data[2].node_name)

      # Test first_n kwarg of find(): Find the first offending tensor.
      first_bad_datum = dump.find(has_bad_value, first_n=1)

      self.assertEqual(1, len(first_bad_datum))
      self.assertEqual(x_name, first_bad_datum[0].node_name)


if __name__ == "__main__":
  googletest.main()
