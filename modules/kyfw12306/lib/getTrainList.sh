wget --no-check-certificate -a wget.log -O train_list.json https://kyfw.12306.cn/otn/resources/js/query/train_list.js?scriptVersion=1.0;

# Linux
sed -i 's/^var train_list =//1' train_list.json;
sed -i 's/2017-/2018-/g' train_list.json;

# Mac
# sed -i '' 's/^var train_list =//1' train_list.json;
# sed -i '' 's/2017-/2018-/g' train_list.json;