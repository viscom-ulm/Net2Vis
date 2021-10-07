"""Translates PyTorch code so it can be used within the application."""
import json
import epicbox
import torch.nn as nn
import onnx
from onnx import shape_inference
from translate.graph import Graph
import translate.layer as layer
from google.protobuf.json_format import Parse


def translate_torch(filename):
    """Translate a torch model defined in a file into the neural network graph.

    Arguments:
        filename {String} -- name of the file to be translated

    Returns:
        object -- the result of this translation, can be an error
    """
    epicbox.configure(profiles=[
        epicbox.Profile('python', 'torch:latest')])
    general_reader = open('translate/torch_loader.txt', 'rb')
    general_code = general_reader.read()
    with open(filename, 'rb') as myfile:
        torch_code = myfile.read()
        try:
            return graph_from_external_file(torch_code, general_code)
        except Exception as err:
            return {'error_class': '', 'line_number': 1,
                    'detail': str(err)}


def graph_from_external_file(torch_code, general_code):
    """Get a graph from an external file defining the neural network.

    Arguments:
        torch_code {String} -- the torch code defining the network
        general_code {String} -- the torch code used to load the network

    Returns:
        object -- the result of this translation, can be an error
    """
    files = [
        {'name': 'model.py', 'content': torch_code},
        {'name': 'main.py', 'content': general_code}
    ]
    limits = {'cputime': 100, 'memory': 2000}
    result = epicbox.run('python', 'python3 main.py',
                         files=files, limits=limits)
    if b'Traceback' in result["stderr"]:
        raise Exception(result["stderr"].decode('utf-8'))
    translate_result = result['stdout']
    onnx_model = Parse(translate_result, onnx.ModelProto())
    onnx_model = shape_inference.infer_shapes(onnx_model)
    graph = Graph()
    previous_node = ''
    for index, node in enumerate(onnx_model.graph.node):
        if index >= 0:
            add_layer_type(node, graph, previous_node, onnx_model.graph)
    graph.resolve_input_names()
    return graph


def add_layer_type(node, graph, previous_node, onnx_graph):
    """Add a Layer. Layers are identified by name and equipped using the spec.

    Arguments:
        node {onnx.Node} -- the node that represents the layer
        graph {object} -- neural network graph
        previous_node {String} -- name of the node before this one
        onnx_graph {onnx.Graph} -- the graph that represents this network

    Returns:
        String -- name of the new layer
    """
    new_layer = layer.Layer.from_onnx(node, onnx_graph)
    add_specs_onnx(new_layer, node.attribute)
    return add_to_graph(new_layer, node, onnx_graph, graph, previous_node)


def add_to_graph(new_layer, node, onnx_graph, graph, previous_node):
    """Takes new layer, adds the Properties and then adds the Layer to the Graph.

    Arguments:
        new_layer {object} -- the layer to be added to the graph
        model_layer {dict} -- json dict of the layer props
        graph {object} -- the neural network graph
        previous_node {String} -- name of the previous layer

    Returns:
        String -- name of the new layer
    """
    for input in node.input:
        for graph_node in onnx_graph.node:
            for output in graph_node.output:
                if (input == output):
                    new_layer.input_names.append(graph_node.name)
    graph.add_layer(new_layer)
    return new_layer.name


def add_specs_onnx(new_layer, attributes):
    for attribute in attributes:
        if (attribute.type == onnx.AttributeProto.AttributeType.FLOAT):
            new_layer.properties[attribute.name] = attribute.f
        elif (attribute.type == onnx.AttributeProto.AttributeType.FLOATS):
            new_layer.properties[attribute.name] = str(attribute.floats)
        elif (attribute.type == onnx.AttributeProto.AttributeType.INT):
            new_layer.properties[attribute.name] = attribute.i
        elif (attribute.type == onnx.AttributeProto.AttributeType.INTS):
            new_layer.properties[attribute.name] = str(attribute.ints)
        else:
            print(attribute.type, 'not supported yet.')
