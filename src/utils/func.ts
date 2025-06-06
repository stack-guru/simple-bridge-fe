

export function shrinkAddress(address: string, length = 4): string {
  if (!address) return "";
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
}

export function airdrop() {
  const pk = import.meta.env.VITE_USDT_OWNER_PK;
  console.log('pk = ', pk);
}