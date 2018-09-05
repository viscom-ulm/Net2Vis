from flask import Flask, send_file, request, jsonify
import copy
import sys
import inspect

sys.path.append('translate')
from translate_keras import translate_keras
from graph import Graph

app = Flask(__name__)
ok_status = 200
json_type = {'ContentType': 'application/json'}
text_type = {'ContentType': 'text/plain'}

##################
# Helper Functions 
##################
# Convert the Network to be sendable in JSON.
def make_jsonifyable(network):
    net = copy.deepcopy(network)
    replace_references(net)
    processed = []
    for i in range(len(net.layers)):
        layer = net.layers[i]
        lay = layer.__dict__
        dict = {
            'name': type(layer).__name__,
            'id': i,
            'properties': lay
        }
        processed.append(dict)
    return processed

# Replace the References to other objects with indices.
def replace_references(net):
    for layer in net.layers:
        inp = []
        outp = []
        for input in layer.input:
            for i in range(len(net.layers)):
                if(net.layers[i] == input):
                    inp.append(i)
        layer.input = inp
        for output in layer.output:
            for i in range(len(net.layers)):
                if(net.layers[i] == output):
                    outp.append(i)
        layer.output = outp

###############
# Basic Serving 
###############
# Get the Network.
@app.route('/api/get_network')
def get_network():
    graph = translate_keras('current/model_current.py')
    if(isinstance(graph, Graph)):
        graph.calculate_layer_dimensions([32,32,3]) # TODO: Remove this hardcoded part!
        net = {'layers': make_jsonifyable(graph)}
        result = jsonify({'success': True, 'data': net})
        return  result, ok_status, json_type
    else:
        result = jsonify({'success': False, 'data': graph})
        return  result, ok_status, json_type
    
# Get the Code.
@app.route('/api/get_code')
def get_code():
    with open('current/model_current.py', 'r') as myfile:# Get the input File.
        keras_code=myfile.read()
        return keras_code, ok_status, text_type

@app.route('/api/update_code', methods=['POST'])
def update_code():
    content = request.data
    file = open('current/model_current.py','w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type

app.run(debug=True)
