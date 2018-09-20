import tensorflow as tf
from tensorflow.python.keras import models
from tensorflow.python.keras import layers
from tensorflow.python.keras import utils
from tensorflow.python.keras.applications.resnet50 import ResNet50

def get_model():
    img_height = 224
    img_width = 224
    img_channels = 3

    input_shape = (img_height, img_width, img_channels)
    img_input = tf.keras.Input(shape=input_shape)
    x = layers.Conv2D(64, kernel_size=(7, 7), strides=(2, 2), padding='same')(img_input)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU()(x)
    x = layers.Conv2D(128, kernel_size=(1,1))(x)    
    x = layers.MaxPool2D(pool_size=(3, 3), strides=(2, 2), padding='same')(x)
    shortcut = x
    #shortcut = layers.Conv2D(256, kernel_size=(1, 1), strides=(1, 1), padding='same')(shortcut)
    #shortcut = layers.BatchNormalization()(shortcut)
    x = layers.Conv2D(128, kernel_size=(1, 1), strides=(1, 1), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU()(x)
    x = layers.Conv2D(128, kernel_size=(3, 3), strides=(1, 1), padding='same')(x)
    x = layers.BatchNormalization()(x)
    x = layers.LeakyReLU()(x)
    #x = layers.Conv2D(256, kernel_size=(1, 1), strides=(1, 1), padding='same')(x)
    #x = layers.BatchNormalization()(x)
    x = layers.add([shortcut, x])
    x = layers.LeakyReLU()(x)
    x = layers.LeakyReLU()(x)
    model = models.Model(img_input, x)
    return model
    