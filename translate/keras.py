from graph import Graph
import layers

def translate_keras(content):
    graph = Graph()
    for line in content:
        if('.add(' in line):
            check_sequential(line, graph)
        elif (' = ' in line):
            check_functional(line, graph)
    for layer in graph.layers:
        print(layer)


def check_sequential(line, graph):
    name = line.split('.add(')[1]
    name = name.split('(')
    spec = name[1]
    name = name[0].strip().lower()
    add_layer_type(name, spec, graph)


def check_functional(line, graph):
    name = line.split('=')[1]
    name = name.split('(')[0]
    spec = name.split('(')[1]
    spec = spec.split(')')[0]
    name = name.strip().lower()
    add_layer_type(name, spec, graph)


def add_layer_type(name, spec, graph):
    if('dense' in name):
        specs = spec.split(',')
        layer = layers.Dense(specs[0])
        graph.add_layer(layer)
    elif('conv2d' in name):
        pass
    elif('maxpooling2d' in name):
        pass
    elif ('dropout' in name):
        pass
    elif ('flatten' in name):
        pass
