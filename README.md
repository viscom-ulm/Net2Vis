![Net2Vis Teaser](net2vis_teaser.png)
![Net2Vis Teaser_Legend](net2vis_teaser_legend.png)

# Net2Vis

:white_check_mark: Automatic Network Visualization

:white_check_mark: Levels of Abstraction

:white_check_mark: Unified Design

Created by <a href="https://a13x.io/" target="_blank">Alex Bäuerle</a>, <a href="https://www.uni-ulm.de/in/mi/institut/mitarbeiter/c-onzenoodt/" target="_blank">Christian van Onzenoodt</a> and <a href="https://www.uni-ulm.de/in/mi/institut/mi-mitarbeiter/tr/" target="_blank">Timo Ropinski</a>.

Accessible <a href="https://viscom.net2vis.uni-ulm.de" target="_blank">online</a>.

## What is this?

Net2Vis automatically generates abstract visualizations for convolutional neural networks from Keras code.

## How does this help me?

When looking at publications that use neural networks for their techniques, it is still apparent how they differ.
Most of them are handcrafted and thus lack a unified visual grammar.
Handcrafting such visualizations also creates ambiguities and misinterpretations.

With Net2Vis, these problems are gone.
It is designed to provide an abstract network visualization while still providing general information about individual layers.
We reflect the number of features as well as the spatial resolution of the tensor in our glyph design.
Layer-Types can be identified through colors.
Since these networks can get fairly complex, we added the possibility to group layers and thus compact the network through replacing common layer sequences.

The best of it: Once the application runs, you just have to paste your Keras code into your browser and the visualization is automatically generated based on that.
You still can tweak your visualizations and create abstractions before downloading them as SVG and PDF.

## How can I use this?

Either, go to our <a href="https://viscom.net2vis.uni-ulm.de" target="_blank">Website</a>, or install Net2Vis locally.
Our website includes no setup, but might be slower and limited in network size depending on what you are working on.
Installing this locally allows you to modify the functionality and might be better performing than the online version.

## Installation

Starting with Net2Vis is pretty easy (assuming python3, tested to run on python 3.6-3.8, and npm).

1. Clone this Repo
2. For the Backend to work, we need Cairo and Docker installed on your machine. This is used for PDF conversion and running models pasted into the browser (more) secure.

For docker, the docker daemon needs to run.
This way, we can run the pasted code within separate containers.

For starting up the backend, the following steps are needed:

1. Go into the backend folder: `cd backend`
2. Install backend dependencies by running `pip3 install -r requirements.txt`
3. Install the docker container by running `docker build --force-rm -t tf_plus_keras .`
4. To start the server, issue: `python3 server.py`

The frontend is a react application that can be started as follows:

1. Go into the frontend folder: `cd net2vis`
2. Install the javascript dependencies using: `npm install`
3. Start the frontend application with: `npm start`

## Model Presets

For local installations only: If you want to replicate any of the network figures in our paper, or just want to see examples for visualizations, we have included all network figures from our paper for you to experiment with. To access those simply use the following urls:

- Figure 1: <a href="http://localhost:3000/unet" target="_blank">localhost:3000/unet</a>
- Figure 4: <a href="http://localhost:3000/resnet" target="_blank">localhost:3000/resnet</a>
- Figure 5: <a href="http://localhost:3000/monochrome" target="_blank">localhost:3000/monochrome</a>
- Figure 6: <a href="http://localhost:3000/3d" target="_blank">localhost:3000/3d</a>

For most of these URL endings, you will probably also find networks in the official version, however, there is no guarantee that they wont have been changed.

## Citation

If you find this code useful please consider citing us:

    @article{bauerle2021net2vis,
      title={Net2vis--a visual grammar for automatically generating publication-tailored cnn architecture visualizations},
      author={B{\"a}uerle, Alex and Van Onzenoodt, Christian and Ropinski, Timo},
      journal={IEEE transactions on visualization and computer graphics},
      volume={27},
      number={6},
      pages={2980--2991},
      year={2021},
      publisher={IEEE}
    }

## Acknowlegements

This work was funded by the Carl-Zeiss-Scholarship for Ph.D. students.
