# Representation of Layers (Base Class).
class Layer:
  # Initialize the Properties.
  def __init__(self): 
    self.properties = {}
    self.input = []
    self.input_names = []
    self.output = []
    self.dimensions = None

  # Add Specifications.
  def add_specs(self, specs):
    for prop in self.properties: # Update Properties based on Specs. Try to Parse the Specs.
      self.properties[prop] = specs[prop]

  # Adds all the Names of the Input Nodes to the Layer
  def add_input_names(self, nodes):
    for node in nodes[0]:
      self.input_names.append(node[0])

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
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': input_dim[0]['out']
    }


# Representation of Dense Layers. 
class Dense(Layer):
  # Initialize with unit number.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'units': 0,
      'activation': None,
      'use_bias': True
    }

  # Dimension Calculation for a Dense Layer.
  def calculate_dimensions(self, input_dim):
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': self.properties['units']
    }


# Representation of Conv2D Layers. 
class Conv2D(Layer):
  # Initialize with filter number and convolution kernel.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'filters': 0,
      'kernel_size': [1, 1], 
      'strides': [1, 1],
      'padding': 'valid',
      'data_format': None,
      'dilation_rate': [1, 1],
      'activation': None,
      'use_bias': True
    }

  # Dimension Calculation for Convolution Layers.
  def calculate_dimensions(self, input_dim):
    if self.properties['padding'] == 'valid': # Check padding Type and calculate Padding. 
      p = [0, 0]
    else: # Same Padding.
      p = [int((self.properties['kernel_size'][0]-1)/2), int((self.properties['kernel_size'][1]-1)/2)]
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': [calculate_next_layer(p[0], self.properties['strides'][0], input_dim[0]['out'][0], self.properties['kernel_size'][0]), calculate_next_layer(p[1], self.properties['strides'][1], input_dim[0]['out'][1], self.properties['kernel_size'][1]), self.properties['filters']]
    }


# Representation of MaxPool2D Layers. 
class MaxPool2D(Layer):
  # Initialize.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'pool_size': [2, 2],
      'strides': None,
      'padding': 'valid',
      'data_format': None
    }

  # Dimension Calculation for Pooling Layers.
  def calculate_dimensions(self, input_dim):
    if self.properties['padding'] == 'valid': # Check padding Type and calculate Padding. 
      p = [0, 0]
    else: # Same Padding
      p = [int((self.properties['pool_size'][0]-1)/2), int((self.properties['pool_size'][1]-1)/2)]
    if not self.properties['strides']: # Check if Strides were not set.
      str = self.properties['pool_size']
    else: # Strides set.
      str = self.properties['strides']
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': [calculate_next_layer(p[0], str[0], input_dim[0]['out'][0], self.properties['pool_size'][0]), calculate_next_layer(p[1], str[1], input_dim[0]['out'][1], self.properties['pool_size'][1]), input_dim[0]['out'][2]]
    }


# Representation of Dropout Layers. 
class Dropout(Layer):
  # Initialize with rate.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'rate': 0.0,
      'noise_shape': None,
      'seed': None
    }


# Representation of Flatten Layers. 
class Flatten(Layer):
  # Initialize.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name

  # # Dimension Calculation for Flatten Layers.
  def calculate_dimensions(self, input_dim):
    dims = 1
    for dim in input_dim[0]['out']: # Multiply all Dimensions.
      dims = dims * dim
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': dims
    }


# Representation of Dropout Layers. 
class Activation(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'activation': None
    }


# Representation of LeakyReLU Layers. 
class LeakyReLU(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'alpha': 0.3
    }


# Representation of BatchNormalization Layers. 
class BatchNormalization(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'axis': -1,
      'momentum': 0.99,
      'epsilon': 0.001,
      'center': True,
      'scale': True
    }


# Representation of Add Layers. 
class Add(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name


# Respresentation of Concatenation Layers.
class Concatenate(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'axis': -1
    }

  def calculate_dimensions(self, input_dim):
    out = input_dim[0]['out'].copy()
    for dim in input_dim[1:]: 
      out[self.properties['axis']] = out[self.properties['axis']] + dim['out'][self.properties['axis']]
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': out
    }


class UpSampling2D(Layer):
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'size': [2, 2],
      'data_format': None,
    }

  def calculate_dimensions(self, input_dim):
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': [input_dim[0]['out'][0] * self.properties['size'][0], input_dim[0]['out'][1] * self.properties['size'][1], input_dim[0]['out'][2]]
    }


# Representation of Conv2D Layers. 
class Conv3D(Layer):
  # Initialize with filter number and convolution kernel.
  def __init__(self, name):
    Layer.__init__(self)
    self.name = name
    self.properties = {
      'filters': 0,
      'kernel_size': [1, 1, 1], 
      'strides': [1, 1, 1],
      'padding': 'valid',
      'data_format': None,
      'dilation_rate': [1, 1, 1],
      'activation': None,
      'use_bias': True
    }

  # Dimension Calculation for Convolution Layers.
  def calculate_dimensions(self, input_dim):
    if self.properties['padding'] == 'valid': # Check padding Type and calculate Padding. 
      p = [0, 0, 0]
    else: # Same Padding.
      p = [int((self.properties['kernel_size'][0]-1)/2), int((self.properties['kernel_size'][1]-1)/2), int((self.properties['kernel_size'][2]-1)/2)]
    self.dimensions = {
      'in': input_dim[0]['out'],
      'out': [calculate_next_layer(p[0], self.properties['strides'][0], input_dim[0]['out'][0], self.properties['kernel_size'][0]), calculate_next_layer(p[1], self.properties['strides'][1], input_dim[0]['out'][1], self.properties['kernel_size'][1]), calculate_next_layer(p[2], self.properties['strides'][2], input_dim[0]['out'][2], self.properties['kernel_size'][2]), self.properties['filters']]
    }


# Calculate the Size of the Next Layer with Padding, Strides, Input Size and Kernel Size
def calculate_next_layer(padding, stride, input_size, kernel_size):
  return int((input_size + (2 * padding) - kernel_size) / stride) + 1
