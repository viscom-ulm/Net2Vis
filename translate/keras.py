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
    properties = line.split('.add(')[1]
    name = properties.split('(')[0]
    spec = properties.replace(name, '').strip('(')
    name = name.strip().lower()
    add_layer_type(name, spec, graph)


def check_functional(line, graph):
    name = line.split('=')[1]
    spec = name.split('(')[1]
    spec = spec.split(')')[0]
    name = name.split('(')[0]
    name = name.strip().lower()
    add_layer_type(name, spec, graph)


def add_layer_type(name, spec, graph):
    if('dense' in name):
        specs = split_specs(spec)
        layer = layers.Dense(specs[0])
        layer.add_specs(specs[1:])
        graph.add_layer(layer)
    elif('conv2d' in name):
        specs = split_specs(spec)
        layer = layers.Conv2D(specs[0], specs[1])
        layer.add_specs(specs[2:])
        graph.add_layer(layer)
    elif('maxpooling2d' in name):
        pass
    elif ('dropout' in name):
        pass
    elif ('flatten' in name):
        pass
    elif ('activation' in name):
        specs = split_specs(spec)
        graph.layers[-1].properties['activation'] = specs[0]


def split_specs(spec):
    specs = []
    current = ''
    level = 0
    for letter in spec:
        if(letter == '('):
            current = current + letter
            level = level+1
        elif(letter == ')'):
            if(level>0):
                current = current + letter
            level = level-1
        elif(letter == ','):
            if(level == 0):
                specs.append(current)
                current = ''
            else:
                current = current + letter
        elif(letter == ' '):
            pass
        elif(letter == '\''):
            pass
        elif(letter == '"'):
            pass
        else:
            current = current + letter
    specs.append(current)
    return specs