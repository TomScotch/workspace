Bernoulli distribution.

The Bernoulli distribution is parameterized by p, the probability of a
positive event.
- - -

#### `tf.contrib.distributions.Bernoulli.__init__(logits=None, p=None, dtype=tf.int32, validate_args=True, allow_nan_stats=False, name='Bernoulli')` {#Bernoulli.__init__}

Construct Bernoulli distributions.

##### Args:


*  <b>`logits`</b>: An N-D `Tensor` representing the log-odds
    of a positive event. Each entry in the `Tensor` parametrizes
    an independent Bernoulli distribution where the probability of an event
    is sigmoid(logits).
*  <b>`p`</b>: An N-D `Tensor` representing the probability of a positive
      event. Each entry in the `Tensor` parameterizes an independent
      Bernoulli distribution.
*  <b>`dtype`</b>: dtype for samples.
*  <b>`validate_args`</b>: Whether to assert that `0 <= p <= 1`. If not validate_args,
   `log_pmf` may return nans.
*  <b>`allow_nan_stats`</b>: Boolean, default `False`.  If `False`, raise an
    exception if a statistic (e.g. mean/mode/etc...) is undefined for any
    batch member.  If `True`, batch members with valid parameters leading to
    undefined statistics will return NaN for this statistic.
*  <b>`name`</b>: A name for this distribution.

##### Raises:


*  <b>`ValueError`</b>: If p and logits are passed, or if neither are passed.


- - -

#### `tf.contrib.distributions.Bernoulli.allow_nan_stats` {#Bernoulli.allow_nan_stats}

Python boolean describing behavior when a stat is undefined.

Stats return +/- infinity when it makes sense.  E.g., the variance
of a Cauchy distribution is infinity.  However, sometimes the
statistic is undefined, e.g., if a distribution's pdf does not achieve a
maximum within the support of the distribution, the mode is undefined.
If the mean is undefined, then by definition the variance is undefined.
E.g. the mean for Student's T for df = 1 is undefined (no clear way to say
it is either + or - infinity), so the variance = E[(X - mean)^2] is also
undefined.

##### Returns:


*  <b>`allow_nan_stats`</b>: Python boolean.


- - -

#### `tf.contrib.distributions.Bernoulli.batch_shape(name='batch_shape')` {#Bernoulli.batch_shape}

Shape of a single sample from a single event index as a 1-D `Tensor`.

The product of the dimensions of the `batch_shape` is the number of
independent distributions of this kind the instance represents.

##### Args:


*  <b>`name`</b>: name to give to the op

##### Returns:


*  <b>`batch_shape`</b>: `Tensor`.


- - -

#### `tf.contrib.distributions.Bernoulli.cdf(value, name='cdf')` {#Bernoulli.cdf}

Cumulative distribution function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`cdf`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.


- - -

#### `tf.contrib.distributions.Bernoulli.dtype` {#Bernoulli.dtype}

The `DType` of `Tensor`s handled by this `Distribution`.


- - -

#### `tf.contrib.distributions.Bernoulli.entropy(name='entropy')` {#Bernoulli.entropy}

Shanon entropy in nats.


- - -

#### `tf.contrib.distributions.Bernoulli.event_shape(name='event_shape')` {#Bernoulli.event_shape}

Shape of a single sample from a single batch as a 1-D int32 `Tensor`.

##### Args:


*  <b>`name`</b>: name to give to the op

##### Returns:


*  <b>`event_shape`</b>: `Tensor`.


- - -

#### `tf.contrib.distributions.Bernoulli.from_params(cls, make_safe=True, **kwargs)` {#Bernoulli.from_params}

Given (unconstrained) parameters, return an instantiated distribution.

Subclasses should implement a static method `_safe_transforms` that returns
a dict of parameter transforms, which will be used if `make_safe = True`.

Example usage:

```
# Let's say we want a sample of size (batch_size, 10)
shapes = MultiVariateNormalDiag.param_shapes([batch_size, 10])

# shapes has a Tensor shape for mu and sigma
# shapes == {
#   "mu": tf.constant([batch_size, 10]),
#   "sigma": tf.constant([batch_size, 10]),
# }

# Here we parameterize mu and sigma with the output of a linear
# layer. Note that sigma is unconstrained.
params = {}
for name, shape in shapes.items():
  params[name] = linear(x, shape[1])

# Note that you can forward other kwargs to the `Distribution`, like
# `allow_nan_stats` or `name`.
mvn = MultiVariateNormalDiag.from_params(**params, allow_nan_stats=True)
```

Distribution parameters may have constraints (e.g. `sigma` must be positive
for a `Normal` distribution) and the `from_params` method will apply default
parameter transforms. If a user wants to use their own transform, they can
apply it externally and set `make_safe=False`.

##### Args:


*  <b>`make_safe`</b>: Whether the `params` should be constrained. If True,
    `from_params` will apply default parameter transforms. If False, no
    parameter transforms will be applied.
*  <b>`**kwargs`</b>: dict of parameters for the distribution.

##### Returns:

  A distribution parameterized by possibly transformed parameters in
  `kwargs`.

##### Raises:


*  <b>`TypeError`</b>: if `make_safe` is `True` but `_safe_transforms` is not
    implemented directly for `cls`.


- - -

#### `tf.contrib.distributions.Bernoulli.get_batch_shape()` {#Bernoulli.get_batch_shape}

Shape of a single sample from a single event index as a `TensorShape`.

Same meaning as `batch_shape`. May be only partially defined.

##### Returns:


*  <b>`batch_shape`</b>: `TensorShape`, possibly unknown.


- - -

#### `tf.contrib.distributions.Bernoulli.get_event_shape()` {#Bernoulli.get_event_shape}

Shape of a single sample from a single batch as a `TensorShape`.

Same meaning as `event_shape`. May be only partially defined.

##### Returns:


*  <b>`event_shape`</b>: `TensorShape`, possibly unknown.


- - -

#### `tf.contrib.distributions.Bernoulli.is_continuous` {#Bernoulli.is_continuous}




- - -

#### `tf.contrib.distributions.Bernoulli.is_reparameterized` {#Bernoulli.is_reparameterized}




- - -

#### `tf.contrib.distributions.Bernoulli.log_cdf(value, name='log_cdf')` {#Bernoulli.log_cdf}

Log cumulative distribution function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`logcdf`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.


- - -

#### `tf.contrib.distributions.Bernoulli.log_pdf(value, name='log_pdf')` {#Bernoulli.log_pdf}

Log probability density function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`log_prob`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.

##### Raises:


*  <b>`AttributeError`</b>: if not `is_continuous`.


- - -

#### `tf.contrib.distributions.Bernoulli.log_pmf(value, name='log_pmf')` {#Bernoulli.log_pmf}

Log probability mass function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`log_pmf`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.

##### Raises:


*  <b>`AttributeError`</b>: if `is_continuous`.


- - -

#### `tf.contrib.distributions.Bernoulli.log_prob(value, name='log_prob')` {#Bernoulli.log_prob}

Log probability density/mass function (depending on `is_continuous`).

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`log_prob`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.


- - -

#### `tf.contrib.distributions.Bernoulli.logits` {#Bernoulli.logits}




- - -

#### `tf.contrib.distributions.Bernoulli.mean(name='mean')` {#Bernoulli.mean}

Mean.


- - -

#### `tf.contrib.distributions.Bernoulli.mode(name='mode')` {#Bernoulli.mode}

Mode.


- - -

#### `tf.contrib.distributions.Bernoulli.name` {#Bernoulli.name}

Name prepended to all ops created by this `Distribution`.


- - -

#### `tf.contrib.distributions.Bernoulli.p` {#Bernoulli.p}




- - -

#### `tf.contrib.distributions.Bernoulli.param_shapes(cls, sample_shape, name='DistributionParamShapes')` {#Bernoulli.param_shapes}

Shapes of parameters given the desired shape of a call to `sample()`.

Subclasses should override static method `_param_shapes`.

##### Args:


*  <b>`sample_shape`</b>: `Tensor` or python list/tuple. Desired shape of a call to
    `sample()`.
*  <b>`name`</b>: name to prepend ops with.

##### Returns:

  `dict` of parameter name to `Tensor` shapes.


- - -

#### `tf.contrib.distributions.Bernoulli.param_static_shapes(cls, sample_shape)` {#Bernoulli.param_static_shapes}

param_shapes with static (i.e. TensorShape) shapes.

##### Args:


*  <b>`sample_shape`</b>: `TensorShape` or python list/tuple. Desired shape of a call
    to `sample()`.

##### Returns:

  `dict` of parameter name to `TensorShape`.

##### Raises:


*  <b>`ValueError`</b>: if `sample_shape` is a `TensorShape` and is not fully defined.


- - -

#### `tf.contrib.distributions.Bernoulli.parameters` {#Bernoulli.parameters}

Dictionary of parameters used by this `Distribution`.


- - -

#### `tf.contrib.distributions.Bernoulli.pdf(value, name='pdf')` {#Bernoulli.pdf}

Probability density function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`prob`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.

##### Raises:


*  <b>`AttributeError`</b>: if not `is_continuous`.


- - -

#### `tf.contrib.distributions.Bernoulli.pmf(value, name='pmf')` {#Bernoulli.pmf}

Probability mass function.

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`pmf`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.

##### Raises:


*  <b>`AttributeError`</b>: if `is_continuous`.


- - -

#### `tf.contrib.distributions.Bernoulli.prob(value, name='prob')` {#Bernoulli.prob}

Probability density/mass function (depending on `is_continuous`).

##### Args:


*  <b>`value`</b>: `float` or `double` `Tensor`.
*  <b>`name`</b>: The name to give this op.

##### Returns:


*  <b>`prob`</b>: a `Tensor` of shape `sample_shape(x) + self.batch_shape` with
    values of type `self.dtype`.


- - -

#### `tf.contrib.distributions.Bernoulli.q` {#Bernoulli.q}

1-p.


- - -

#### `tf.contrib.distributions.Bernoulli.sample(sample_shape=(), seed=None, name='sample')` {#Bernoulli.sample}

Generate samples of the specified shape.

Note that a call to `sample()` without arguments will generate a single
sample.

##### Args:


*  <b>`sample_shape`</b>: 0D or 1D `int32` `Tensor`. Shape of the generated samples.
*  <b>`seed`</b>: Python integer seed for RNG
*  <b>`name`</b>: name to give to the op.

##### Returns:


*  <b>`samples`</b>: a `Tensor` with prepended dimensions `sample_shape`.


- - -

#### `tf.contrib.distributions.Bernoulli.sample_n(n, seed=None, name='sample_n')` {#Bernoulli.sample_n}

Generate `n` samples.

##### Args:


*  <b>`n`</b>: `Scalar` `Tensor` of type `int32` or `int64`, the number of
    observations to sample.
*  <b>`seed`</b>: Python integer seed for RNG
*  <b>`name`</b>: name to give to the op.

##### Returns:


*  <b>`samples`</b>: a `Tensor` with a prepended dimension (n,).

##### Raises:


*  <b>`TypeError`</b>: if `n` is not an integer type.


- - -

#### `tf.contrib.distributions.Bernoulli.std(name='std')` {#Bernoulli.std}

Standard deviation.


- - -

#### `tf.contrib.distributions.Bernoulli.validate_args` {#Bernoulli.validate_args}

Python boolean indicated possibly expensive checks are enabled.


- - -

#### `tf.contrib.distributions.Bernoulli.variance(name='variance')` {#Bernoulli.variance}

Variance.


