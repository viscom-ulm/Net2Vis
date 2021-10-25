// Set the initial State of the Application
export default {
  id: "",
  network: {},
  code: "",
  group_transform: {
    x: 0,
    y: 0,
    scale: 1,
  },
  legend_transform: {
    x: 0,
    y: 0,
    scale: 1,
  },
  display: {
    code_toggle: true,
    preferences_toggle: true,
    legend_toggle: true,
    alert_toggle: false,
    help_toggle: false,
    upload_toggle: false,
  },
  layer_types_settings: {},
  preferences: {
    layer_display_min_height: {
      value: 30,
      type: "number",
      description: "Minimum Layer Height",
    },
    layer_display_max_height: {
      value: 150,
      type: "number",
      description: "Maximum Layer Height",
    },
    layer_display_min_width: {
      value: 20,
      type: "number",
      description: "Minimum width of Layers",
    },
    layer_display_max_width: {
      value: 80,
      type: "number",
      description: "Maximum width of Layers",
    },
    layers_spacing_horizontal: {
      value: 0,
      type: "number",
      description: "Horizontal spacing between Layers",
    },
    layers_spacing_vertical: {
      value: 0,
      type: "number",
      description: "Vertical spacing between Layers",
    },
    features_mapping: {
      value: "none",
      type: "choice",
      description: "Visual mapping of the Features",
    },
    show_dimensions: {
      value: true,
      type: "switch",
      description: "Dimensions Label",
    },
    show_features: {
      value: true,
      type: "switch",
      description: "Features Label",
    },
    show_name: {
      value: false,
      type: "switch",
      description: "Name Label",
    },
    add_splitting: {
      value: false,
      type: "switch",
      description: "Replace Split Layers",
    },
    show_samples: {
      value: true,
      type: "switch",
      description: "Input/Output Samples",
    },
    channels_first: {
      value: false,
      type: "switch",
      description: "Channels First",
    },
    no_colors: { value: false, type: "switch", description: "Disable Colors" },
    stroke_width: { value: 4, type: "number", description: "Stroke Width" },
  },
  layer_extreme_dimensions: {
    max_size: 2,
    min_size: 1,
    max_features: 2,
    min_features: 1,
    max_dense: 2,
    min_dense: 1,
  },
  error: {},
  selection: [],
  preferences_mode: "network",
  selected_legend_item: "",
  groups: [],
  compressed_network: {},
  legend_preferences: {
    element_spacing: {
      value: 70,
      type: "number",
      description: "Spacing between Elements",
    },
    layer_height: { value: 30, type: "number", description: "Layer Height" },
    layer_width: { value: 10, type: "number", description: "Layer Width" },
    layers_spacing_horizontal: {
      value: 5,
      type: "number",
      description: "Horizontal spacing between Layers",
    },
    layers_spacing_vertical: {
      value: 10,
      type: "number",
      description: "Vertical spacing between Layers",
    },
    complex_spacing: {
      value: 15,
      type: "number",
      description: "Spacing before complex Layer",
    },
    stroke_width: { value: 2, type: "number", description: "Stroke Width" },
    reverse_order: {
      value: false,
      type: "switch",
      description: "Reverse Legend Order",
    },
  },
  color_mode: {
    selection: "Palette",
    generation: "Palette",
  },
  network_bbox: {},
  legend_bbox: {},
  alert_snack: {
    open: false,
    message: "",
  },
};
