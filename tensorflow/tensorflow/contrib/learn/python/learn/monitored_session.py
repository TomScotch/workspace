# pylint: disable=g-bad-file-header
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
"""A wrapper of Session API which runs hooks."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from tensorflow.contrib.learn.python.learn import session_run_hook
from tensorflow.contrib.learn.python.learn import summary_writer_cache
from tensorflow.python.framework import errors
from tensorflow.python.framework import ops
from tensorflow.python.ops import control_flow_ops
from tensorflow.python.ops import data_flow_ops
from tensorflow.python.ops import logging_ops
from tensorflow.python.ops import variables
from tensorflow.python.training import coordinator
from tensorflow.python.training import queue_runner
from tensorflow.python.training import saver as training_saver
from tensorflow.python.training import session_manager as sm
from tensorflow.python.training import training_util


# TODO(touts): Share that with the Supervisor.
class Scaffold(object):
  """Structure to create or gather pieces commonly needed to train a model.

  When you build a model for training you usually need ops to initialize
  variables, a `Saver` to checkpoint them, an op to collect summaries for
  the visualizer, and so on.

  Various libraries built on top of the core TensorFlow library take care of
  creating some or all of these pieces and storing them in well known
  collections in the graph.  The `Scaffold` class helps pick these pieces from
  the graph collections, creating and adding them to the collections if needed.

  If you call the scaffold constructor without any arguments, it will pick
  pieces from the collections, creating default ones if needed when
  `scaffold.finalize()` is called.  You can pass arguments to the constructor to
  provide your own pieces.  Pieces that you pass to the constructor are not
  added to the graph collections.

  The following pieces are directly accessible as attributes of the `Scaffold`
  object:

  * `saver`: A `tf.Saver` object taking care of saving the variables.  Picked
    from and stored into the `SAVERS` collection in the graph.
  * `init_op`: An op to run to initialize the variables.  Picked from and
    stored into the `INIT_OP` collection in the graph.
  * `ready_op`: An op to verify that the variables are initialized.  Picked
    from and stored into the `READY_OP` collection in the graph.
  * `local_init_op`: An op to initialize the local variables.  Picked
    from and stored into the `LOCAL_INIT_OP` collection in the graph.
  * `summary_op`: An op to run and merge the summaries in the graph.  Picked
    from and stored into the `SUMMARY_OP` collection in the graph.
  * `global_step`: A tensor containing the global step counter.  Picked
    from and stored into the `GLOBAL_STEP` collection in the graph.

  You can also pass the following additional pieces to the constructor:

  * `init_feed_dict`: A sessionn feed dictionary that should be used when
     running the init op.
  * `init_fn`: A callable to run run after the init op to perform additional
    initializations.  The callable will be called as
    `init_fn(scaffold, session)`.

  """

  # TODO(touts): consider adding the output dir and summary writer (cached)?

  def __init__(self,
               init_op=None,
               init_feed_dict=None,
               init_fn=None,
               ready_op=None,
               local_init_op=None,
               summary_op=None,
               saver=None):
    """Create a scaffold.

    Args:
      init_op: Optional op for initializing variables.
      init_feed_dict: Optional session feed dictionary to use when running the
        init_op.
      init_fn: Optional function to use to initialize the model after running
        the init_op.  Will be called as `init_fn(scaffold, session)`.
      ready_op: Optional op to verify that the variables are initialized.  Must
        return an empty scalar string tensor when the variables are
        initialized, or a non-empty one listing the names of the
        non-initialized variables.
      local_init_op: Optional op to initialize local variables.
      summary_op: Optional op to gather all summaries.  Must return a scalar
        string tensor containing a serialized `Summary` proto.
      saver: Optional `tf.Saver` object to use to save and restore variables.
    """

    # NOTE(touts): modifying the init function to be passed the scaffold is a
    # hack to make it easy to find the saver.  Is there a better way?
    if init_fn:
      self._init_fn = lambda sess: init_fn(self, sess)
    else:
      self._init_fn = None

    self._init_op = init_op
    self._ready_op = ready_op
    self._local_init_op = local_init_op
    self._summary_op = summary_op
    self._saver = saver
    self._init_feed_dict = init_feed_dict

  def finalize(self):
    """Creates operations if needed and finalizes the graph."""
    if self._init_op is None:
      self._init_op = Scaffold._get_or_default(
          'init_op', ops.GraphKeys.INIT_OP, variables.initialize_all_variables)
    if self._ready_op is None:
      self._ready_op = Scaffold._get_or_default(
          'ready_op', ops.GraphKeys.READY_OP,
          variables.report_uninitialized_variables)
    if self._local_init_op is None:
      self._local_init_op = Scaffold._get_or_default(
          'local_init_op', ops.GraphKeys.LOCAL_INIT_OP,
          Scaffold._default_local_init_op)
    if self._summary_op is None:
      self._summary_op = Scaffold._get_or_default(
          'summary_op', ops.GraphKeys.SUMMARY_OP,
          logging_ops.merge_all_summaries)
    # pylint: disable=g-long-lambda
    if self._saver is None:
      self._saver = Scaffold._get_or_default(
          'saver',
          ops.GraphKeys.SAVERS,
          lambda: training_saver.Saver(sharded=True, allow_empty=True))
    # pylint: enable=g-long-lambda
    self._saver.build()

    ops.get_default_graph().finalize()

  @property
  def init_fn(self):
    return self._init_fn

  @property
  def init_op(self):
    return self._init_op

  @property
  def ready_op(self):
    return self._ready_op

  @property
  def local_init_op(self):
    return self._local_init_op

  @property
  def summary_op(self):
    return self._summary_op

  @property
  def saver(self):
    return self._saver

  @property
  def init_feed_dict(self):
    return self._init_feed_dict

  @staticmethod
  def _get_or_default(arg_name, collection_key, default_constructor):
    """Get from cache or create a default operation."""
    elements = ops.get_collection(collection_key)
    if elements:
      if len(elements) > 1:
        raise RuntimeError('More than one item in the collection "%s". '
                           'Please indicate which one to use by passing it to '
                           'the tf.Scaffold constructor as:  '
                           'tf.Scaffold(%s=item to use)', collection_key,
                           arg_name)
      return elements[0]
    op = default_constructor()
    if op is not None:
      ops.add_to_collection(collection_key, op)
    return op

  @staticmethod
  def _default_local_init_op():
    return control_flow_ops.group(variables.initialize_local_variables(),
                                  data_flow_ops.initialize_all_tables())


class MonitoredSession(object):
  """Session-like object that handles initialization, recovery and hooks.

  Example usage:
  ```python
  saver_hook = CheckpointSaverHook(...)
  summary_hook = SummaryHook(...)
  with MonitoredSession(master=..., hooks=[saver_hook, summary_hook]) as sess:
    while not sess.should_stop():
      sess.run(train_op)
  ```

  Initialization: At creation time the monitored session does following things
  in given order:

  * calls `hook.begin()`
  * finalizes the graph via `scaffold.finalize()`
  * create session
  * initializes the model via initialization ops provided by `Scaffold`
  * restores variables if a checkpoint exists
  * launches queue runners

  Run: When `run()` is called, the monitored session does following things:

  * calls `hook.before_run()`
  * calls TensorFlow `session.run()` with merged fetches and feed_dict
  * calls `hook.after_run()`
  * returns result of `session.run()` asked by user
  * if `AbortedError` occurs, it recovers or reinitializes the session before
    executing the run() call again


  Exit: At the `close()`, the monitored session does following things in order:
  * calls `hook.end()`
  * closes the queue runners and the session
  * surpresses `OutOfRange` error which indicates that all inputs have been
    processed if the monitored_session is used as a context.
  """

  def __init__(self,
               master='',
               is_chief=True,
               checkpoint_dir=None,
               hooks=None,
               scaffold=None,
               config=None):
    """Creates a MonitoredSession.

    Args:
      master: `String` representation of the TensorFlow master to use.
      is_chief: If True, it will take care of initialization and recovery the
        underlying TensorFlow session. If False, it will wait on a chief to
        initialize or recover the TensorFlow session.
      checkpoint_dir: A string.  Optional path to a directory where to restore
        variables.
      hooks: An iterable of `SessionRunHook' objects.
      scaffold: A `Scaffold` used for gathering or building supportive ops. If
        not specified a default one is created. It's used to finalize the graph.
      config: `ConfigProto` proto used to configure the session.
    """
    self._graph = ops.get_default_graph()
    self._master = master
    self._checkpoint_dir = checkpoint_dir
    self._is_chief = is_chief
    self._config = config
    self._hooks = hooks or []
    self._scaffold = scaffold or Scaffold()
    self._coord = None
    for h in self._hooks:
      h.begin()
    # Create the session.
    self._scaffold.finalize()
    self._session_manager = sm.SessionManager(
        local_init_op=self._scaffold.local_init_op,
        ready_op=self._scaffold.ready_op,
        graph=ops.get_default_graph())
    self._sess = _RecoverableSession(self._create_session)
    self.write_graph()

  def _create_session(self):
    """Factory for the _RecoverableSession.

    Returns:
      A session, initialized or recovered as needed.
    """
    if self._is_chief:
      tf_sess = self._session_manager.prepare_session(
          self._master,
          saver=self._scaffold.saver,
          checkpoint_dir=self._checkpoint_dir,
          config=self._config,
          init_op=self._scaffold.init_op,
          init_feed_dict=self._scaffold.init_feed_dict,
          init_fn=self._scaffold.init_fn)
    else:
      tf_sess = self._session_manager.wait_for_session(
          self._master, config=self._config)
    # Keep the tf_sess for quick runs of global step when needed.
    self._tf_sess = tf_sess
    # We don't want coordinator to suppress any exception.
    self._coord = coordinator.Coordinator(clean_stop_exception_types=[])
    queue_runner.start_queue_runners(sess=tf_sess, coord=self._coord)
    return _CoordinatedSession(_HookedSession(tf_sess, self._hooks),
                               self._coord)

  @property
  def scaffold(self):
    return self._scaffold

  @property
  def session(self):
    return self._tf_sess

  def run(self, fetches, feed_dict=None, options=None, run_metadata=None):
    """Run ops in the monitored session.

    This method is completely compatible with the `tf.Session.run()` method.

    Args:
      fetches: Same as `tf.Session.run()`.
      feed_dict: Same as `tf.Session.run()`.
      options: Same as `tf.Session.run()`.
      run_metadata: Same as `tf.Session.run()`.

    Returns:
      Same as `tf.Session.run()`.
    """
    return self._sess.run(fetches,
                          feed_dict=feed_dict,
                          options=options,
                          run_metadata=run_metadata)

  def should_stop(self):
    if self._sess:
      return self._sess.should_stop()
    return True

  def close(self):
    self._close_internal()

  def _close_internal(self, exception_type=None):
    try:
      if not exception_type:
        for h in self._hooks:
          h.end(self._tf_sess)
      if not self._coord.joined:
        # We exited cleanly without stopping.  Some things now.  This will also
        # re-raise exceptions from the coordinated threads, as needed.
        self._coord.request_stop()
        self._coord.join()
    finally:
      self._sess.close()
      self._sess = None
      self._tf_sess = None
      self._coord = None

  @property
  def coord(self):
    return self._coord

  def _is_closed(self):
    """Return True if the supervised session is closed.  For tests only.

    Returns:
      A boolean.
    """
    return self._tf_sess is None

  def __enter__(self):
    return self

  def __exit__(self, exception_type, exception_value, traceback):
    if exception_type in [errors.OutOfRangeError, StopIteration]:
      # TODO(ispir): log error if Coordinator hasn't done already.
      exception_type = None
    self._close_internal(exception_type)
    # __exit__ should return True to suppress an exception.
    return exception_type is None

  def write_graph(self):
    """Saves current graph."""
    if self._checkpoint_dir is not None and self._is_chief:
      summary_writer = summary_writer_cache.SummaryWriterCache.get(
          self._checkpoint_dir)
      training_util.write_graph(
          self._graph.as_graph_def(add_shapes=True),
          self._checkpoint_dir,
          'graph.pbtxt')
      summary_writer.add_graph(self._graph)


class _WrappedSession(object):
  """Wrapper around a `tf.Session`.

  This wrapper is used as a base class for various session wrappers
  that provide additional functionality such as monitoring, coordination,
  and recovery.

  In addition to the methods exported by `SessionInterface` the wrapper
  provides a method to check for stop and never raises exceptions from
  calls to `close()`.
  """

  def __init__(self, sess):
    """Creates a `_WrappedSession`.

    Args:
      sess: A `tf.Session` or `_WrappedSession` object.  The wrapped session.
    """
    self._sess = sess
    self._wrapped_is_stoppable = isinstance(self._sess, _WrappedSession)

  @property
  def graph(self):
    return self._sess.graph

  @property
  def sess_str(self):
    return self._sess.sess_str

  def should_stop(self):
    """Return true if this session should not be used anymore.

    Always return True if the session was closed.

    Returns:
      True if the session should stop, False otherwise.
    """
    if self._check_stop():
      return True
    if self._sess:
      return self._wrapped_is_stoppable and self._sess.should_stop()
    return True

  def _check_stop(self):
    """Hook for subclasses to provide their own stop condition.

    Returns:
      True if the session should stop, False otherwise.
    """
    return False

  def close(self):
    if self._sess:
      try:
        self._sess.close()
      except Exception:  # pylint: disable=broad-except
        pass
      finally:
        self._sess = None

  def run(self, *args, **kwargs):
    return self._sess.run(*args, **kwargs)


class _RecoverableSession(_WrappedSession):
  """A wrapped session that recreates a session on `tf.errors.AbortedError`.

  The constructor is passed a session _factory_, not a session.  The factory is
  a no-argument function that must return a `Session`.

  Calls to `run()` are delegated to the wrapped session.  If a call raises the
  exception `tf.errors.AbortedError`, the wrapped session is closed, and a new
  one is created by calling the factory again.
  """

  def __init__(self, sess_factory):
    """Create a new `_RecoverableSession`.

    The value returned by calling `sess_factory()` will be the
    session wrapped by this recoverable session.

    Args:
      sess_factory: A callable with no arguments that returns a
        `tf.Session` when called.
    """
    self._factory = sess_factory
    _WrappedSession.__init__(self, sess_factory())

  def run(self, fetches, feed_dict=None, options=None, run_metadata=None):
    while True:
      try:
        if not self._sess:
          self._sess = self._factory()
        return self._sess.run(fetches,
                              feed_dict=feed_dict,
                              options=options,
                              run_metadata=run_metadata)
      except errors.AbortedError:
        self.close()
        self._sess = None


class _CoordinatedSession(_WrappedSession):
  """A wrapped session that works with a `tf.Coordinator`.

  Calls to `run()` are delegated to the wrapped session.  If a call
  raises an exception, the exception is reported to the coordinator.

  In addition, after each call to `run()` this session ask the coordinator if
  the session should stop.  In that case it will will join all the threads
  registered with the coordinator before returning.

  If the coordinator was requested to stop with an exception, that exception
  will be re-raised from the call to `run()`.
  """

  def __init__(self, sess, coord):
    """Create a new `_CoordinatedSession`.

    Args:
      sess: A `tf.Session` object.  The wrapped session.
      coord: A `tf.train.Coordinator` object.
    """
    _WrappedSession.__init__(self, sess)
    self._coord = coord

  def _check_stop(self):
    # Check with the coordinator if we should stop.
    return self._coord.should_stop()

  def close(self):
    try:
      if not self._coord.should_stop():
        self._coord.request_stop()
        self._coord.join()
    except Exception:  # pylint: disable=broad-except
      # Don't raise exception at close
      pass
    finally:
      _WrappedSession.close(self)

  def run(self, *args, **kwargs):
    try:
      return self._sess.run(*args, **kwargs)
    except Exception as e:  # pylint: disable=broad-except
      self._coord.request_stop(e)
    finally:
      if self._coord.should_stop():
        self._coord.join()


class _HookedSession(_WrappedSession):
  """A _WrappedSession that calls hooks during calls to run().

  The list of hooks to call is passed in the constructor.  Before each call
  to `run()` the session calls the `before_run()` method of the hooks, which
  can return additional ops or tensors to run.  These are added to the arguments
  of the call to `run()`.

  When the `run()` call finishes, the session calls the `after_run()` methods of
  the hooks, passing the values returned by the `run()` call corresponding to
  the ops and tensors that each hook requested.

  If any call to the hooks, requests stop via run_context the session will be
  marked as needing to stop and its `should_stop()` method will now return
  `True`.
  """

  def __init__(self, sess, hooks):
    """Initializes a _HookedSession object.

    Args:
      sess: A `tf.Session` or a `_WrappedSession` object.
      hooks: An iterable of `SessionRunHook' objects.
    """

    _WrappedSession.__init__(self, sess)
    self._hooks = hooks
    self._should_stop = False

  def _check_stop(self):
    """See base class."""
    return self._should_stop

  def run(self, fetches, feed_dict=None, options=None, run_metadata=None):
    """See base class."""
    if self.should_stop():
      raise RuntimeError('Run called even after should_stop requested.')

    actual_fetches = {'caller': fetches}

    run_context = session_run_hook.SessionRunContext(
        original_args=session_run_hook.SessionRunArgs(fetches, feed_dict),
        session=self._sess)
    feed_dict = self._call_hook_before_run(
        run_context, actual_fetches, feed_dict)

    # Do session run.
    outputs = _WrappedSession.run(self,
                                  fetches=actual_fetches,
                                  feed_dict=feed_dict,
                                  options=options,
                                  run_metadata=run_metadata)

    for hook in self._hooks:
      hook.after_run(
          run_context,
          session_run_hook.SessionRunValues(results=outputs[hook] if
                                            hook in outputs else None))
    self._should_stop = self._should_stop or run_context.stop_requested

    return outputs['caller']

  def _call_hook_before_run(self, run_context, fetch_dict, user_feed_dict):
    """Calls hooks.before_run and handles requests from hooks."""
    hook_feeds = {}
    for hook in self._hooks:
      request = hook.before_run(run_context)
      if request is not None:
        if request.fetches is not None:
          fetch_dict[hook] = request.fetches
        if request.feed_dict:
          self._raise_if_feeds_intersects(
              hook_feeds, request.feed_dict,
              'Same tensor is fed by two hooks.')
          hook_feeds.update(request.feed_dict)

    if not hook_feeds:
      return user_feed_dict

    if not user_feed_dict:
      return hook_feeds

    self._raise_if_feeds_intersects(
        user_feed_dict, hook_feeds,
        'Same tensor is fed by a SessionRunHook and user.')
    hook_feeds.update(user_feed_dict)
    return hook_feeds

  def _raise_if_feeds_intersects(self, feeds1, feeds2, message):
    intersection = set(feeds1.keys()) & set(feeds2.keys())
    if intersection:
      raise RuntimeError(message + ' Conflict(s): ' + str(list(intersection)))
