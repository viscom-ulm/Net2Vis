# You can freely modify this file.
# However, you need to have a function that is named get_model and returns a Keras Model.
import tensorflow as tf
from tensorflow.python.keras import models
from tensorflow.python.keras import layers
from tensorflow.python.keras import utils

def get_model():
    model = models.Sequential()
    model.add(layers.Reshape((30, 30, 30, 1), input_shape=(30, 30, 30, 1)))
    model.add(layers.Conv3D(16, 6, strides=2, activation='relu', padding='same'))
    model.add(layers.Conv3D(64, 5, strides=2, activation='relu', padding='same'))
    model.add(layers.Conv3D(64, 5, strides=2, activation='relu'))
    model.add(layers.Flatten())
    model.add(layers.Dense(10, activation='softmax'))
    return model