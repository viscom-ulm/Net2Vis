class Layer:
    def __init__(self):
        self.properties = {}

    def add_specs(self, specs):
        for spec in specs:
            spec = spec.replace(')', '').strip()
            spec_split = spec.split('=')
            self.properties[spec_split[0].strip()] = try_str_to_bool(spec_split[1].strip().strip('\''))

    
    def __repr__(self):
        return "%s(properties: %r)" % (self.__class__, self.properties)


class Dense(Layer):
    def __init__(self, units):
        Layer.__init__(self)
        self.units = units
        self.properties = {
            'activation': None,
            'use_bias': True,
            'kernel_initializer': 'glorot_uniform',
            'bias_initializer': 'zeros',
            'kernel_regularizer': None,
            'bias_regularizer': None,
            'activity_regularizer': None,
            'kernel_constraint': None,
            'bias_constraint': None
        }


    def __repr__(self):
        return "%s(units: %r, properties: %r)" % (self.__class__, self.units, self.properties)


class Conv2D(Layer):
    def __init__(self, filters, kernel_size):
        Layer.__init__(self)
        self.filters = filters
        self.kernel_size = try_str_to_tuple(kernel_size)
        self.properties = {
            'strides': (1, 1),
            'padding': 'valid',
            'data_format': None,
            'dilation_rate': (1, 1),
            'activation': None,
            'use_bias': True,
            'kernel_initializer': 'glorot_uniform',
            'bias_initializer': 'zeros',
            'kernel_regularizer': None,
            'bias_regularizer': None,
            'activity_regularizer': None,
            'kernel_constraint': None,
            'bias_constraint': None
        }

    def __repr__(self):
        return "%s(filters: %r, kernel: %r, properties: %r)" % (self.__class__, self.filters, self.kernel_size, self.properties)


def try_str_to_bool(s):
    if s == 'True':
        return True
    elif s == 'False':
        return False
    else:
        return try_str_to_number(s)


def try_str_to_number(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return try_str_to_tuple(s)


def try_str_to_tuple(s):
    try:
        return tuple(map(int, s[1:-1].split(',')))
    except ValueError:
        return s