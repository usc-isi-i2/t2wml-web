export const TOOLTIPS = {

  // project settings
  'project_settings': 'Information about the dataset',
  'project_settings_title': 'The name of the dataset. By default the title is the name of the uploaded Excel/CSV file.',
  'project_settings_description': 'Text with a brief explanation of the dataset and its context.',
  'project_settings_data_source_url': 'The URL where to download the dataset',

  // project menu & header
  'suggest_annotations': 'Let T2WML automatically suggest annotation regions.',
  'apply_annotations': '''Applies previously saved annotations to the current Excel/CSV file. Existing annotations, if
  any, will be removed.

Drag and drop a saved .t2wmlz into the Upload Annotations File area of the popup window.''',
  'upload_fidil': 'Uploads annotated file as timeseries to the FIDIL server',
  'download_t2wmlz': 'Save the current state of annotations as a .t2wmlz file.',
  'download_zip': 'Downloads zip file containing the canonicalized table in CSV format',
  'download_fidil': 'Downloads JSON timeseries file suitable for uploading to FIDIL server.',
  'download_tsv': 'Downloads TSV edge files suitable for uploading to Datamart.',

  // annotation menu
  'block_menu': 'Information about the selected region',
  'cell_menu': 'Information about the selected cell',
  'range': '''Input field used to manually adjust the selected region.

Accepted input format can be either one cell (e.g. A1) or a range of cells (e.g. A1:B12).''',
  'role': '''
Annotation regions can take one of four possible roles: <font color="LightCyan">country</font>, <font
color="PaleGreen">dependent variable</font>, <font color="Bisque">property</font> and <font
color="Purple">qualifier</font>. The annotation regions are used to extract multiple timeseries from the Excel/CSV
file. A timeseries is associated with a country, and a property indicating the category of the data. A timeseries
consists of one or more time points. Each time point consists of a dependent variable (a numerical value) and at least
one qualifier. Each time point must have a time qualifier.''',
  'role_country': 'Region containing country cells. Each timeseries is associated with a country.',
  'role_dependent_variable': 'Region containing numerical value cells that varies with the time qualifiers',
  'role_property': '''
Region containing cells that indicate the categories of the timeseries. An Excel/CSV file may contain more than one category of timeseries.''',
  'role_qualifier': '''Region qualifier cells modify the time points. A time point must have a time qualifier, for example <font face="Courier New">2021-09-17</font>.'''
  'type': 'Annotation regions can take one of four possible data types: string, quantity, time and country',
  'type_string': 'The content of a cell is treated as a sequence of characters',
  'type_quantity': 'The content of a cell is treated as a numeric value',
  'type_time': 'The content of a cell is treated as a time value',
  'type_country': 'The content of a cell is treated as a country',

  // property menu (create/edit)
  'property_label': '',
  'property_description': '',

  // property tags menu
  'property_tags': 'Additional information about the property. The additional information includes factor class, normalizer, relevance and units.',
  'doc_id': 'Deprecated',
  'factor_class': 'Factor classes are the semantics/concepts involved in Causal Models. Use the dropdown menu to select a predefined factor class. Or, enter a new factor class in the text window.',
  'normalizer': 'Transforms the values of the dependent variable to a common scale.',
  'normalizer_longitudinal': 'Maps data values to percentile by year in the data set.',
  'normalizer_simple': 'Scales the data between the minimum and maximum data in the data set.',
  'normalizer_standard': 'Maps data values to percentile in the data set.',
  'relevance': 'Indicates how closely connected this property is to the factor class. The relevance ranges between between 1 (very closely connected) and -1 (very inversely connected).',
  'units': 'Magnitude or scale of measurement.',

  // other
  '': '',
}
