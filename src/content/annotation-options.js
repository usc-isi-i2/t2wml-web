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
    'children': [{
      'label': 'Year',
      'value': 9,
    }, {
      'label': 'Month',
      'value': 10,
    }, {
      'label': 'Day',
      'value': 11,
    }],
  }, {
    'label': 'Format',
    'value': 'format',
    'children': [{
      'label': '%Y (2021)',
      'value': '"%Y"',
    }, {
      'label': '%Y-%m (2021-09)',
      'value': '"%Y-%m"',
    }, {
      'label': '%Y-%m-%d (2021-09-17)',
      'value': '"%Y-%m-%d"',
    }, {
      'label': '%d/%m/%Y (17/09/2021)',
      'value': '"%d/%m/%Y"',
    }, {
      'label': '%Y-%b-%d (2021-Sep-17)',
      'value': '"%Y-%b-%d"',
    }, {
      'label': '%Y-%b-%d (2021-September-17)',
      'value': '"%Y-%b-%d"',
    }, {
      'label': '%Y-%m-%dT%H:%M:%S (2021-09-17T14:00:00)',
      'value': '"%Y-%m-%dT%H:%M:%S"',
    }],
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
