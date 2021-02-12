# You can freely modify this file.
# However, you need to have a function that is named get_model and returns a Keras Model.
import tensorflow as tf
from tensorflow.python.keras import models
from tensorflow.python.keras import layers
from tensorflow.python.keras import utils

def get_model():
    img_height = 256
    img_width = 256
    img_channels = 1

    model = tf.keras.applications.ResNet50(weights=None)

    return model