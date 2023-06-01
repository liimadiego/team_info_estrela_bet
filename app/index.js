const teamInfo = require('./teamInfo');

(async function(){
    let cruzeiro_info = new teamInfo('Cruzeiro');
    console.log(await cruzeiro_info.proximoJogo())
})();