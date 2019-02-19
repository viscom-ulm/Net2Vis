# Net2Vis

:white_check_mark: Automatic Network Visualization

:white_check_mark: Levels of Abstraction

:white_check_mark: Unified Design

## What is this?
Net2Vis automatically generates abstract visualizations for convolustional neural networks from Keras code.

## How does this help me?
When looking at publications that use neural networks for their techniques, it is still apparent how they differ.
Most of them are handcrafted and thus lack a unified visual grammar.
Handcrafting such visualizations also creates abiguities and misinterpretations.

Wit Net2Vis, these problems are gone.
It is designed to provide an abstract network visualization while still providing general information about individual layers.
We reflect the number of features as well as the spatial reolution of the tensor in our glyph design.
Layer-Types can be identified through colors.
Since these networks can get fairly complex, we added the possibility to group layers and thus compact the network through replacing common layer sequences.

The best of it: Once the application runs, you just have to paste your Keras code into your browser and the visualization is automatically generated based on that.
You still can tweak your visualizations and create abstractions before downloading them as SVG.

## Installation
Starting with Net2Vis is pretty easy (assuming python3, npm, and tensorflow/keras are installed).
1. Clone this Repo

For starting up the server, the following steps are needed:
1. Install Flask for the server functionality using: `pip3 install flask`
2. Install Cairosvg for conversion of svg images into pdfs with: `pip3 install cairosvg`
3. Within the 'backend' folder, issue python3 server.py

The frontend is a react application that can be started as follows:
1. cd into the 'netviz' folder
2. npm install
3. npm start

## Acknolegements

This work was funded by the Carl-Zeiss-Scholarship for Ph.D. students.
