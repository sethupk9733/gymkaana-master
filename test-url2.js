const fs = require('fs');
async function run() {
    try {
        const r = await fetch('https://owner.gymkaana.com');
        const html = await r.text();
        const match = html.match(/src="(\/assets\/index-.*?.js)"/);
        if (match) {
            const js = await fetch('https://owner.gymkaana.com' + match[1]);
            const script = await js.text();
            const start = script.indexOf('https://api.gymkaana.com');
            console.log(script.substring(start - 10, start + 40));
        }
    } catch (e) {
        console.error(e);
    }
}
run();
