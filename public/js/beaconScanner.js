// public/js/beaconScanner.js

async function scanBLE(setFieldValue) {
    try {
      console.log("Requesting Bluetooth Device...");
      
      const options = {
        acceptAllAdvertisements: true,
      };
  
      const scan = await navigator.bluetooth.requestLEScan(options);
  
      navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
        console.log('> Advertisement received.');
        console.log('  Device Name: ' + event.device.name);
        console.log('  UUIDs:       ' + (event.uuids.join('\n') || 'N/A'));
  
        // Check for the specific UUID
        if (event.uuids.includes('2f234454-cf6d-4a0f-adf2-f4911ba9ffa6')) {
          // Assuming Major and Minor are part of the name or can be extracted somehow
          if (event.device.name.includes('1')) { // Simplified check
            setFieldValue('tableName', '1');
            console.log('> TableName set to 1');
            scan.stop(); // Stop scanning after finding the correct device
          }
        }
      });
  
      console.log('> Scan started');
    } catch (error) {
      console.error('Error:', error);
      toast.error("BLE scanning failed. Please try again.");
    }
  }
  
  document.addEventListener('DOMContentLoaded', (event) => {
    if (window.scanBeacon) {
      scanBeacon(window.scanBeacon);
    }
    if (window.scanBLE) {
      scanBLE(window.scanBLE);
    }
  });
  