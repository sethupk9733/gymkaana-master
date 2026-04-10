const fs = require('fs');
async function run() {
    try {
        const r = await fetch('https://owner.gymkaana.com');
        const html = await r.text();
        const match = html.match(/src="(\/assets\/index-.*?.js)"/);
        console.log(match ? 'Found match: ' + match[1] : 'No match found');
        if (match) {
            const js = await fetch('https://owner.gymkaana.com' + match[1]);
            const script = await js.text();
            console.log('Has localhost:5000?', script.includes('localhost:5000'));
            console.log('Has api.gymkaana.com?', script.includes('api.gymkaana.com'));
        }
    } catch (e) {
        console.error(e);
    }
}
run();
