from graph import Graph
import layers

# Called to translate Keras code.
def translate_keras(content):
    graph = Graph()
    # Translate Line by Line.
    for line in content:
        if('.add(' in line): # Sequential Model
            check_sequential(line, graph)
        elif (' = ' in line): # Functional Model
            check_functional(line, graph)
    print(graph)

# If Sequential: Modify the line to be interpretable by the converter.
def check_sequential(line, graph):
    properties = line.split('.add(')[1]
    name = properties.split('(')[0]
    spec = properties.replace(name, '').strip('(')
    name = name.strip().lower()
    add_layer_type(name, spec, graph)

# If Finctional: Modify the line to be interpretable by the converter.
def check_functional(line, graph):
    properties = line[(line.find('=')+1):]
    name = properties.split('(')[0]
    spec = properties.replace(name, '').strip('(')    
    name = name.strip().lower()
    add_layer_type(name, spec, graph)

# Add a Layer for the line. Layers are identified by their name and equipped using the spec.
def add_layer_type(name, spec, graph):
    specs = split_specs(spec) # Split the spec variable to obtain a list of specs.
    layer = None
    previous_layer = graph.layers[-1] if len(graph.layers) > 0 else None
    if('dense' in name): # Dense Layer.
        layer = layers.Dense(spec_raw(specs[0]))
        layer.add_specs(specs[1:])
    elif('conv2d' in name): # Convolution Layer 2D.
        layer = layers.Conv2D(spec_raw(specs[0]), spec_raw(specs[1]))
        layer.add_specs(specs[2:])
    elif('maxpooling2d' in name): # Max-Pooling Layer 2D.
        layer = layers.MaxPool2D()
        layer.add_specs(specs)
    elif ('dropout' in name): # Dropout Layer
        layer = layers.Dropout(spec_raw(specs[0]))
        layer.add_specs(specs[1:])
    elif ('flatten' in name): # Flatten Layer
        layer = layers.Flatten()
        layer.add_specs(specs)
    elif ('activation' in name): # Activation Layer, non-existant in our model. Layt layer gets assigned the activation.
        previous_layer.properties['activation'] = specs[0]
        return
    if(previous_layer): # If this is not the first layer.
        # TODO: This does not support real Input/Output definition.
        previous_layer.output.append(layer)
        layer.input.append(previous_layer)
    graph.add_layer(layer)

# Splits the Specification String into a List of Specifications. 
def split_specs(spec):
    specs = []
    current = ''
    level = 0
    for letter in spec: # Going through the string letter by letter.
        if(letter == '('): # Open Brackets, signals Tuple.
            current = current + letter
            level = level+1
        elif(letter == ')'): # Closing Brackets, indicate Tuple or Specification end.
            if(level>0): # Only add Bracket if belonging to Tuple.
                current = current + letter
            level = level-1
            if(level < 0): # Check if Specification already ended.
                break
        elif(letter == ','): # Comma either separates Specifications or Tuple Values. 
            if(level == 0): # If in Specification Mode, save Spec and begin new one.
                specs.append(current)
                current = ''
            else: # If in Tuple Mode, add the Comma.
                current = current + letter
        elif(letter == ' '): # Skip Blankspaces.
            pass
        elif(letter == '\''): # Skip Quotation Marks.
            pass
        elif(letter == '"'): # Skip Quotation Marks.
            pass
        else: # Add the Letter to the current Spec.
            current = current + letter
    if(current != ''): # Append the last Spec if existant.
        specs.append(current)
    return specs

# Get the Raw-Value of a Spec.
def spec_raw(spec):
    split = spec.split('=')
    if(len(split) > 1): # If Name defined, return raw value separately.
        return split[1]
    else: # Return Raw value.
        return spec
