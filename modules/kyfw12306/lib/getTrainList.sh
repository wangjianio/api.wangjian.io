wget --no-check-certificate -a wget.log -O train_list.json https://kyfw.12306.cn/otn/resources/js/query/train_list.js?scriptVersion=1.0;
sed -i '' 's/^var train_list =//1' train_list.json;