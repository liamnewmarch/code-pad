import one from './01';
import two from './02';

const migrations = [
  one,
  two,
];

export async function migrate() {
  try {
    for (const migration of migrations) {
      migration();
    }
  } catch ({ message }) {
    console.log(`Error migrating data: ${message}`);
  }
}
