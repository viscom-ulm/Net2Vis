class Dense:
    def __init__(self, units):
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


    def add_specs(self, specs):
        for spec in specs:
            spec = spec.replace(')', '').strip()
            spec_split = spec.split('=')
            self.properties[spec_split[0].strip()] = str_to_bool(spec_split[1].strip().strip('\''))


def str_to_bool(s):
    if s == 'True':
        return True
    elif s == 'False':
        return False
    else:
        return str_to_number(s)


def str_to_number(s):
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s