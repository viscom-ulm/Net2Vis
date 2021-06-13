"""Used to handle neural network data graphs."""
class Node:
  """Representing one node in the Graph."""
  def __init__(self):
    self.data = None
    self.children = []
    self.parent = None

# Representation of the Graph that gets extracted from Code.
class Graph:
  """Representing a Network Graph."""
  def __init__(self):
    self.layers = []


  def add_layer(self, layer):
    """Add a new Layer to the Graph.

    Arguments:
        layer {object} -- the layer to be added
    """
    self.layers.append(layer)


  # Return the Graph representation.
  def __repr__(self):
    string = ''
    for i in range(len(self.layers)):
      string = string + type(self.layers[i]).__name__
      if i != (len(self.layers) - 1):
        string = string + ' -> '
    return string


  def resolve_input_names(self):
    """Generate references between the Layers based on the Input names."""
    for i in range(len(self.layers)):
      for name in self.layers[i].input_names:
        for j in range(len(self.layers)):
          if self.layers[j].name == name:
            self.layers[i].input.append(self.layers[j])
            self.layers[j].output.append(self.layers[i])


  def dimensions_str(self):
    """Return the Layer Dimensions as Pretty String.

    Returns:
        String -- the dimensions of all layers as a string
    """
    dim = ''
    for i in range(len(self.layers)):
      dim = dim + str(self.layers[i].dimensions)
      if i != (len(self.layers)-1):
        dim = dim + ' -> '
    return dim


  def dimensions(self):
    """Return the Layer Dimensions as Array.

    Returns:
        list -- the dimenstions of the network layers
    """
    dim = []
    for i in range(len(self.layers)):
      dim.append(self.layers[i].dimensions)
    return dim
