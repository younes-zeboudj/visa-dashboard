import {
    basicApplicationRenderer,
    dbApplicationRenderer,
    renderTable,
    reservedApplicationRenderer,
    show_ui,
    titled_pane
} from "./show_ui.js";
import {get_db_apps, get_success_bdl_files} from "./get_data.js";

async function show_bdl_success_table(){
    const data = await get_success_bdl_files()
    const renderers = {
        ...basicApplicationRenderer,
        ...reservedApplicationRenderer
    }

    const tablehtml= renderTable(data, renderers)
    const pane = titled_pane(tablehtml, 'BDL Success Files')
    show_ui(pane)
}

async function show_db_table(){
    const data = await get_db_apps()
    const renderers = {
        ...basicApplicationRenderer,
        ...dbApplicationRenderer
    }

    const tablehtml= renderTable(data, renderers)
    const pane = titled_pane(tablehtml, 'DB Passports')
    show_ui(pane)
}



window.show_bdl_success_table = show_bdl_success_table
window.show_db_table = show_db_table
