import argparse
from keras import translate_keras

# Define the Arguments needed.
parser = argparse.ArgumentParser(description='Translate a network implementation into NetViz format.')
parser.add_argument('file_name', metavar='file_name', type=str, help='Name of the file to be translated.')
parser.add_argument('model_type', metavar='model_type', type=str, help='Type of the model to be translated (currently supported: Keras)')

args = parser.parse_args() # Parse the Arguments.
file_input = open(args.file_name, 'r') # Get the input File.
content = file_input.readlines() # Read the Input File
content = [x.strip() for x in content] # Strip the input File Lines.

if(args.model_type == 'Keras'): # Keras-based Translation.
    translate_keras(content)
