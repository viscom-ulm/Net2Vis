import argparse

parser = argparse.ArgumentParser(
    description='Translate a network implementation into NetViz format.')
parser.add_argument('file_name', metavar='file name', type=str, 
    help='Name of the file to be translated.')
parser.add_argument('model_type', metavar='model type', type=str,
    help='Type of the model to be translated (currently supported: Keras)')

args = parser.parse_args()
file_input = open(args.file_name, 'r')
content = file_input.readlines()
content = [x.strip() for x in content] 
