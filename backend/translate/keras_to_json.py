def keras_to_json(keras_code):
    model = exec(keras_code)
    print(model.to_json())
