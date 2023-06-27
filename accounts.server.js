const fs = require("fs");
const moment = require("moment-timezone");
process.businessDate = () => {
    const currentDiff = Date.now() - moment.tz('UTC') + 60 * 60 * 1000;
    const dateTmp = new Date();
    dateTmp.setTime(dateTmp.getTime() + currentDiff);
    return dateTmp;
}
const log_to_file = (m) => {
    if (fs.existsSync("accounts.choose.log")) m = m;
    else fs.writeFileSync("accounts.choose.log", "");

    console.log(m);
    fs.appendFileSync("accounts.choose.log", m + "\n");
};
process.on("uncaughtException", (e, o) => {
    log_to_file(`uncaught ${e}`);
    log_to_file(`origin ${e.stack ? e.stack : o}`);
});

process.on("unhandledRejection", (r, p) => {
    log_to_file(`unhandled ${r}`);
    log_to_file(`origin ${r.stack}`);
});

log_to_file("starting choosing process");

const express = require("express");

const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors());

if (!fs.existsSync("accounts.json")) {
    fs.writeFileSync("accounts.json", "{}");
}

app.get("/accounts_get", function (req, res, next) {
    const accounts = fs.readFileSync("accounts.json", "utf8");
    res.send(accounts);
});

app.get("/last_updated", function (req, res, next) {
    res.send(fs.readFileSync("last_updated.txt", "utf8"));
});

app.get("/last_updated_set", function (req, res, next) {
    fs.writeFileSync("last_updated.txt", req.query.data + "");
    res.send("ok");
});

app.post("/accounts_set_all", function (req, res, next) {
    fs.writeFileSync(
        "accounts.json",
        JSON.stringify(JSON.parse(req.body.data), null, 2)
    );
    res.send("ok");
});

app.use("/js", express.static("./js"));

app.get("/accounts_edit", function (req, res, next) {
    res.sendFile("edit.html", {root: "."});
});

async function update(payload) {
    const accounts = fs.readFileSync("accounts.json", "utf-8");
    const accountsJson = JSON.parse(accounts);
    const bundle = JSON.parse(payload);
    let resp = "";
    for (const key in bundle) {
        if (Object.hasOwnProperty.call(bundle, key)) {
            const value = bundle[key];
            if (!accountsJson[key]) {
                resp += "" + key + " not there,";
            } else resp += "ok,";
            for (const key2 in bundle[key]) {
                if (Object.hasOwnProperty.call(bundle[key], key2)) {
                    const value = bundle[key][key2];
                    if (!accountsJson[key]) accountsJson[key] = {};
                    accountsJson[key][key2] = value;
                }
            }
        }
    }
    fs.writeFileSync("accounts.json", JSON.stringify(accountsJson, null, 2));
    return resp;
}
app.post("/accounts_set", function (req, res) {
    const accounts = fs.readFileSync("accounts.json", "utf-8");
    res.send(update(req.body.data));
});
app.post("/accounts_add", function (req, res) {
    const accounts = fs.readFileSync("accounts.json", "utf-8");
    const accountsJson = JSON.parse(accounts);
    let resp = "";
    const bundle = JSON.parse(req.body.data);
    for (const key in bundle) {
        if (Object.hasOwnProperty.call(bundle, key)) {
            if (accountsJson[key]) {
                resp += "already there,";
                continue;
            }
            resp += "ok,";
            const value = bundle[key];
            accountsJson[key] = value;
        }
    }

    fs.writeFileSync("accounts.json", JSON.stringify(accountsJson, null, 2));
    res.send(resp);
});

app.get("/choose_account", async function (req, res) {
    log_to_file(
        `received paylod for choiuce ${JSON.stringify(
            JSON.parse(req.query.data),
            null,
            2
        )}`
    );
    const payload = JSON.parse(req.query.data);
    res.send(await choose(payload));
});

if (process.argv[2]) {
    console.log(`received payload ${process.argv[2]}`)
    choose(JSON.parse(process.argv[2])).then(console.log)
} else
    app.listen(8007, function () {
        console.log("server running http://localhost:8007");
    });

async function choose(payload) {
    payload.phone = payload.phone.startsWith("0")
        ? payload.phone.slice(1)
        : payload.phone;

    if (!payload.country) payload.country = 'fr'

    let accountsdata = JSON.parse(fs.readFileSync("accounts.json", "utf-8"));

    let result = {};

    result.noaccount = payload.phone;
    result.watcher = payload.watcher;
    result.processed_accounts = Object.keys(accountsdata).length;

    log_to_file(`processing ${Object.keys(accountsdata).length}`);
    for (const accountsID in accountsdata) {
        const acc = accountsdata[accountsID];

        if (acc.country && payload.country && acc.country !== payload.country) {
            continue
        }
        if (!acc.country && payload.country !== 'fr') {
            continue
        }

        if (!acc.password) continue;
        if (acc.not_activated) continue;
        if (acc.not_confirmed) continue;
        if (acc.not_permitted) continue;
        if (acc.max_reservation) continue;
        if (acc.not_permitted) continue;
        if (acc.booked) continue;

        if (acc.already_booked && !payload.country=='it') {
            if (
                process.businessDate().getTime() - parseInt(acc.lastlogged) < 3 * 24 * 60 * 60 * 1000
            )
                continue;
        }

        if (
            acc.lastused &&
            process.businessDate().getTime() - parseInt(acc.lastused) < 60000 &&
            !payload.no_account_usage_wait
        )
            continue;

        if (
            acc.lastlogged &&
            process.businessDate().getTime() - parseInt(acc.lastlogged) < 1800000 &&
            !payload.no_account_usage_wait
        )
            continue;

        if (
            (payload.watcher && acc.watcher) ||
            payload.phone == acc.phone ||
            payload.pick_any_account
        ) {
            update({
                accountsID: {
                    lastused: process.businessDate().getTime(),
                }
            })
            result = {
                EmailId: acc.email,
                Password: acc.password,
                EmailPassword: acc.email_password,
            };
            break;
        }
    }

    log_to_file(`processing accounts done, choice ${JSON.stringify(result)}`);

    return JSON.stringify(result);
}

setInterval(() => {
    if (fs.existsSync('kills')) {
        fs.unlinkSync('kills')
        process.exit(0)
    }
}, 3000)
