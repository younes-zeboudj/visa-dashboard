async function get_success_bdl_files() {
    return new Promise((resolve, reject) => {
        $.get(`${window.appurl}/get_success_bdl_files`, data => resolve(JSON.parse(data)))
    });
}

async function get_all_successes() {
    return new Promise((resolve, reject) => {
        $.get(`${window.FIREBASE_SUCCESS_URL}/.json`, data => {
            const clients= data
            const apps= []
            for (const clientid in clients) {
                const clientApps = clients[clientid];
                for (const appid in clientApps) {
                    const app = clientApps[appid];
                    app.client = clientid;
                    apps.push(app);
                }
            }
            resolve(apps)
        })
        })
}

async function get_db_apps() {
    const db_url =  window.FIREBASE_PASSPORTS_URL+"/"
    return new Promise((resolve, reject) => {
        $.ajax(
             db_url+'.json',
            {
                method: "get",

                success: (clientsdata, text, xhr) => {
                    const apps = [];
                    for (const clientid in clientsdata) {
                        const clientApps = clientsdata[clientid];
                        for (const appid in clientApps) {
                            const app = clientApps[appid];
                            app.client = clientid;
                            app.db_url = db_url+clientid+'/'+appid+'.json';
                            apps.push(app);
                        }
                    }

                    resolve(apps);
                },
                error: (xhr, text, error) => {
                    console.log(error);
                    alert(`error: ${error}`);
                    resolve([]);
                },
            }
        );
    });
}

export {get_success_bdl_files, get_db_apps, get_all_successes};
