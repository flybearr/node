const bcrypt = require('bcryptjs');


(async () => {
    const h = await bcrypt.hash('13579', 8);
    console.log(h);
    const hashstr = '$2a$08$UgVq.l8GPYK5jYTR/kjRuuIgBKAgBMKmgmLipqcQOqGR9woRrHbuG';

    console.log(await bcrypt.compare('13579', hashstr));

})()

//   async function com() {
//     const h = await bcrypt.hash('13579', 8);
//     console.log(h);
//     const hashstr = '$2a$08$UgVq.l8GPYK5jYTR/kjRuuIgBKAgBMKmgmLipqcQOqGR9woRrHbuG';

//     console.log(await bcrypt.compare('13579', hashstr));
// }

// com();