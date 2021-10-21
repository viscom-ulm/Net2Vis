import onnx
from onnx import shape_inference
from translate.graph import Graph
import translate.layer as layer


def translate_onnx(file):
    """Get a graph from an external file defining the neural network.
    Arguments:
        file {Path} -- the path to the onnx file to be translated
    Returns:
        object -- the result of this translation, can be an error
    """
    onnx_model = onnx.load(file)
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
