from flask import Flask, send_file, request, jsonify
import copy
import sys
import inspect
import json
import os
from shutil import copyfile
import cairosvg
import zipfile

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
  replace_references(network)
  processed = []
  for i in range(len(network.layers)):
    layer = network.layers[i]
    lay = layer.__dict__
    dict = {
      'name': layer.type,
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

# Check if the desired model already exists.
def check_exists(id):
  if(not os.path.exists(os.path.join('models', id))):
    os.mkdir(os.path.join('models', id))
    os.mkdir(os.path.join('models', id, 'visualizations'))
    copyfile(os.path.join('default', 'model_current.py'), os.path.join('models', id, 'model_current.py'))
    copyfile(os.path.join('default', 'layer_types_current.json'), os.path.join('models', id, 'layer_types_current.json'))
    copyfile(os.path.join('default', 'preferences.json'), os.path.join('models', id, 'preferences.json'))
    copyfile(os.path.join('default', 'groups.json'), os.path.join('models', id, 'groups.json'))
    copyfile(os.path.join('default', 'legend_preferences.json'), os.path.join('models', id, 'legend_preferences.json'))

# Zip a folder.
def zipdir(path, ziph):
    # ziph is zipfile handle
    for root, dirs, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file))

###############
# Basic Serving 
###############
# Get the Network.
@app.route('/api/get_network/<id>')
def get_network(id):
  check_exists(id)
  graph = translate_keras(os.path.join('models', id, 'model_current.py'))
  if(isinstance(graph, Graph)):
    graph.calculate_layer_dimensions()
    net = {'layers': make_jsonifyable(graph)}
    result = jsonify({'success': True, 'data': net})
    return  result, ok_status, json_type
  else:
    result = jsonify({'success': False, 'data': graph})
    return  result, ok_status, json_type
    
# Get the Code.
@app.route('/api/get_code/<id>')
def get_code(id):
  check_exists(id)
  with open(os.path.join('models', id, 'model_current.py'), 'r') as myfile:# Get the input File.
    keras_code=myfile.read()
    return keras_code, ok_status, text_type

# Update the Code.
@app.route('/api/update_code/<id>', methods=['POST'])
def update_code(id):
  check_exists(id)
  content = request.data
  file = open(os.path.join('models', id, 'model_current.py'),'w')
  file.write(content.decode("utf-8"))
  return content, ok_status, text_type

# Get the Layer_Types.
@app.route('/api/get_layer_types/<id>')
def get_layer_types(id):
  check_exists(id)
  with open(os.path.join('models', id, 'layer_types_current.json'), 'r') as myfile:
    layer_types = myfile.read()
    return layer_types, ok_status, text_type

# Update the Layer_Types.
@app.route('/api/update_layer_types/<id>', methods=['POST'])
def update_layer_types(id):
  check_exists(id)
  content = request.data
  file = open(os.path.join('models', id, 'layer_types_current.json'),'w')
  file.write(content.decode("utf-8"))
  return content, ok_status, text_type

# Get the Preferences.
@app.route('/api/get_preferences/<id>')
def get_preferences(id):
  check_exists(id)
  with open(os.path.join('models', id, 'preferences.json'), 'r') as myfile:
    preferences = myfile.read()
    return preferences, ok_status, text_type

# Update the Preferences.
@app.route('/api/update_preferences/<id>', methods=['POST'])
def update_preferences(id):
  check_exists(id)
  content = request.data
  file = open(os.path.join('models', id, 'preferences.json'),'w')
  file.write(content.decode("utf-8"))
  return content, ok_status, text_type

# Get the Groups.
@app.route('/api/get_groups/<id>')
def get_groups(id):
  check_exists(id)
  with open(os.path.join('models', id, 'groups.json'), 'r') as myfile:
    groups = myfile.read()
    return groups, ok_status, text_type

# Update the Groups.
@app.route('/api/update_groups/<id>', methods=['POST'])
def update_groups(id):
  check_exists(id)
  content = request.data
  file = open(os.path.join('models', id, 'groups.json'),'w')
  file.write(content.decode("utf-8"))
  return content, ok_status, text_type

# Get the Preferences.
@app.route('/api/get_legend_preferences/<id>')
def get_legend_preferences(id):
  check_exists(id)
  with open(os.path.join('models', id, 'legend_preferences.json'), 'r') as myfile:
    preferences = myfile.read()
    return preferences, ok_status, text_type

# Update the Preferences.
@app.route('/api/update_legend_preferences/<id>', methods=['POST'])
def update_legend_preferences(id):
  check_exists(id)
  content = request.data
  file = open(os.path.join('models', id, 'legend_preferences.json'),'w')
  file.write(content.decode("utf-8"))
  return content, ok_status, text_type

# Pack and transform the visualization
@app.route('/api/process_vis/<id>', methods=['POST'])
def process_vis(id):
  check_exists(id)
  content = request.data
  json_content = json.loads(content)
  base_path = os.path.join('models', id, 'visualizations')
  file = open(os.path.join(base_path, 'graph.svg'),'w')
  file.write(json_content['graph'])
  file.flush()
  cairosvg.svg2pdf(url=os.path.join(base_path, 'graph.svg'), write_to=os.path.join(base_path, 'graph.pdf'))
  file = open(os.path.join(base_path, 'legend.svg'),'w')
  file.write(json_content['legend'])
  file.flush()
  cairosvg.svg2pdf(url=os.path.join(base_path, 'legend.svg'), write_to=os.path.join(base_path, 'legend.pdf'))
  zipf = zipfile.ZipFile(os.path.join('models', id, 'visualizations.zip'), 'w', zipfile.ZIP_DEFLATED)
  zipdir(base_path, zipf)
  zipf.close()
  return send_file(os.path.join('models', id, 'visualizations.zip'),
    mimetype='zip',
    attachment_filename='visualizations.zip',
    as_attachment=True)

app.run(debug=True)
