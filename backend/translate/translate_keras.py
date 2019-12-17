import json
from graph import Graph
import layer
import sys
import traceback

# Called to translate Keras JSON Representation.
def translate_keras(filename):
    graph = Graph()
    with open(filename, 'r') as myfile:
        keras_code = myfile.read()
        try:
            exec(keras_code, globals())
            model = get_model()
            model_json = json.loads(model.to_json())
            layers_extracted = model_json['config']['layers']
            graph.set_input_shape(layers_extracted[0]['config']['batch_input_shape'][1:])
            previousNode = ''
            for i in range(len(layers_extracted)):
                previousNode = add_layer_type(layers_extracted[i], model.layers[i], graph, previousNode)
            graph.resolve_input_names()
            return graph
        except SyntaxError as err:
            print('Syntax Error')
            print(err)
            return {'error_class': err.__class__.__name__, 'line_number': err.lineno, 'detail': err.args[0]}
        except Exception as err:
            print('Exception')
            print(err)
            cl, exc, tb = sys.exc_info()
            ln = traceback.extract_tb(tb)[-1][1]
            return {'error_class': err.__class__.__name__, 'line_number': ln, 'detail': err.args[0]}
 

# Add a Layer for the line. Layers are identified by their name and equipped using the spec.
def add_layer_type(layer_json, model_layer, graph, previousNode):
    new_layer = layer.Layer(layer_json['class_name'], layer_json['config']['name'], model_layer)
    new_layer.add_specs(layer_json['config'])
    return add_to_graph(new_layer, layer_json, graph, previousNode)


# Takes a new layer, adds the Properties and then adds the Layer to the Graph.
def add_to_graph(new_layer, model_layer, graph, previousNode):
    try:
        new_layer.add_input_names(model_layer['inbound_nodes'])
    except Exception as err: 
        if (previousNode != ''):
            new_layer.add_input_names([[[previousNode, 0, 0, {}]]])
    graph.add_layer(new_layer)
    return new_layer.name
