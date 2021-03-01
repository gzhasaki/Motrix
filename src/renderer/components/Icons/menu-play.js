import Icon from '@/components/Icons/Icon'

Icon.register({
  'menu-play': {
    'width': 24,
    'height': 24,
    'raw': `<line fill="none" stroke-miterlimit="10" x1="0" y1="0" x2="24" y2="12" />
      <line fill="none" stroke-miterlimit="10" x1="0" y1="0" x2="0" y2="24" />
      <line fill="none" stroke-miterlimit="10" x1="24" y1="12" x2="0" y2="24" />`,
    'g': {
      'stroke': 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2'
    }
  }
})
