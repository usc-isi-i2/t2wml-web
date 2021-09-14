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
}]


export const ROLES = [{
  'label': 'Country',
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
}]
