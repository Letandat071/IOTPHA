export const requestBluetoothPermissions = async () => {
    if (!navigator.bluetooth) {
      throw new Error('Bluetooth is not supported on this device.');
    }
  
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['battery_service'] }],
      });
      return device;
    } catch (error) {
      throw new Error('Bluetooth permission denied.');
    }
  };
  