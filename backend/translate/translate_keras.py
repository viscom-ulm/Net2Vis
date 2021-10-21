"""Translates Keras code so it can be used within the application."""
import json
import epicbox
from tensorflow import keras
from translate.graph import Graph
import translate.layer as layer

keras_ext = '.h5'


def translate_keras(filename):
    """Translate a keras model defined in a file into the neural network graph.

    Arguments:
        filename {String} -- name of the file to be translated

    Returns:
        object -- the result of this translation, can be an error
    """
    if keras_ext in filename:
        try:
            return graph_from_model_file(filename)
        except Exception as err:
            return {'error_class': '', 'line_number': 1,
                    'detail': "Model could not be loaded correctly. Error: " + str(err)}
    else:
        epicbox.configure(profiles=[
            epicbox.Profile('python', 'tf_plus_keras:latest')])
        general_reader = open('translate/keras_loader.txt', 'rb')
        general_code = general_reader.read()
        with open(filename, 'rb') as myfile:
            keras_code = myfile.read()
            try:
                return graph_from_external_file(keras_code, general_code)
            except Exception as err:
                return {'error_class': '', 'line_number': 1,
                        'detail': str(err)}


def graph_from_external_file(keras_code, general_code):
    """Get a graph from an external file defining the neural network.

    Arguments:
        keras_code {String} -- the keras code defining the network
        general_code {String} -- the keras code used to load the network

    Returns:
        object -- the result of this translation, can be an error
    """
    files = [
        {'name': 'model.py', 'content': keras_code},
        {'name': 'main.py', 'content': general_code}
    ]
    limits = {'cputime': 100, 'memory': 2000}
    result = epicbox.run('python', 'python3 main.py',
                         files=files, limits=limits)
    if b'Traceback' in result["stderr"]:
        raise Exception(result["stderr"].decode('utf-8'))
    model_json = json.loads(result["stdout"])
    model_keras = keras.models.model_from_json(result["stdout"])
    layers_extracted = model_json['config']['layers']
    graph = Graph()
    previous_node = ''
    for index, json_layer in enumerate(layers_extracted):
        if len(layers_extracted) > len(model_keras.layers):
            index = index - 1
        if index >= 0:
            previous_node = add_layer_type(json_layer, model_keras.layers[index], graph,
                                           previous_node)
    graph.resolve_input_names()
    return graph


def graph_from_model_file(keras_model_file):
    model_keras = keras.models.load_model(keras_model_file)
    model_json = json.loads(model_keras.to_json())
    layers_extracted = model_json['config']['layers']
    graph = Graph()
    previous_node = ''
    for index, json_layer in enumerate(layers_extracted):
        if len(layers_extracted) > len(model_keras.layers):
            index = index - 1
        if index >= 0:
            previous_node = add_layer_type(json_layer, model_keras.layers[index], graph,
                                           previous_node)
    graph.resolve_input_names()
    return graph


def add_layer_type(layer_json, model_layer, graph, previous_node):
    """Add a Layer. Layers are identified by name and equipped using the spec.

    Arguments:
        layer_json {dict} -- json representation of the layer
        model_layer {object} -- tensorflow model representation of the layer
        graph {object} -- neural network graph
        previous_node {String} -- name of the node before this one

    Returns:
        String -- name of the new layer
    """
    new_layer = layer.Layer.from_keras(layer_json['class_name'],
                                       layer_json['config']['name'], model_layer)
    new_layer.add_specs(layer_json['config'])
    return add_to_graph(new_layer, layer_json, graph, previous_node)


def add_to_graph(new_layer, model_layer, graph, previous_node):
    """Takes new layer, adds the Properties and then adds the Layer to the Graph.

    Arguments:
        new_layer {object} -- the layer to be added to the graph
        model_layer {dict} -- json dict of the layer props
        graph {object} -- the neural network graph
        previous_node {String} -- name of the previous layer

    Returns:
        String -- name of the new layer
    """
    try:
        new_layer.add_input_names_from_node(model_layer['inbound_nodes'])
    except Exception:
        if previous_node != '':
            new_layer.add_input_names_from_node([[[previous_node, 0, 0, {}]]])
    graph.add_layer(new_layer)
    return new_layer.name
