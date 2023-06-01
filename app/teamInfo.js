module.exports = class teamInfo{
    constructor(team){
        this.team = team
    }

    async proximoJogo(headless = true){

        const puppeteer = require('puppeteer');

        console.log('Abrindo navegador')
        
        const browser = await puppeteer.launch({
            headless: headless
        });
    
        const page = await browser.newPage();
        
        await page.setViewport({width: 1920, height: 1080});
        console.log('Acessando EstrelaBet')
        const page_link = 'https://estrelabet.com/ptb/bet/detail-search';
    
        await page.goto(page_link);
    
        console.log('Aguardando navegador')
    
        await page.waitForTimeout(20000);
    
        const dropSelectSportype = '#dropSelectSportype > li:nth-child(1) > a';
        await page.waitForSelector(dropSelectSportype);
    
        console.log('Selecionando filtros')
    
        await page.evaluate(() => {
            document.querySelector('#dropSelectSportype > li:nth-child(1) > a').click()
        });
        
        await page.waitForTimeout(2000);
    
        const bra_seletor = '#BRA';
        await page.waitForSelector(bra_seletor);
    
        await page.evaluate(() => {
            document.querySelector('#BRA').click()
        })
        
        await page.waitForTimeout(4000);
    
        await page.evaluate(() => {
            document.querySelector('#container-main > fixture-detail-search > div > div.srch-option > div.row > div:nth-child(6) > a').click()
        })
        
        console.log('Aguardando pesquisa')
    
        const searchResultSelector = '.modul-accordion ~ .ng-star-inserted';
        await page.waitForSelector(searchResultSelector);
        await page.waitForTimeout(2000);
        
        let game_info = await page.evaluate(() => {
            let game_information = [];
            document.querySelectorAll('#container-main > fixture-detail-search > div > .modul-accordion').forEach(e => {
                let current_data = e.querySelector('.header-text').textContent;
                e.querySelectorAll('.fixture-body').forEach(subE => {
    
                    let unique_game = [];
                    unique_game.push(subE.querySelector('.date').textContent)
                    subE.querySelectorAll('.team-name').forEach(team => {
                        unique_game.push(team.textContent)
                    })
                     Array.from(subE.querySelectorAll('.bet-type a')).slice(0, 3).forEach(odds => {
                        unique_game.push(odds.querySelector('.bet-btn-odd').textContent)
                        unique_game.push(odds.querySelector('.bet-btn-text').textContent)
                    })
                    unique_game.push(current_data)
                    game_information.push(unique_game)
                })
            })
    
            return game_information.map(el => {
                return {
                    horario: el[0],
                    time_um: el[1],
                    time_dois: el[2],
                    vitoria_time_um: el[3],
                    empate: el[5],
                    vitoria_time_dois: el[7],
                    data_jogo: el[9]
                }
            });
        })
    
        console.log('Organizando dados')
    
        let result = []
    
        game_info.forEach(el => {
            if(el.time_um.trim() == this.team && !result.length){
                result.push({
                    time_selecionado : el.time_um.trim(),
                    time_contra : el.time_dois.trim(),
                    data : el.data_jogo.trim(),
                    horario : el.horario.trim(),
                    odds : {
                        vitoria : el.vitoria_time_um.trim(),
                        empate : el.empate.trim(),
                        derrota : el.vitoria_time_dois.trim()
                    }
                })
            }else if(el.time_dois.trim() == this.team && !result.length){
                result.push({
                    time_selecionado : el.time_dois.trim(),
                    time_contra : el.time_um.trim(),
                    data : el.data_jogo.trim(),
                    horario : el.horario.trim(),
                    odds : {
                        vitoria : el.vitoria_time_dois.trim(),
                        empate : el.empate.trim(),
                        derrota : el.vitoria_time_um.trim()
                    }
                })
            }
        });
    
        await page.waitForTimeout(3000)
    
        console.log('Finalizando')

        await browser.close();

        return result;
        
    } 
}