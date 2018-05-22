# Representation of Layers (Base Class).
class Layer:
    # Initialize the Properties.
    def __init__(self): 
        self.properties = {}

    # Add Specifications.
    def add_specs(self, specs):
        for spec in specs: # Update Properties based on Specs. Try to Parse the Specs.
            spec_split = spec.split('=')
            self.properties[spec_split[0].strip()] = try_str_to_bool(spec_split[1])

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)

# Representation of Dense Layers. 
class Dense(Layer):
    # Initialize with unit number.
    def __init__(self, units):
        Layer.__init__(self)
        self.units = units
        self.properties = {
            'activation': None,
            'use_bias': True,
            'kernel_initializer': 'glorot_uniform',
            'bias_initializer': 'zeros',
            'kernel_regularizer': None,
            'bias_regularizer': None,
            'activity_regularizer': None,
            'kernel_constraint': None,
            'bias_constraint': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(units: %r, properties: %r)" % (self.__class__, self.units, self.properties)

# Representation of Conv2D Layers. 
class Conv2D(Layer):
    # Initialize with filter number and convolution kernel.
    def __init__(self, filters, kernel_size):
        Layer.__init__(self)
        self.filters = filters
        self.kernel_size = try_str_to_tuple(kernel_size)
        self.properties = {
            'strides': (1, 1),
            'padding': 'valid',
            'data_format': None,
            'dilation_rate': (1, 1),
            'activation': None,
            'use_bias': True,
            'kernel_initializer': 'glorot_uniform',
            'bias_initializer': 'zeros',
            'kernel_regularizer': None,
            'bias_regularizer': None,
            'activity_regularizer': None,
            'kernel_constraint': None,
            'bias_constraint': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(filters: %r, kernel: %r, properties: %r)" % (self.__class__, self.filters, self.kernel_size, self.properties)

# Representation of MaxPool2D Layers. 
class MaxPool2D(Layer):
    # Initialize.
    def __init__(self):
        Layer.__init__(self)
        self.properties = {
            'pool_size': (2, 2),
            'strides': None,
            'padding': 'valid',
            'data_format': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)

# Representation of Dropout Layers. 
class Dropout(Layer):
    # Initialize with rate.
    def __init__(self, rate):
        Layer.__init__(self)
        self.rate = rate
        self.properties = {
            'noise_shape': None,
            'seed': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(rate: %r, properties: %r)" % (self.__class__, self.rate, self.properties)

# Try to cast Spec to Bool.
def try_str_to_bool(s):
    if s == 'True':
        return True
    elif s == 'False':
        return False
    else:
        return try_str_to_number(s)

# Try to cast Spec to Int or Float.
def try_str_to_number(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return try_str_to_tuple(s)

# Try to cast String to Int-Tuple.
def try_str_to_tuple(s):
    try:
        return tuple(map(int, s[1:-1].split(',')))
    except ValueError:
        return s