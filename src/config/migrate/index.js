import { count as count1, migrate as migrate1 } from './01';
import { count as count2, migrate as migrate2 } from './02';

export default function() {
  return {
    count: count1() + count2(),
    async migrate() {
      await migrate1();
      await migrate2();
    },
  };
}
