export const TYPES = [{
  'label': 'String',
  'value': 'string',
  'children': [{
    'label': 'Property',
    'value': 'property',
  }],
}, {
  'label': 'Quantity',
  'value': 'quantity',
  'children': [{
    'label': 'Unit',
    'value': 'unit',
  }, {
    'label': 'Property',
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
    'label': 'Property',
    'value': 'property',
  }],
}, {
  'label': 'Country',
  'value': 'wikibaseitem',
  'wikify': true,
  'children': [{
    'label': 'Property',
    'value': 'property',
  }],
}]


export const ROLES = [{
  'label': 'Main Subject',
  'value': 'mainSubject',
  'wikify': true,
}, {
  'label': 'Dependent Variable',
  'value': 'dependentVar',
  'children': TYPES,
}, {
  'label': 'Property',
  'value': 'property',
  'wikify': true,
}, {
  'label': 'Qualifier',
  'value': 'qualifier',
  'children': TYPES,
}, {
  'label': 'Metadata',
  'value': 'metadata',
}, {
  'label': 'Unit',
  'value': 'unit',
  'wikify': true,
}]
