// Insert the meta viewport tag
const $viewport = document.createElement('meta')
$viewport.name = 'viewport'
$viewport.content = 'width=device-width, initial-scale=1.0'
document.querySelector('head').appendChild($viewport)

// Insert the favicon (light theme)
const $faviconLight = document.createElement('link')
$faviconLight.rel = 'icon'
$faviconLight.type = 'image/svg+xml'
$faviconLight.media = '(prefers-color-scheme: light)'
$faviconLight.href = '/api/public/img/favicon-light.svg'
document.querySelector('head').appendChild($faviconLight)

// Insert the favicon (dark theme)
const $faviconDark = document.createElement('link')
$faviconDark.rel = 'icon'
$faviconDark.type = 'image/svg+xml'
$faviconDark.media = '(prefers-color-scheme: dark)'
$faviconDark.href = '/api/public/img/favicon-dark.svg'
document.querySelector('head').appendChild($faviconDark)
