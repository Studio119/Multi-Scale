const axios = require('axios');
const fs = require('fs');

const main = (adcode=100000) => {
    if (adcode % 10) {
        return;
    }

    console.info(`Getting adcode ${ adcode }`);

    axios.get(`https://geo.datav.aliyun.com/areas_v2/bound/${ adcode }_full.json`).then(
        prmsRes => {
            const nodes = prmsRes.data.features.map(feature => {
                return {
                    adcode: parseInt(feature.properties.adcode),
                    name: feature.properties.name,
                    level: feature.properties.level,
                    geometry: feature.geometry
                };
            });

            fs.writeFileSync(`./china_${ adcode }.json`, JSON.stringify(nodes));

            nodes.forEach(node => {
                main(node.adcode);
            });
        }
    ).catch(
        err => {
            console.error(`Error occurred when getting adcode ${ adcode }: `, err);
        }
    );
};

main();
