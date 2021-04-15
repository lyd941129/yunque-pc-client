export let moneyFormat = {
    methods:{
        // 金额格式化(num: 数值;bit: 保留位数)
        moneyFormat(num,bit){
            let money = Number(num) || 0;
            money = money.toFixed(bit || 2);
            money = parseFloat(money)
            money = money.toLocaleString();
            if(!money.split(".")[1]){
                money += ".00"
            }else if(money.split(".")[1].length === 1){
                money += "0"
            }
            
            return money;
        }
    }
}
