import fs from 'fs';
import { DIST_ROOT } from './const';

export default async function () {

    // const entry = fs.readFileSync(DIST_ROOT + 'index.js', { encoding: 'ascii' });
    
    // fs.writeFileSync(DIST_ROOT + 'index.js', entry.replace(/(from\s*(?:'|"))\.\/(.*?(?:'|");)/g, '$1../compiled/$2')); // WIP

    console.log('Unlinked components\n');
}