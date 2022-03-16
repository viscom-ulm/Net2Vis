"""Server that handles all the requests for Net2Vis frontend."""
import os
import json
import zipfile
from datetime import datetime
from shutil import copyfile
import cairosvg
from flask import Flask, send_file, request, jsonify
from translate.translate_keras import translate_keras
from translate.translate_onnx import translate_onnx
from translate.graph import Graph

app = Flask(__name__)
app.config['UPLOAD_EXTENSIONS'] = ['.h5', '.onnx']
app.config['UPLOAD_PATH'] = 'models'
ok_status = 200
error_status = 400
json_type = {'ContentType': 'application/json'}
text_type = {'ContentType': 'text/plain'}

##################
# Helper Functions
##################


def make_jsonifyable(network):
    """Convert the Network to be sendable in JSON.

    Arguments:
        network {object} -- the network description to be converted

    Returns:
        object -- json description of the network
    """
    replace_references(network)
    processed = []
    for i in range(len(network.layers)):
        layer = network.layers[i]
        lay = layer.__dict__
        layer_dict = {
            'name': layer.type,
            'id': i,
            'properties': lay
        }
        processed.append(layer_dict)
    return processed


def replace_references(net):
    """Replace the References to other objects with indices.

    Arguments:
        net {object} -- the network for which references are to be replaced
    """
    for layer in net.layers:
        inp = []
        outp = []
        for layer_input in layer.input:
            for i in range(len(net.layers)):
                if net.layers[i] == layer_input:
                    inp.append(i)
        layer.input = inp
        for output in layer.output:
            for i in range(len(net.layers)):
                if net.layers[i] == output:
                    outp.append(i)
        layer.output = outp


def check_upload_path_exists(identifier):
    """Check if the desired model already exists.

    Arguments:
        identifier {String} -- the id of the network currently requested
    """
    if not os.path.exists(app.config['UPLOAD_PATH']):
        os.mkdir(app.config['UPLOAD_PATH'])
    if not os.path.exists(os.path.join(app.config['UPLOAD_PATH'], identifier)):
        create_directory(app.config['UPLOAD_PATH'], identifier)


def create_directory(base_path, identifier):
    """Create a directory for a model if it does not exist.

    Arguments:
        base_path {String} -- the path the model is to be placed at
        identifier {String} -- the id of the network currently requested
    """
    os.mkdir(os.path.join(base_path, identifier))
    os.mkdir(os.path.join(base_path, identifier, 'visualizations'))
    copyfile(os.path.join('default', 'model_current.py'),
             os.path.join(base_path, identifier, 'model_current.py'))
    copyfile(os.path.join('default', 'layer_types_current.json'),
             os.path.join(base_path, identifier, 'layer_types_current.json'))
    copyfile(os.path.join('default', 'preferences.json'),
             os.path.join(base_path, identifier, 'preferences.json'))
    copyfile(os.path.join('default', 'groups.json'),
             os.path.join(base_path, identifier, 'groups.json'))
    copyfile(os.path.join('default', 'legend_preferences.json'),
             os.path.join(base_path, identifier, 'legend_preferences.json'))


def zipdir(path, ziph):
    """Zip a folder.

    Arguments:
        path {String} -- Path to the folder to be zipped
        ziph {object} -- Zip file handle to be used for this process
    """
    for root, _, files in os.walk(path):
        for file in files:
            ziph.write(os.path.join(root, file), arcname=file)


def save_and_convert_svgs(base_path, json_content):
    """Save and convert the svg files into PDFs

    Arguments:
        base_path {String} -- The base path for this operation to be executed at
        json_content {object} -- The json content of the network
    """
    file = open(os.path.join(base_path, 'graph.svg'), 'w')
    file.write(json_content['graph'])
    file.flush()
    file.close()
    cairosvg.svg2pdf(url=os.path.join(base_path, 'graph.svg'),
                     write_to=os.path.join(base_path, 'graph.pdf'))
    file = open(os.path.join(base_path, 'legend.svg'), 'w')
    file.write(json_content['legend'])
    file.flush()
    file.close()
    cairosvg.svg2pdf(url=os.path.join(base_path, 'legend.svg'),
                     write_to=os.path.join(base_path, 'legend.pdf'))


def backup_download_content(identifier):
    """Backup the content that is downloaded for use in the paper.

    Arguments:
        identifier {String} -- The identifier for this network
    """
    date_time = datetime.now()
    base_location = os.path.join(app.config['UPLOAD_PATH'], identifier)
    save_location = os.path.join(
        base_location, date_time.strftime('%Y%m%d%H%M%S'))
    if not os.path.exists(save_location):
        os.mkdir(save_location)
        copyfile(os.path.join(base_location, 'model_current.py'),
                 os.path.join(save_location, 'model_current.py'))
        copyfile(os.path.join(base_location, 'visualizations.zip'),
                 os.path.join(save_location, 'visualizations.zip'))


###############
# Basic Serving
###############


@app.route('/api/get_network/<identifier>')
def get_network(identifier):
    """Get the Network.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the network as json
    """
    if os.path.exists(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model.h5')):
        graph = translate_keras(os.path.join(
            app.config['UPLOAD_PATH'], identifier, 'model.h5'))
    elif os.path.exists(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model.onnx')):
        graph = translate_onnx(os.path.join(
            app.config['UPLOAD_PATH'], identifier, 'model.onnx'))
    else:
        graph = translate_keras(os.path.join(
            app.config['UPLOAD_PATH'], identifier, 'model_current.py'))
    if isinstance(graph, Graph):
        net = {'layers': make_jsonifyable(graph)}
        result = jsonify({'success': True, 'data': net})
    else:
        result = jsonify({'success': False, 'data': graph})
    return result, ok_status, json_type


@app.route('/api/get_code/<identifier>')
def get_code(identifier):
    """Get the Code.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the code for the network
    """
    check_upload_path_exists(identifier)
    if not (os.path.exists(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model.h5')) or os.path.exists(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model.onnx'))):
        with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model_current.py'), 'r') as myfile:
            keras_code = myfile.read()
            return keras_code, ok_status, text_type
    return "No code loaded since model file is present.", ok_status, text_type


@app.route('/api/update_code/<identifier>', methods=['POST'])
def update_code(identifier):
    """Update the Code.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling the change worked
    """
    check_upload_path_exists(identifier)
    content = request.data
    file = open(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'model_current.py'), 'w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type


@app.route('/api/upload_model/<identifier>', methods=['POST'])
def upload_model(identifier):
    """Upload a model file.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling the change worked
    """
    check_upload_path_exists(identifier)
    uploaded_file = request.files['model']
    filename = uploaded_file.filename
    file_ext = os.path.splitext(filename)[1]
    if file_ext not in app.config['UPLOAD_EXTENSIONS']:
        return "", error_status, text_type
    file_path = os.path.join(app.config['UPLOAD_PATH'], identifier, f'model{file_ext}')
    uploaded_file.save(file_path)
    return "No code loaded since model file is present.", ok_status, text_type


@app.route('/api/delete_model/<identifier>')
def delete_model(identifier):
    """Delete the model file.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling the change worked
    """
    check_upload_path_exists(identifier)
    keras_model_path = os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'model.h5')
    onnx_model_path = os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'model.onnx')
    if (os.path.exists(keras_model_path)):
        os.remove(keras_model_path)
    if (os.path.exists(onnx_model_path)):
        os.remove(onnx_model_path)
    with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'model_current.py'), 'r') as myfile:
        keras_code = myfile.read()
        return keras_code, ok_status, text_type


@app.route('/api/get_layer_types/<identifier>')
def get_layer_types(identifier):
    """Get the Layer_Types.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the layer types in the model
    """
    check_upload_path_exists(identifier)
    with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'layer_types_current.json'), 'r') as myfile:
        layer_types = myfile.read()
        return layer_types, ok_status, text_type


@app.route('/api/update_layer_types/<identifier>', methods=['POST'])
def update_layer_types(identifier):
    """Update the Layer_Types.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling if the change was successful
    """
    check_upload_path_exists(identifier)
    content = request.data
    file = open(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'layer_types_current.json'), 'w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type


@app.route('/api/get_preferences/<identifier>')
def get_preferences(identifier):
    """Get the Preferences.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the visualization preferences
    """
    check_upload_path_exists(identifier)
    with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'preferences.json'), 'r') as myfile:
        preferences = myfile.read()
        return preferences, ok_status, text_type


@app.route('/api/update_preferences/<identifier>', methods=['POST'])
def update_preferences(identifier):
    """Update the Preferences.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling if the change was successful
    """
    check_upload_path_exists(identifier)
    content = request.data
    file = open(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'preferences.json'), 'w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type


@app.route('/api/get_groups/<identifier>')
def get_groups(identifier):
    """Get the Groups.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the groups for the model
    """
    check_upload_path_exists(identifier)
    with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'groups.json'), 'r') as myfile:
        groups = myfile.read()
        return groups, ok_status, text_type


@app.route('/api/update_groups/<identifier>', methods=['POST'])
def update_groups(identifier):
    """Update the Groups.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling if the change was successful
    """
    check_upload_path_exists(identifier)
    content = request.data
    file = open(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'groups.json'), 'w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type


@app.route('/api/get_legend_preferences/<identifier>')
def get_legend_preferences(identifier):
    """Get the Preferences.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the legend preferences for the model
    """
    check_upload_path_exists(identifier)
    with open(os.path.join(app.config['UPLOAD_PATH'], identifier, 'legend_preferences.json'), 'r') as myfile:
        preferences = myfile.read()
        return preferences, ok_status, text_type


@app.route('/api/update_legend_preferences/<identifier>', methods=['POST'])
def update_legend_preferences(identifier):
    """Update the Preferences.

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response signaling if the change was successful
    """
    check_upload_path_exists(identifier)
    content = request.data
    file = open(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'legend_preferences.json'), 'w')
    file.write(content.decode("utf-8"))
    return content, ok_status, text_type


@app.route('/api/process_vis/<identifier>', methods=['POST'])
def process_vis(identifier):
    """Pack and transform the visualization

    Arguments:
        identifier {String} -- the identifier for the requested network

    Returns:
        object -- a http response containing the zip file with the visualizations
    """
    content = request.data
    # Get the Json representation of the Request Body
    json_content = json.loads(content)
    # Base_Path for Visualizations
    base_path = os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'visualizations')
    # Save and convert the svg files into PDFs
    save_and_convert_svgs(base_path, json_content)
    # Create a Zip File
    zipf = zipfile.ZipFile(os.path.join(
        app.config['UPLOAD_PATH'], identifier, 'visualizations.zip'), 'w', zipfile.ZIP_DEFLATED)
    # Zip a directory into this file
    zipdir(base_path, zipf)
    zipf.close()
    # Save the downloaded state for evaluation
    backup_download_content(identifier)
    # Send the Zip back to the frontend
    return send_file(os.path.join(app.config['UPLOAD_PATH'], identifier, 'visualizations.zip'),
                     mimetype='zip',
                     attachment_filename='visualizations.zip',
                     as_attachment=True)


if __name__ == '__main__':
    app.run(debug=True)
