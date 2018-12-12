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
            layers_extracted = model_json['config']['layers']
            graph.set_input_shape(layers_extracted[0]['config']['batch_input_shape'][1:])
            previousNode = ''
            for layer in layers_extracted:
                previousNode = add_layer_type(layer, graph, previousNode)
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
def add_layer_type(layer, graph, previousNode):
    if('Dense' in layer['class_name']): # Dense Layer.
        new_layer = layers_representations.Dense(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif('Conv2D' in layer['class_name']): # Convolution Layer 2D.
        new_layer = layers_representations.Conv2D(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif('MaxPooling2D' in layer['class_name']): # Max-Pooling Layer 2D.
        new_layer = layers_representations.MaxPool2D(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('Dropout' in layer['class_name']): # Dropout Layer.
        new_layer = layers_representations.Dropout(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('Flatten' in layer['class_name']):
        new_layer = layers_representations.Flatten(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('Activation' in layer['class_name']): # Activation Layer.
        new_layer = layers_representations.Activation(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('LeakyReLU' in layer['class_name']): # LeakyReLU Layer.
        new_layer = layers_representations.LeakyReLU(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('BatchNormalization' in layer['class_name']): # BatchNormalization Layer.
        new_layer = layers_representations.BatchNormalization(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('Add' in layer['class_name']): # Add Layer.
        new_layer = layers_representations.Add(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('Concatenate' in layer['class_name']): # Concatenation Layer.
        new_layer = layers_representations.Concatenate(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif ('UpSampling2D' in layer['class_name']): # UpSampling Layer.
        new_layer = layers_representations.UpSampling2D(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)
    elif('Conv3D' in layer['class_name']): # Convolution Layer 3D.
        new_layer = layers_representations.Conv3D(layer['config']['name'])
        return add_to_graph(new_layer, layer, graph, previousNode)

# Takes a new layer, adds the Properties and then adds the Layer to the Graph.
def add_to_graph(new_layer, layer, graph, previousNode):
    new_layer.add_specs(layer['config'])
    try:
        new_layer.add_input_names(layer['inbound_nodes'])
    except Exception as err: 
        if (previousNode != ''):
            new_layer.add_input_names([[[previousNode, 0, 0, {}]]])
    graph.add_layer(new_layer)
    return new_layer.name
