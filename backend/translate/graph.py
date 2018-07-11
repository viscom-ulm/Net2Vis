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

    # Add a new Layer to the Graph.
    def add_layer(self, layer):
        self.layers.append(layer)
    
    # Return the Graph representation.
    def __repr__(self):
        str = ''
        for i in range(len(self.layers)):
            str = str + type(self.layers[i]).__name__
            if(i != (len(self.layers)-1)):
                str = str + ' -> '
        return str

    # Build a tree-structure based on the Layers
    def build_tree(self):
        # TODO: Implement
        return

    # Find Repeating Patterns in the Graph
    def find_repetitions(self):
        # TODO: Implement
        return

    # Generate references between the Layers based on the Input names.
    def resolve_input_names(self):
        for i in range(len(self.layers)):
            for name in self.layers[i].input_names:
                for j in range(len(self.layers)):
                    if(self.layers[j].name == name):
                        self.layers[i].input.append(self.layers[j])
                        self.layers[j].output.append(self.layers[i])

    # Calculates the dimensions for each Layer based on an input dimension.
    def calculate_layer_dimensions(self, input_dim):
        input_dim = {
            'in': input_dim,
            'out': input_dim
        }   
        for layer in self.layers: # Calculate for all Layers.
            if not layer.dimensions: # Only if no Dimension was set.
                layer.calculate_dimensions_recursive(input_dim)

    # Return the Layer Dimensions as Pretty String.
    def dimensions_str(self):
        dim = ''
        for i in range(len(self.layers)):
            dim = dim + str(self.layers[i].dimensions)
            if(i != (len(self.layers)-1)):
                dim = dim + ' -> '
        return dim

    def dimensions(self):
        dim = []
        for i in range(len(self.layers)):
            dim.append(self.layers[i].dimensions)
        return dim
