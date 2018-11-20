// Set the initial State of the Application
export default {
    id: '',
    network: {},
    code: '',
    group_transform: {
        x: 0,
        y: 50,
        scale: 1
    },
    legend_transform: {
        x: 0,
        y: 0,
        scale: 1
    },
    display: {
        code_toggle: true,
        preferences_toggle: true,
        legend_toggle: true 
    },
    layer_types_settings: {},
    preferences: {
        layer_display_min_height: {value: 30, type: 'number', description: 'Minimum Layer Height'},
        layer_display_max_height: {value: 150, type: 'number', description: 'Maximum Layer Height'},
        layer_display_min_width: {value: 20, type: 'number', description: 'Minimum width of Layers'},
        layer_display_max_width: {value: 80, type: 'number', description: 'Maximum width of Layers'},
        layers_spacing_horizontal: {value: 0, type: 'number', description: 'Horizontal spacing between Layers'},
        layers_spacing_vertical: {value: 0, type: 'number', description: 'Vertical spacing between Layers'},
        features_mapping: {value: 'none', type: 'choice', description: 'Visual mapping of the Features'}
    },
    layer_extreme_dimensions: {
        max_size: 2,
        min_size: 1,
        max_features: 2,
        min_features: 1
    },
    error: {},
    selection: [],
    preferences_mode: 'network',
    selected_legend_item: '',
    groups: [],
    compressed_network: {},
    legend_preferences: {
        element_spacing: {value: 70, type: 'number', description: 'Spacing between Elements'},
        layer_height: {value: 30, type: 'number', description: 'Layer Height'},
        layer_width: {value: 10, type: 'number', description: 'Layer Width'},
        layers_spacing_horizontal: {value: 5, type: 'number', description: 'Horizontal spacing between Layers'},
        layers_spacing_vertical: {value: 10, type: 'number', description: 'Vertical spacing between Layers'},
        complex_spacing: {value: 15, type: 'number', description: 'Spacing before complex Layer'}
    }
}