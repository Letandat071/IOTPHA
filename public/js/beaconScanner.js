// public/js/beaconScanner.js

(function() {
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
          
          if (!navigator.bluetooth) {
            throw new Error("Bluetooth not supported");
          }
    
          if (!navigator.bluetooth.requestLEScan) {
            throw new Error("Bluetooth Low Energy scanning not supported");
          }
    
          const options = {
            acceptAllAdvertisements: true,
          };
      
          const scan = await navigator.bluetooth.requestLEScan(options);
      
          navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
            console.log('> Advertisement received.');
            console.log('  Device Name: ' + event.device.name);
            console.log('  Device ID: ' + event.device.id);
            console.log('  RSSI: ' + event.rssi);
            console.log('  TX Power: ' + event.txPower);
            console.log('  UUIDs: ' + event.uuids);
      
            // Parse manufacturer data to get iBeacon data
            if (event.manufacturerData) {
              const manufacturerData = new Uint8Array(event.manufacturerData.get(0x004C));
              if (manufacturerData && manufacturerData.length >= 23) {
                const uuid = Array.from(manufacturerData.slice(2, 18))
                  .map(b => b.toString(16).padStart(2, '0'))
                  .join('');
                const major = (manufacturerData[18] << 8) | manufacturerData[19];
                const minor = (manufacturerData[20] << 8) | manufacturerData[21];
      
                console.log('  UUID: ' + uuid);
                console.log('  Major: ' + major);
                console.log('  Minor: ' + minor);
      
                if (uuid === '2f234454cf6d4a0fadf2f4911ba9ffa6' && major === 1 && minor === 1) {
                  setFieldValue('tableName', '1');
                  scan.stop();
                }
              }
            }
          });
      
          console.log('> Scan started');
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
      
      // Chỉ thực hiện khi đang ở môi trường browser
      if (typeof window !== 'undefined') {
        // Expose functions to global scope
        window.scanBeacon = scanBeacon;
        window.scanBLE = scanBLE;
      }
    })();