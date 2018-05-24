# Representation of Layers (Base Class).
class Layer:
    # Initialize the Properties.
    def __init__(self): 
        self.properties = {}
        self.input = []
        self.output = []
        self.dimensions = None

    # Add Specifications.
    def add_specs(self, specs):
        for spec in specs: # Update Properties based on Specs. Try to Parse the Specs.
            spec_split = spec.split('=')
            self.properties[spec_split[0].strip()] = try_cast(spec_split[1])

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)

    # Calculate the Dimensions of the Layer recursively.
    def calculate_dimensions_recursive(self, input_dim):
        if(len(self.input) == 0): # If no Inputs, use the given input Dimension.
            self.calculate_dimensions([input_dim])
        else: 
            input_dims = []
            for layer_in in self.input: # Get the input Dimensions of all Inputs.
                if not self.dimensions: # If Input has no Dimension yet, calculate it.
                    layer_in.calculate_dimensions_recursive(input_dim)
                input_dims.append(layer_in.dimensions)
            self.calculate_dimensions(input_dims) # Calculate the Dimensions of the current Layer.

    # Basic Dimension Calculation outputting the identity of the first input dimension.
    def calculate_dimensions(self, input_dim):
        self.dimensions = input_dim[0]

# Representation of Dense Layers. 
class Dense(Layer):
    # Initialize with unit number.
    def __init__(self, units):
        Layer.__init__(self)
        self.units = try_cast(units)
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

    # Dimension Calculation for a Dense Layer.
    def calculate_dimensions(self, input_dim):
        self.dimensions = self.units

# Representation of Conv2D Layers. 
class Conv2D(Layer):
    # Initialize with filter number and convolution kernel.
    def __init__(self, filters, kernel_size):
        Layer.__init__(self)
        self.filters = try_cast(filters)
        self.kernel_size = tupelize(try_cast(kernel_size))
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

    # Dimension Calculation for Convolution Layers.
    def calculate_dimensions(self, input_dim):
        if self.properties['padding'] == 'valid': # Check padding Type and calculate Padding. 
            p = [0, 0]
        else: # Same Padding.
            p = [int((self.kernel_size[0]-1)/2), int((self.kernel_size[1]-1)/2)]
        self.dimensions = [calculate_next_layer(p[0], tupelize(self.properties['strides'])[0], input_dim[0][0], self.kernel_size[0]),
            calculate_next_layer(p[1], tupelize(self.properties['strides'])[1], input_dim[0][1], self.kernel_size[1]),
            self.filters]

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

    # Dimension Calculation for Pooling Layers.
    def calculate_dimensions(self, input_dim):
        if self.properties['padding'] == 'valid': # Check padding Type and calculate Padding. 
            p = [0, 0]
        else: # Same Padding
            p = [int((tupelize(self.properties['pool_size'])[0]-1)/2), int((tupelize(self.properties['pool_size'])[1]-1)/2)]
        if not self.properties['strides']: # Check if Strides were not set.
            str = tupelize(self.properties['pool_size'])
        else: # Strides set.
            str = tupelize(self.properties['strides'])
        self.dimensions = [calculate_next_layer(p[0], str[0], input_dim[0][0], tupelize(self.properties['pool_size'])[0]),
            calculate_next_layer(p[1], str[1], input_dim[0][1], tupelize(self.properties['pool_size'])[1]),
            input_dim[0][2]]

# Representation of Dropout Layers. 
class Dropout(Layer):
    # Initialize with rate.
    def __init__(self, rate):
        Layer.__init__(self)
        self.rate = try_cast(rate)
        self.properties = {
            'noise_shape': None,
            'seed': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(rate: %r, properties: %r)" % (self.__class__, self.rate, self.properties)

# Representation of Flatten Layers. 
class Flatten(Layer):
    # Initialize.
    def __init__(self):
        Layer.__init__(self)
        self.properties = {
            'data_format': None
        }

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)

    # Dimension Calculation for Flatten Layers.
    def calculate_dimensions(self, input_dim):
        self.dimensions = 1
        for dim in input_dim[0]: # Multiply all Dimensions.
            self.dimensions = self.dimensions * dim

# Representation of Dropout Layers. 
class Activation(Layer):
    # Initialize with rate.
    def __init__(self, activation):
        Layer.__init__(self)
        self.activation = try_cast(activation)

    # String Representation of the Layer.
    def __repr__(self):
        return "%s(activation: %r)" % (self.__class__, self.activation)

# Try to cast the Spec.
def try_cast(s):
    try: # Cast to Bool.
        return try_str_to_bool(s)
    except ValueError:
        try: # Cast to Numeric.
            return try_str_to_number(s)
        except ValueError:
            try: # Cast to Tuple.
                return try_str_to_tuple(s)
            except ValueError:
                return s

# Try to cast Spec to Bool.
def try_str_to_bool(s):
    if s == 'True':
        return True
    elif s == 'False':
        return False
    else:
        raise ValueError('Could not Cast to Bool.')

# Try to cast Spec to Int or Float.
def try_str_to_number(s):
    try:
        return int(s)
    except ValueError:
        return float(s)
        
# Try to cast String to Int-Tuple.
def try_str_to_tuple(s):
    return tuple(map(int, s[1:-1].split(',')))

# Convert Variable to Tuple.
def tupelize(s):
    if not isinstance(s, tuple):
        return (s, s)
    else:
        return s

# Calculate the Size of the Next Layer with Padding, Strides, Input Size and Kernel Size
def calculate_next_layer(padding, stride, input_size, kernel_size):
    return int((input_size + (2 * padding) - kernel_size) / stride) + 1