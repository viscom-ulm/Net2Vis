"""Used to handle layers as objects."""


class Layer:
    """Representation of Layers."""
    # Initialize the Properties.

    def __init__(self, class_name, name, dimensions):
        self.properties = {}
        self.input = []
        self.input_names = []
        self.output = []
        self.name = name
        self.type = class_name
        self.dimensions = dimensions

    @classmethod
    def from_keras(cls, class_name, name, layer):
        dimensions = {
            'in': 0,
            'out': layer.get_output_at(0).get_shape().as_list()[1:]
        }
        if isinstance(layer.get_input_at(0), list):
            dimensions['in'] = layer.get_input_at(
                0)[0].get_shape().as_list()[1:]
        else:
            dimensions['in'] = layer.get_input_at(0).get_shape().as_list()[1:]
        if isinstance(layer.get_output_at(0), list):
            dimensions['out'] = layer.get_output_at(
                0)[0].get_shape().as_list()[1:]
        else:
            dimensions['out'] = layer.get_output_at(
                0).get_shape().as_list()[1:]
        return cls(class_name, name, dimensions)

    @classmethod
    def from_onnx(cls, layer, onnx_graph):
        dimensions = {
            'in': 0,
            'out': 0
        }
        if len(layer.input) > 0:
            for value_info in onnx_graph.value_info:
                if (layer.input[0] == value_info.name):
                    dimensions['in'] = list(
                        map(lambda x: x.dim_value, value_info.type.tensor_type.shape.dim[1:]))
                if (layer.output[0] == value_info.name):
                    dimensions['out'] = list(
                        map(lambda x: x.dim_value, value_info.type.tensor_type.shape.dim[1:]))
            for value_info in onnx_graph.input:
                if (layer.input[0] == value_info.name):
                    dimensions['in'] = list(
                        map(lambda x: x.dim_value, value_info.type.tensor_type.shape.dim[1:]))
            for value_info in onnx_graph.output:
                if (layer.output[0] == value_info.name):
                    dimensions['out'] = list(
                        map(lambda x: x.dim_value, value_info.type.tensor_type.shape.dim[1:]))
        return cls(layer.op_type, layer.name, dimensions)

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

    def add_input_names_from_node(self, nodes):
        """Adds all the Names of the Input Nodes to the Layer.
        Arguments:
            nodes {list} -- all nodes that are inputs to the layer
        """
        if (len(nodes) > 0):
            for node in nodes[0]:
                self.input_names.append(node[0])

    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)
