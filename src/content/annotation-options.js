export const TYPES = [{
  'label': 'String',
  'value': 'string',
  'children': [{
    'label': 'Variable',
    'value': 'property',
  }],
}, {
  'label': 'Quantity',
  'value': 'quantity',
  'children': [{
    'label': 'Variable',
    'value': 'property',
  }],
}, {
  'label': 'Time',
  'value': 'time',
  'children': [{
    'label': 'Precision',
    'value': 'precision',
  }, {
    'label': 'Calendar',
    'value': 'calendar',
  }, {
    'label': 'Format',
    'value': 'format',
  }, {
    'label': 'Variable',
    'value': 'property',
  }],
}, {
  'label': 'Country',
  'value': 'wikibaseitem',
  'wikify': true,
  'children': [{
    'label': 'Variable',
    'value': 'property',
  }],
}]


export const ROLES = [{
  'label': 'Country',
  'value': 'mainSubject',
  'wikify': true,
}, {
  'label': 'Value',
  'value': 'dependentVar',
  'children': TYPES,
}, {
  'label': 'Variable',
  'value': 'property',
  'wikify': true,
}, {
  'label': 'Qualifier',
  'value': 'qualifier',
  'children': TYPES,
}, {
  'label': 'Metadata',
  'value': 'metadata',
}]
