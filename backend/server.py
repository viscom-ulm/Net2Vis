from flask import Flask, send_file, request, jsonify
import copy
import sys

sys.path.append('translate')
from translate_keras import translate_keras

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
    file_input = open('examples/keras/cifar', 'r') # Get the input File.
    content = file_input.readlines() # Read the Input File
    content = [x.strip() for x in content] # Strip the input File Lines.
    net = {'layers': make_jsonifyable(translate_keras(content))}
    result = jsonify({'success': True, 'data': net})
    return  result, ok_status, json_type

# Get the Code.
@app.route('/api/get_code')
def get_code():
    file_input = open('examples/keras/cifar', 'r') # Get the input File.
    content = file_input.readlines() # Read the Input File
    content = [x.strip() for x in content] # Strip the input File Lines.
    content = "\n".join(content)
    return content, ok_status, text_type

app.run(debug=True)
