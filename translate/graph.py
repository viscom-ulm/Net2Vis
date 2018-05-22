# Representation of the Graph that gets extracted from Code.
class Graph:
    layers = []

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
