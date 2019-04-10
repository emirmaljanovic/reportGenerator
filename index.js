const admin = require('firebase-admin');
const serviceAccount = require('./config/firebase.json');

// Libs
const generateChart = require('./lib/chartGenerator');

// Chart configs
const areaChartSpec = require('./config/area-chart.json');
const lineChartSpec = require('./config/line-chart.json');

const queryData = () => {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://twitchsniffer-25e09.firebaseio.com'
  });

  const rootRef = admin.database().ref('streams');

  rootRef.on('value', (snapshot) => {
    if (!snapshot) { return; }

    const data = snapshot.val();
    const values = [];

    for (const property in data) {
      const { timestamp, viewers } = data[property];
      values.push({ timestamp, viewers });
    }

    lineChartSpec.data[0].values = values;

    generateChart(lineChartSpec);

    admin.app().delete();
  }, (errorObject) => {
    console.log('The read failed:', errorObject.code);
  });
};

queryData();