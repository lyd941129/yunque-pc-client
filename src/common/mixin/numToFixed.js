export let numToFixed = {
    methods:{
        /**
         * @description 保留小数点后2位, 非0的有多少保留多少;
         * @param {boolean} data 需要操作的数值
         * @param {boolean} val 小数点限制的位数
         * @param {boolean} flag  是否需要四舍五入, 1,代表不需要四舍五入,  不传或者为其他 则 需要四舍五入  默认 需要
         * @returns 返回str
         */
        numToFixed(data, val, flag) {
            flag = flag == 1 ? false : true;
            var numbers = ''; // 
            var n = parseInt(val) == 0 ? 0 : parseInt(val) || 2; // 保留几位小数后面添加几个0 
            for (var i = 0; i < n; i++) {
                numbers += '0';
            }

            var s = 1 + numbers; // 如果是整数需要添加后面的0 
            var spot = n == 0 ? "" : "." + numbers; // Math.round四舍五入  //  parseFloat() 函数可解析一个字符串，并返回一个浮点数。 
            var value = flag ? Math.round(parseFloat(data) * s) / s : Math.floor(data * s) / s; // 从小数点后面进行分割 
            var d = value.toString().split(".");
            if (d.length == 1) {
                value = value.toString() + spot;
                return value;
            }
            if (d.length > 1) {
                var pointLength = numbers.length - d[1].length;
                if (pointLength) {
                    for (var k = 0; k < pointLength; k++) {
                        value = value.toString() + "0";
                    }
                }
                return value;
            }
        }
    }
}
