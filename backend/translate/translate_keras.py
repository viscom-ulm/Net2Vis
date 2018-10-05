import json
from graph import Graph
import layers_representations
import sys
import traceback

# Called to translate Keras JSON Representation.
def translate_keras(filename):
    graph = Graph()
    with open(filename, 'r') as myfile:
        keras_code=myfile.read()
        try:
            exec(keras_code, globals())
            model = get_model()
            model_json = json.loads(model.to_json())
            print(model_json)
            layers_extracted = model_json['config']['layers']
            graph.set_input_shape(layers_extracted[0]['config']['batch_input_shape'][1:])
            for layer in layers_extracted:
                add_layer_type(layer, graph)
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
def add_layer_type(layer, graph):
    if('Dense' in layer['class_name']): # Dense Layer.
        new_layer = layers_representations.Dense(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif('Conv2D' in layer['class_name']): # Convolution Layer 2D.
        new_layer = layers_representations.Conv2D(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif('MaxPooling2D' in layer['class_name']): # Max-Pooling Layer 2D.
        new_layer = layers_representations.MaxPool2D(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('Dropout' in layer['class_name']): # Dropout Layer.
        new_layer = layers_representations.Dropout(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('Flatten' in layer['class_name']):
        new_layer = layers_representations.Flatten(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('Activation' in layer['class_name']): # Activation Layer.
        new_layer = layers_representations.Activation(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('LeakyReLU' in layer['class_name']): # LeakyReLU Layer.
        new_layer = layers_representations.LeakyReLU(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('BatchNormalization' in layer['class_name']): # BatchNormalization Layer.
        new_layer = layers_representations.BatchNormalization(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('Add' in layer['class_name']): # Add Layer.
        new_layer = layers_representations.Add(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('Concatenate' in layer['class_name']): # Concatenation Layer.
        new_layer = layers_representations.Concatenate(layer['name'])
        add_to_graph(new_layer, layer, graph)
    elif ('UpSampling2D' in layer['class_name']): # UpSampling Layer.
        new_layer = layers_representations.UpSampling2D(layer['name'])
        add_to_graph(new_layer, layer, graph)

# Takes a new layer, adds the Properties and then adds the Layer to the Graph.
def add_to_graph(new_layer, layer, graph):
    new_layer.add_specs(layer['config'])
    new_layer.add_input_names(layer['inbound_nodes'])
    graph.add_layer(new_layer)
