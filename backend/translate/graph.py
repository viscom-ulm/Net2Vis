class Node:
  def __init__(self):
    self.data = None
    self.children = []
    self.parent = None

# Representation of the Graph that gets extracted from Code.
class Graph:
  def __init__(self):
    self.layers = []
    self.root = Node()
    self.input_shape = []

  # Add a new Layer to the Graph.
  def add_layer(self, layer):
    self.layers.append(layer)

  def set_input_shape(self, input_shape):
    self.input_shape = input_shape

  # Return the Graph representation.
  def __repr__(self):
    string = ''
    for i in range(len(self.layers)):
      string = string + type(self.layers[i]).__name__
      if i != (len(self.layers) - 1):
        string = string + ' -> '
    return string

  # Generate references between the Layers based on the Input names.
  def resolve_input_names(self):
    for i in range(len(self.layers)):
      for name in self.layers[i].input_names:
        for j in range(len(self.layers)):
          if self.layers[j].name == name:
            self.layers[i].input.append(self.layers[j])
            self.layers[j].output.append(self.layers[i])

  # Return the Layer Dimensions as Pretty String.
  def dimensions_str(self):
    dim = ''
    for i in range(len(self.layers)):
      dim = dim + str(self.layers[i].dimensions)
      if(i != (len(self.layers)-1)):
        dim = dim + ' -> '
    return dim

  # Return the Layer Dimensions as Array.
  def dimensions(self):
    dim = []
    for i in range(len(self.layers)):
      dim.append(self.layers[i].dimensions)
    return dim
