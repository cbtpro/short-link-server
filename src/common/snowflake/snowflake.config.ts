export const SnowflakeConfig = {
  datacenterId: Number(process.env.DATACENTER_ID || 1),
  machineId: Number(process.env.MACHINE_ID || 1),
};
