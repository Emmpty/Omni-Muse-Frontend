import dayjs from 'dayjs';

export const formatAddress = (address?: string) => {
  if (!address) {
    return '';
  }
  if (address.includes('.eth')) {
    return address;
  }
  return address.slice(0, 5) + '...' + address.slice(-4);
};

export const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
};

export const formatTimestamp = (time: string) => {
  if (!time) {
    return '';
  }
  const value = Number(time) * 1000;
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};
