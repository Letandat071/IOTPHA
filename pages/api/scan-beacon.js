import BeaconScanner from 'node-beacon-scanner';

export default async (req, res) => {
  if (req.method === 'GET') {
    try {
      const scanner = new BeaconScanner();
      scanner.onadvertisement = (ad) => {
        const { uuid, major, minor } = ad.iBeacon;
        if (uuid === '2f234454-cf6d-4a0f-adf2-f4911ba9ffa6' && major === 1 && minor === 1) {
          res.status(200).json({ tableName: '1' });
        }
      };

      await scanner.startScan();
      console.log('Started to scan.');
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Beacon scan failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
};
