"""Used to handle layers as objects."""
class Layer:
  """Representation of Layers."""
  # Initialize the Properties.
  def __init__(self, class_name, name, layer):
    self.properties = {}
    self.input = []
    self.input_names = []
    self.output = []
    self.name = name
    self.type = class_name
    self.dimensions = {
        'in': 0,
        'out': layer.get_output_at(0).get_shape().as_list()[1:]
    }
    if isinstance(layer.get_input_at(0), list):
      self.dimensions['in'] = layer.get_input_at(0)[0].get_shape().as_list()[1:]
    else:
      self.dimensions['in'] = layer.get_input_at(0).get_shape().as_list()[1:]
    if isinstance(layer.get_output_at(0), list):
      self.dimensions['out'] = layer.get_output_at(0)[0].get_shape().as_list()[1:]
    else:
      self.dimensions['out'] = layer.get_output_at(0).get_shape().as_list()[1:]


  def add_specs(self, specs):
    """Add Specifications.

    Arguments:
        specs {list} -- the specifications to be added to the layer
    """
    # Update Properties based on Specs. Try to Parse the Specs.
    for prop in specs:
      if isinstance(specs[prop], dict):
        self.properties[prop] = specs[prop]['class_name']
      else:
        self.properties[prop] = specs[prop]


  def add_input_names(self, nodes):
    """Adds all the Names of the Input Nodes to the Layer.

    Arguments:
        nodes {list} -- all nodes that are inputs to the layer
    """
    for node in nodes[0]:
      self.input_names.append(node[0])

  # String Representation of the Layer.
  def __repr__(self):
    return "%s(properties: %r)" % (self.__class__, self.properties)
