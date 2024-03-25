import fetch from 'node-fetch';
import express from "express";
import chalk from 'chalk';
import fs from 'fs'
const app = express();
const port = 8080;
const limit = 10;

app.get("/", async (req, res, next) => {
    const ua = req.headers['user-agent']?.toLowerCase()
    const terminal = ua?.includes("curl") || ua?.includes("powershell") || ua?.includes("wget") || req.query.color
    res.set("Content-Type", "text/plain")
    res.write(terminal ? chalk.redBright(fs.readFileSync("./logo.txt", "utf-8")) : fs.readFileSync("./logo.txt", "utf-8"))
    res.write("\n")
    res.write(
        `HCB Missing Reciepts

A JSON API/cURLable website to get missing reciepts for a HCB organisation.

Due to API limits, the limit of pages is set to ${limit}

JSON API: [GET] ${req.protocol}://${req.hostname}/:id
=> Try it out with ${req.protocol}://${req.hostname}/oblong

CURL also works.
=> curl ${req.protocol}://${req.hostname}/:id

You can use Powershell too, if you're weird.
=> Invoke-WebRequest -Uri "${req.protocol}://${req.hostname}/:id"

You can also append ?color to any request and it will force ANSI colouring.`)
    res.write("\n")

    res.end()
});


app.get("/:id", async (req, res, next) => {
    const id = req.params.id
    var missing: any[] = []
    var people: any = {}
    var ua = req.headers['user-agent']?.toLowerCase()
    var terminal = ua?.includes("curl") || ua?.includes("powershell") || ua?.includes("wget") || req.query.color
    res.set("Content-Type", "text/plain")
    res.write(terminal ? chalk.redBright(fs.readFileSync("./logo.txt", "utf-8")) : fs.readFileSync("./logo.txt", "utf-8"))
    async function lookup(page = 1) {

        console.log(`https://hcb.hackclub.com/api/v3/organizations/${id}/transactions?` + new URLSearchParams({
            page: page.toString()
        }))
        const response = await fetch(`https://hcb.hackclub.com/api/v3/organizations/${id}/transactions?` + new URLSearchParams({
            page: page.toString()
        }));
        const data: any = await response.json();
        if (data && data.message) {
            return res.send("Error: Organisation does not exist.")
        }

        data.forEach(async (transaction: any) => {
            if (!transaction.receipts.missing || transaction.type !== "card_charge") return;
            const userq: any = await (await fetch(transaction.card_charge.href)).json()
            const user = userq.user
            if (Math.sign(transaction.amount_cents) === 1) return // Not spent money, I think it's refunded.
            if (!people[user.id]) people[user.id] = { ...user, count: 1, money: Math.abs(transaction.amount_cents) }
            else people[user.id].money = Math.abs(people[user.id].money) + Math.abs(transaction.amount_cents)
            missing.push({
                user, ...transaction
            })
        });
        if (data.length == 0 || page == limit) {
            res.write("\n")
            if (missing.length == 0) return res.send("🎉 No missing reciepts found. Hurray!\n")
            missing.forEach(item => {
                res.write(`${item.memo} ($${(item.amount_cents / 100).toFixed(2)}) (${item.date}) - ${item.user.full_name}\n`)
            })
            res.write("\n\n------------------\n\n")
            Object.keys(people).forEach(key => {
                res.write(`${people[key].full_name} spent $${people[key].money / 100} across ${people[key].count} non-uploaded receipts\n`)
            })
            res.write("\n\n")
            return res.end()
        } else {
            lookup(page + 1)
        }


    }
    await lookup()

});

const listener = app.listen(port, () => {
    const add = listener.address() as any;
    console.log(`Listening on port ${add.port}...`);
});