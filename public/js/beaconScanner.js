async function scanBLE(setFieldValue) {
    try {
      console.log("Requesting Bluetooth Device...");
  
      const options = {
        acceptAllAdvertisements: true,
      };
  
      // Yêu cầu quyền truy cập vị trí (nếu cần thiết cho BLE)
      if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser.");
        alert("Geolocation is not supported by your browser.");
        return;
      }
  
      navigator.geolocation.getCurrentPosition(async () => {
        try {
          const scan = await navigator.bluetooth.requestLEScan(options);
  
          navigator.bluetooth.addEventListener('advertisementreceived', (event) => {
            console.log('> Advertisement received.');
            console.log('  Device Name: ' + event.device.name);
            console.log('  UUIDs:       ' + (event.uuids.join('\n') || 'N/A'));
  
            // Kiểm tra UUID, Major, và Minor
            const targetUUID = '2f234454-cf6d-4a0f-adf2-f4911ba9ffa6';
            const major = 1;
            const minor = 1;
  
            if (event.uuids.includes(targetUUID)) {
              if (event.device.name.includes(`${major}-${minor}`)) { // Giả định Major-Minor có trong tên thiết bị
                setFieldValue('tableName', `${major}`);
                console.log(`> TableName set to ${major}`);
                scan.stop(); // Dừng quét sau khi tìm thấy thiết bị
              }
            }
          });
  
          console.log('> Scan started');
        } catch (error) {
          console.error('Error:', error);
          alert("BLE scanning failed. Please try again.");
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        alert("Geolocation permission denied.");
      });
  
    } catch (error) {
      console.error('Error:', error);
      alert("BLE scanning failed. Please try again.");
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
  