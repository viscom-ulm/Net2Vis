class Dense:
    def __init__(self, units):
        self.units = units


    def __repr__(self):
        return "%s(units: %r)" % (self.__class__, self.units)
