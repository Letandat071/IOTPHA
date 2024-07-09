// public/js/beaconScanner.js

async function scanBeacon(setFieldValue) {
    try {
      console.log("Requesting Bluetooth Device...");
      const options = {
        filters: [
          {
            services: ['battery_service'],
          },
        ],
      };
  
      const device = await navigator.bluetooth.requestDevice(options);
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('battery_service');
      const characteristic = await service.getCharacteristic('battery_level');
  
      console.log('> Bluetooth Device connected:', device.name);
      console.log('> GATT Server connected:', server.connected);
  
      characteristic.addEventListener('characteristicvaluechanged', (event) => {
        let value = event.target.value;
        console.log('> Battery level:', value.getUint8(0));
        // Add logic to handle beacon detection
        // For example, if it matches your UUID, Major, Minor, then:
        if (device.name.includes('2f234454-cf6d-4a0f-adf2-f4911ba9ffa6')) {
          setFieldValue('tableName', '1');
        }
      });
  
      await characteristic.startNotifications();
      console.log('> Notifications started');
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  async function scanBLE(setFieldValue) {
    try {
      console.log("Requesting Bluetooth Device...");
      const options = {
        acceptAllAdvertisements: true,
      };
  
      const device = await navigator.bluetooth.requestLEScan(options);
  
      navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
        console.log('> Advertisement received.');
        console.log('  Device Name: ' + event.device.name);
        console.log('  UUIDs:       ' + event.uuids.join('\n') || 'N/A');
  
        // Check for the specific UUID, Major, and Minor values
        if (event.uuids.includes('2f234454-cf6d-4a0f-adf2-f4911ba9ffa6')) {
          // Assuming Major and Minor are part of the name or can be extracted somehow
          if (event.device.name.includes('1')) { // Simplified check
            setFieldValue('tableName', '1');
            device.stop();
          }
        }
      });
  
      console.log('> Scan started');
    } catch (error) {
      console.error('Error:', error);
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
  