'use strict';
// モジュールの呼び出し
const fs = require('fs');
const readline = require('readline');
// ストリーム作成
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({ input: rs, output: {} });
// key: 都道府県 value: 集計データのオブジェクト
const prefectureDataMap = new Map(); 

// rl オブジェクトで line というイベントが発生したら この無名関数を呼んでください
rl.on('line', lineString => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const popu = parseInt(columns[3]);
    if (year === 2010 || year === 2015){
        let value = prefectureDataMap.get(prefecture);
        if (!value){
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010){
            value.popu10 = popu;
        }
        if (year === 2015){
            value.popu15 = popu;
        }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on('close', () => {
    // 第一要素の key という変数にキーを、第二要素の value という変数に値を代入
    for (const [key, value] of prefectureDataMap){
        value.change = value.popu15 / value.popu10;
    }
    // 連想関数を普通の配列に変換 ?
    const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change;
    });
    //
    const rankingStrings = rankingArray.map(([key, value]) => {
        return (
            key + ':' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
        );
    });
    //console.log(rankingStrings);
    console.log(rankingArray);
});