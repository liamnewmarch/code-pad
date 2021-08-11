import * as m1 from './01';
import * as m2 from './02';

export default function() {
  return {
    count: m1.count() + m2.count(),
    async migrate() {
      await m1.migrate();
      await m2.migrate();
    },
  };
}
