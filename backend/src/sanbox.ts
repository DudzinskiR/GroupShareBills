const tab: { [key: string]: number } = {};

for (let i = 0; i < 10; i++) {
  tab[i] = 0;
}

for (let i = 0; i < 1000000; i++) {
  const rand = Math.floor(Math.random() * 1000000);
  const str = rand.toString();

  tab[str[0]]++;
}

for (let i = 1; i < 10; i++) {
  console.log(`${i} - ${tab[i]} - ${(tab[i] / 1000000) * 100}`);
}
