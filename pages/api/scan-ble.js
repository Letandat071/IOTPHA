import noble from 'noble';

export default function handler(req, res) {
    try{
        if (req.method === 'POST') {
            noble.on('stateChange', async (state) => {
              if (state === 'poweredOn') {
                noble.startScanning([], true);
              } else {
                noble.stopScanning();
              }
            });
        
            noble.on('discover', (peripheral) => {
              const { uuid, advertisement, id } = peripheral;
              const { localName, manufacturerData, serviceData, serviceUuids } = advertisement;
        
              // Check if the discovered beacon matches the desired UUID, Major, and Minor
              if (
                uuid === '2f234454cf6d4a0fadf2f4911ba9ffa6' &&
                peripheral.advertisement.serviceData.some(
                  (data) => data.uuid === '2f234454-cf6d-4a0f-adf2-f4911ba9ffa6' &&
                  data.data.readUInt16BE(0) === 1 &&  // Major
                  data.data.readUInt16BE(2) === 1    // Minor
                )
              ) {
                // Stop scanning once the desired beacon is found
                noble.stopScanning();
                res.status(200).json({ tableName: '1' });
              }
            });
        
            // Timeout the scanning process after 30 seconds if no beacon is found
            setTimeout(() => {
              noble.stopScanning();
              res.status(408).json({ error: 'Beacon not found' });
            }, 30000);
          } else {
            res.status(405).json({ error: 'Method not allowed' });
          }
    } catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
  
}
