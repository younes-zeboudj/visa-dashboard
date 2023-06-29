function show_ui(ui) {
    const background = document.createElement('div')
    background.setAttribute('style', 'padding: 30px 15% 30px 15%; position:absolute; top:0; left:0; width:100%; height:100%; background-color:rgba(200,200,200,0.5); z-index:10000; ' +
        'overflow-y:scroll; ')

    // no click propagation
    ui.onclick = (e) => {
        e.stopPropagation()
    }

    //bg
    background.appendChild(ui)
    background.onclick = () => {
        document.body.removeChild(background)
    }

    ui.onkeydown = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(background)
        }
    }
    document.onkeydown = (e) => {
        if (e.key === 'Escape') {
            document.body.removeChild(background)
        }
    }

    document.body.appendChild(background)
}

const basicApplicationRenderer = {
    'name': (element) => element.customers[0].FirstName + ' ' + element.customers[0].LastName,
    'country': (element) => element.country + ' ' + element.wilaya,
    'Mobile': (element) => element.customers[0].Mobile,
    'VISA': (element) => element.VisaCategoryId,
    'PASPS.': (element) => element.customers.length,
    'Payment': (element) => element.cib?.PAN || 'BDL',
}

const reservedApplicationRenderer = {
    'date': (element) => element.reservation_date,
    'RDV. date': (element) => element.date,
    'Cancel': (element) => {
        const button = document.createElement('button')
        button.setAttribute('class', 'btn btn-warning')
        button.innerText = 'Cancel'
        button.setAttribute('onclick', `$.get('${window.appurl}/launch_file?file=${encodeURIComponent(element.file)}&set_json=${encodeURIComponent(JSON.stringify({"cancellation": true}))}', (data) => {
            console.log(data)
            showPopup('app respone: ' + data)
        })`)
        return button.outerHTML
    },
    'Delete': (element) => {
        const button = document.createElement('button')
        button.setAttribute('class', 'btn btn-danger')
        button.innerText = 'Delete'
        button.setAttribute('onclick', `$.get('${window.appurl}/del_file?file=${encodeURIComponent(element.file)}', (data) => {
            console.log(data)
            showPopup('app respone: ' + data)
            if(data==='ok'){
                this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement)
            }
        })`)
        return button.outerHTML
    }
}


function renderTable(data, renderers) {
    const columns = Object.keys(renderers)

    const table = document.createElement('table')
    table.setAttribute('style', 'width:100%; font-size: 1.3em;')
    table.setAttribute('class', 'table table-striped table-dark table-sm')

    const header = document.createElement('thead')
    const trheader = document.createElement('tr')
    for (const column of columns) {
        const th = document.createElement('th')
        th.innerHTML = column
        trheader.appendChild(th)
    }
    header.appendChild(trheader)
    table.appendChild(header)

    const tbody = document.createElement('tbody')

    for (const row of data) {
        tbody.appendChild(renderRow(row, columns, renderers))
    }

    table.appendChild(tbody)

    return table
}

function renderRow(element, columns, renderers) {
    let row = document.createElement('tr')
    for (const column of columns) {
        let td = document.createElement('td')
        td.setAttribute('style', 'vertical-align: middle;')
        td.innerHTML = renderers[column](element)
        row.appendChild(td)
    }
    return row
}



const showPopup = (message) => {
    const div = document.createElement('div')
    div.setAttribute('style', 'margin-left: 50%; position:absolute; top:0; left:0; width:40%; height:30%; background-color:rgba(200,200,200,1); z-index:10000; display:flex; flex-direction:column; justify-content:center; align-items:center; font-size:1.5em; transform: translate(-50%, 0);')

    const text = document.createElement('div')
    text.innerText = message
    div.appendChild(text)

    document.body.appendChild(div)

    setTimeout(() => {
        document.body.removeChild(div)
    }, 2000);
}

function titled_pane(ui, title){
    const div = document.createElement('div')
    const h2 = document.createElement('h2')
    h2.innerText = title

    div.appendChild(h2)
    div.appendChild(ui)
    div.setAttribute('style', 'display: flex; flex-direction: column; align-items: center; width: 100%; background-color: grey; border-radius: 10px; padding: 10px;')
    return div
}

window.showPopup = showPopup
export { show_ui, renderTable, basicApplicationRenderer, reservedApplicationRenderer, showPopup, titled_pane }
