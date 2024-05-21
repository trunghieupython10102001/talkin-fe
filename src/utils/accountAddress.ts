export const trimMiddlePartAddress = (address: string, start: number = 4, end: number = 4) => {
  return `${address.substring(0, start)}...${address.substring(address.length - end, address.length)}`;
};
