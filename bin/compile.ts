import fs from 'fs';

export default function() {

    fs.mkdirSync('./.fluid/', { recursive: true });

    console.log('Completed!');
}