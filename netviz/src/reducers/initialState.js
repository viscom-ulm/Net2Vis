// Set the initial State of the Application
export default {
    network: [],
    network_graph: [],
    code: '',
    group_transform: {
        x: 0,
        y: 0,
        scale: 1
    },
    display: {
        code_toggle: true,
        preferences_toggle: false,
        legend_toggle: true 
    },
    layer_types_settings: {
        Conv2D: {
            color: 'green'
        },
        Activation: {
            color: 'red'
        },
        Dropout: {
            color: 'yellow'
        },
        Flatten: {
            color: 'purple'
        },
        MaxPool2D: {
            color: 'blue'
        }
    },
    preferences: {
        layer_display_min_height: {value: 30, type: 'number', description: 'Minimum Layer Height'},
        layer_display_max_height: {value: 150, type: 'number', description: 'Maximum Layer Height'},
        layer_display_width: {value: 80, type: 'number', description: 'Width of Layers'},
        layers_spacing_horizontal: {value: 0, type: 'number', description: 'Horizontal spacing between Layers'},
        layers_spacing_vertical: {value: 0, type: 'number', description: 'Vertical spacing between Layers'}
    },
    layer_extreme_dimensions: {
        max_size: 2,
        min_size: 1
    },
    error: {}
}