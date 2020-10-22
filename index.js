const Router = require('./router')

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

const someHost = 'https://static-links-page.signalnerve.workers.dev'
const url = someHost + '/static/html'

async function gatherResponse(response) {
    const { headers } = response
    const contentType = headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
        return JSON.stringify(await response.json())
    } else if (contentType.includes('application/text')) {
        return await response.text()
    } else if (contentType.includes('text/html')) {
        return await response.text()
    } else {
        return await response.text()
    }
}

async function handleHTML() {
    const init = {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    }
    const response = await fetch(url, init)
    const results = await gatherResponse(response)
    return new Response(results, init)
}

function handlerLinks(request) {
    const init = {
        headers: { 'content-type': 'application/json' },
    }
    const data = [
        { name: 'Link1', url: 'https://www.facebook.com' },
        { name: 'Link2', url: 'https://www.google.com' },
        { name: 'Link3', url: 'https://www.youtube.com' },
    ]

    const body = JSON.stringify(data, null, 2)
    return new Response(body, init)
}

class ElementHandler {
    constructor(id) {
        this.id = id
    }

    async element(element) {
        const attribute = element.getAttribute('style')

        if (element.tagName === 'div' && this.id == 'style') {
            element.setAttribute('style', 'display:block')
        }
        if (element.tagName === 'div' && this.id == 'styleSocial') {
            element.setAttribute(
                'style',
                `display: 'flex', flex-direction:'row'`
            )
            const init = { html: true }
            element.setInnerContent(
                `       <div style ="display: flex">
                                 <a href="https://www.instagram.com/sindhuri_pallapothu/?hl=en" target="_blank">
                                    <svg>
                                        <img width="70px" height="70px" src="https://simpleicons.org/icons/instagram.svg" />
                                    </svg>
                                </a>
                                <a href="https://www.facebook.com/profile.php?id=100000881421390" target="_blank">
                                    <svg>
                                        <img width="70px" height="70px" src="https://image.flaticon.com/icons/png/512/20/20673.png" />
                                    </svg>
                                </a>
                                <a href="https://www.linkedin.com/in/sindhuri-lsp/" target="_blank">
                                    <svg>
                                        <img width="70px" height="70px" src="https://simpleicons.org/icons/linkedin.svg" />
                                    </svg>
                                </a>
                            </div>`,
                init
            )
        }
        if (element.tagName === 'img') {
            element.setAttribute(
                'src',
                'https://scontent-dfw5-2.xx.fbcdn.net/v/t1.0-9/106712291_3176154185757264_7648077350025036760_o.jpg?_nc_cat=104&_nc_sid=09cbfe&_nc_ohc=rXW2pY9H_psAX81xot9&_nc_ht=scontent-dfw5-2.xx&oh=ab51efb85239e3ddd3b08cde16633441&oe=5FB34E26'
            )
        }
        if (element.tagName === 'h1' && this.id == 'name') {
            element.append('Sindhuri')
            element.setAttribute('style', 'margin-left: 17px')
        }
        if (element.tagName === 'body') {
            element.setAttribute('style', 'background-color: #702459')
        }
        if (element.tagName === 'title') {
            element.setInnerContent('Sindhuri')
        }
        if (element.tagName === 'div' && this.id == 'links') {
            const init = { html: true }
            element.append(
                `<a href="https://www.facebook.com" target="_blank">Link 1</a>
            <a href="https://www.google.comm" target="_blank">Link 2</a>
            <a href="https://www.youtube.com" target="_blank">Link 3</a>`,
                init
            )
        }
    }
}

async function handleRequest(request) {
    const r = new Router()
    r.get('/', request => handleHTML(request))
    r.get('.*/links', request => handlerLinks(request))
    const resp = await r.route(request)
    // return rewriter.transform(resp)
    // return resp
    return new HTMLRewriter()
        .on('div#profile', new ElementHandler('style'))
        .on('div#social', new ElementHandler('styleSocial'))
        .on('img#avatar', new ElementHandler())
        .on('h1#name', new ElementHandler('name'))
        .on('div#links', new ElementHandler('links'))
        .on('title', new ElementHandler())
        .on('body', new ElementHandler())
        .on('title', new ElementHandler())
        .transform(resp)
}
