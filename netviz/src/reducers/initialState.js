export default {
    network: [],
    code: '',
    group_transform: {
        x: 0,
        y: 0,
        scale: 1
    },
    display: {
        code_toggle: false,
        preferences_toggle: false,
        legend_toggle: false
    },
    layer_types_settings: {
        Conv2D: {
            color: 'green'
        },
        Activation: {
            color: 'red'
        }
    },
    layers_settings: {
        layer_display_size: {
            min_size: 50,
            max_size: 200
        },
        layer_extreme_dimensions: {
            max_size: 2,
            min_size: 1
        }
    }
}