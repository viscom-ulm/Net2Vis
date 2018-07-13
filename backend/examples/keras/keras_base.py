import tensorflow as tf
from tensorflow.python.keras import models
from tensorflow.python.keras import layers

def get_model():
    img_rows = 28
    img_cols = 28
    input_shape = (img_rows, img_cols, 1)
    img_input = tf.keras.Input(shape=(28, 28, 1))
    x = layers.Conv2D(32, 
        kernel_size=(3,3), 
        activation='relu', 
        input_shape=input_shape)(img_input)
    x = layers.Conv2D(63, (3,3), activation='relu')(x)
    x = layers.MaxPool2D(pool_size=(2,2))(x)
    x = layers.Dropout(0.25)(x)
    x = layers.Flatten()(x)
    x = layers.Dense(128, activation='relu')(x)
    x = layers.Dropout(0.5)(x)
    x = layers.Dense(10, activation='softmax')(x)

    model = models.Model(img_input, x)
    return model
