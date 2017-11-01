/**
 * 紅茶をランダムに１種類洗濯します
 * @param {UserObject} Twitter の UserObject (将来追加予定
 * @return {object} 選択された紅茶のオブジェクト
 */
let teaList = [
  {name:'蓬(ヨモギ)', language_of: '[幸福][平和]', rarity: 1},
  {name:'仏の座(ホトケノザ)', language_of: '[調和]', rarity: 1},
  {name:'鬱金(ウコン)', language_of: '[乙女の香り]', rarity: 1},
  {name:'苧環(オダマキ)', language_of: '[断固として勝つ]', rarity: 1},
  {name:'勿忘草(ワスレナグサ)', language_of: '[誠の愛][真実の友情]', rarity: 1},
  {name:'金盞花(キンセンカ)', language_of: '[別れの悲しみ]', rarity: 1},
  {name:'翁草(オキナグサ)', language_of: '[告げられぬ恋]', rarity: 1},
  {name:'百日草(ヒャクニチソウ)', language_of: '[友への思い][絆]', rarity: 1},
  {name:'サルビア', language_of: '[家族愛][燃ゆる想い]', rarity: 1},
  {name:'岩蓮華(イワレンゲ)', language_of: '[勤勉]', rarity: 1},
  {name:'シクラメン', language_of: '赤い花は[嫉妬]、白い花は[清純]', rarity: 1},
  {name:'白蓮(ビャクレン)', language_of: '[威厳][高貴]', rarity: 1},
  {name:'紫露草(ムラサキツユクサ)', language_of: '[ひとときの幸せ]', rarity: 1},
  {name:'七竈(ナナカマド)', language_of: '[慎重][賢明]', rarity: 1},
  {name:'鷺草(サギソウ)', language_of: '[繊細][しんの強さ]', rarity: 1},
  {name:'実葛(サネカズラ)', language_of: '[再会]', rarity: 1},
  {name:'猿捕茨(サルトリイバラ)', language_of: '[不屈の精神]', rarity: 1},
  {name:'サンピタリア', language_of: '[愛の始まり]', rarity: 1},
  {name:'ジギタリス', language_of: '[熱愛]', rarity: 1},
  {name:'木香薔薇(モッコウバラ)', language_of: '[幼い頃の幸せな時間]', rarity: 1},
  {name:'秋の麒麟草(アキノキリンソウ)', language_of: '[警戒][要注意]', rarity: 1},
  {name:'アネモネ', language_of: '[恋の苦しみ][待望]', rarity: 1},
  {name:'アマドコロ', language_of: '[元気を出して]', rarity: 1},
  {name:'アマリリス', language_of: '[誇り][内気]', rarity: 1},
  {name:'アルストロメリア', language_of: '[未来への憧れ]', rarity: 1},
  {name:'アロエ', language_of: '[健康][万能]', rarity: 1},
  {name:'杏(アンズ)', language_of: '[はにかみ]', rarity: 1},
  {name:'銀杏(イチョウ)', language_of: '[長寿]', rarity: 1},
  {name:'一輪草(イチリンソウ)', language_of: '[追憶]', rarity: 1},
  {name:'岩団扇(イワウチワ)', language_of: '[春の使者]', rarity: 1},
  {name:'梅(ウメ)', language_of: '[高潔][上品]', rarity: 1},
  {name:'延齢草(エンレイソウ)', language_of: '[奥ゆかしい美しさ]', rarity: 1},
  {name:'大金鶏菊(オオキンケイギク)', language_of: '[きらびやか]', rarity: 1},
  {name:'オリーブ', language_of: '[平和][知恵]', rarity: 1},
  {name:'夾竹桃(キョウチクトウ)', language_of: '[用心][油断大敵]', rarity: 1},
  {name:'葛(クズ)', language_of: '[活力][芯の強さ]', rarity: 1},
  {name:'黒種草(クロタネソウ)', language_of: '[困惑][とまどい]', rarity: 1},
  {name:'君子蘭(クンシラン)', language_of: '[情け深い]', rarity: 1},
  {name:'鶏頭(ケイトウ)', language_of: '[おしゃれ][風変わり]', rarity: 1},
  {name:'小判草(コバンソウ)', language_of: '[興奮][熱狂]', rarity: 1},
  {name:'駒繋(コマツナギ)', language_of: '[希望をかなえる]', rarity: 1},
  {name:'山茶花(サザンカ)', language_of: '[ひたむきさ]', rarity: 1},
  {name:'薩摩芋(サツマイモ)', language_of: '[乙女の純情]', rarity: 1},
  {name:'桜(サクラ)', language_of: '[優れた美人]', rarity: 1},
  {name:'サフラン', language_of: '[節度ある態度]', rarity: 1},
  {name:'サボテン', language_of: '[偉大][暖かい心]', rarity: 1},
  {name:'山査子(サンザシ)', language_of: '[希望][成功を待つ]', rarity: 1},
  {name:'座禅草(ザゼンソウ)', language_of: '[ひっそりと待つ]', rarity: 1},
  {name:'紫紺野牡丹(シコンノボタン)', language_of: '[平静]', rarity: 1},
  {name:'サイネリア', language_of: '[常に喜びに満ちて]', rarity: 1},
  {name:'棕櫚(シュロ)', language_of: '[普遍の友情]', rarity: 1},
  {name:'数珠玉(ジュズダマ)', language_of: '[成し遂げられる思い]', rarity: 1},
  {name:'沈丁花(ジンチョウゲ)', language_of: '[不死][不滅]', rarity: 1},
  {name:'睡蓮(スイレン)', language_of: '[信頼][純情]', rarity: 1},
  {name:'杉(スギ)', language_of: '[雄大][堅固]', rarity: 1},
  {name:'芒(ススキ)', language_of: '[活力][精力]', rarity: 1},
  {name:'鈴蘭(スズラン)', language_of: '[幸福の再来]', rarity: 1},
  {name:'背高泡立草(セイタカアワダチソウ)', language_of: '[元気][生命力]', rarity: 1},
  {name:'セージ', language_of: '[幸福な家庭]', rarity: 1},
  {name:'蕎麦(ソバ)', language_of: '[喜びも悲しみも]', rarity: 1},
  {name:'泰山木(タイサンボク)', language_of: '[前途洋々]', rarity: 1},
  {name:'タイム', language_of: '[勇気][行動力がある]', rarity: 1},
  {name:'ツルバキア', language_of: '[落ち着きある魅力]', rarity: 1},
  {name:'天人菊(テンニンギク)', language_of: '[団結]', rarity: 1},
  {name:'唐辛子(トウガラシ)', language_of: '[旧友][嫉妬]', rarity: 1},
  {name:'ドクダミ', language_of: '[白い追憶][野生]', rarity: 1},

  {name:'ドラセナ', language_of: '[幸福]', rarity: 1},
  {name:'梨(ナシ)', language_of: '[博愛][愛情]', rarity: 1},
  {name:'ナスタチウム', language_of: '[愛国心][困難に打ち勝つ]', rarity: 1},
  {name:'茄子(ナス)', language_of: '[よい語らい][優美][希望]', rarity: 1},
  {name:'菜の花(ナノハナ)', language_of: '[快活な愛][小さな幸せ]', rarity: 1},
  {name:'南天(ナンテン)', language_of: '[機知に富む][良い家庭]', rarity: 1},
  {name:'南蛮煙管(ナンバンギセル)', language_of: '[物思い]', rarity: 1},
  {name:'ニオイアラセイトウ', language_of: '[愛情の絆][逆境にも変わらない愛]', rarity: 1},
  {name:'苦瓜(ニガウリ)', language_of: '[強壮]', rarity: 1},
  {name:'日々草(ニチニチソウ)', language_of: '[楽しい思い出]', rarity: 1},
  {name:'韮(ニラ)', language_of: '[多幸][星への願い]', rarity: 1},
  {name:'接骨木(ニワトコ)', language_of: '[熱心][熱中]', rarity: 1},
  {name:'人参[ニンジン]', language_of: '[幼い夢]', rarity: 1},
  {name:'白膠木(ヌルデ)', language_of: '[信仰]', rarity: 1},
  {name:'猫柳(ネコヤナギ)', language_of: '[努力が報われる][親切]', rarity: 1},
  {name:'捩花(ネジバナ)', language_of: '[思慕]', rarity: 1},
  {name:'合歓の木(ネムノキ)', language_of: '[歓喜][胸のときめき]', rarity: 1},

  {name:'鋸草(ノコギリソウ)', language_of: '[忠実][悲哀を慰める]', rarity: 1},
  {name:'野葡萄(ノブドウ)', language_of: '[慈悲][慈愛]', rarity: 1},
  {name:'野牡丹(ノボタン)', language_of: '[自然][平静]', rarity: 1},
  {name:'ハイビスカス', language_of: '[常に新しい愛][上品な美しさ]', rarity: 1},
  {name:'萩(ハギ)', language_of: '[思案][柔軟な精神]', rarity: 1},
  {name:'白菜(ハクサイ)', language_of: '[固い約束]', rarity: 1},
  {name:'母子草(ハナコグサ)', language_of: '[優しい人][永遠の思い]', rarity: 1},
  {name:'浜茄子(ハマナス)', language_of: '[見栄えの良さ][香り豊か]', rarity: 1},
  {name:'春車菊(ハルシャギク)', language_of: '[上機嫌][常に快活]', rarity: 1},


  {name:'柊(ヒイラギ)', language_of: '[先見の明][歓迎]', rarity: 1},
  {name:'雛菊(ヒナギク)', language_of: '[純潔][無意識][幸福]', rarity: 1},
  {name:'百日草(ヒャクニチソウ)', language_of: '[友への思い][絆]', rarity: 1},
  {name:'昼顔(ヒルガオ)', language_of: '[優しい笑顔][絆]', rarity: 1},
  {name:'風船唐綿(風船唐綿)', language_of: '[楽しい生活][隠された能力]', rarity: 1},



  {name:'蕗の薹(フキノトウ)', language_of: '[待望][愛嬌][真実はひとつ]', rarity: 1},
  {name:'藤袴(フジバカマ)', language_of: '[あの日を思い出す][優しい思い出]', rarity: 1},
  {name:'フリージア', language_of: '[親愛の情][あこがれ]', rarity: 1},

  {name:'葡萄(ブドウ)', language_of: '[思いやり][人間愛]', rarity: 1},
  {name:'プルメリア', language_of: '[恵まれた人][内気な乙女]', rarity: 1},
  {name:'ヘリオトロープ', language_of: '[献身的な愛][熱望]', rarity: 1},
  {name:'松葉菊(マツバギク)', language_of: '[心広い愛情][愛国心]', rarity: 1},

  {name:'八重桜(ヤエザクラ)', language_of: '[理知に富んだ教育]', rarity: 1},
  {name:'山吹草(ヤマブキソウ)', language_of: '[すがすがしい明るさ]', rarity: 1},

  {name:'雪柳(ユキヤナギ)', language_of: '[愛嬌][気まま][自由][殊勝]', rarity: 1},
  {name:'柚子(ユズ)', language_of: '[健康美][恋のため息]', rarity: 1},
  {name:'百合(ユリ)', language_of: '[威厳][純潔][無垢]', rarity: 1},
  {name:'鬼百合(オニユリ)', language_of: '[荘厳][富と誇り]', rarity: 1},
  {name:'笹百合(ササユリ)', language_of: '[清浄と上品]', rarity: 1},
  {name:'山百合(ヤマユリ)', language_of: '[純潔][荘厳]', rarity: 1},
  {name:'連翹(レンギョウ)', language_of: '[かなえられた希望][集中力]', rarity: 1},
  {name:'山葵(ワサビ)', language_of: '[目覚め][嬉し涙]', rarity: 1},
  {name:'侘助(ワビスケ)', language_of: '[静かなおもむき][簡素]', rarity: 1},
  {name:'ブーゲンビリア', language_of: '[あなたしか見えない]', rarity: 3},
  {name:'薺(ナズナ)', language_of: '[すべてを捧げます]', rarity: 3},
  {name:'杜鵑草(ホトトギス)', language_of: '[永遠にあなたのもの]', rarity: 3},
  {name:'ジギタリス', language_of: '[隠しきれない恋]', rarity: 3},
  {name:'花水木(ハナミズキ)', language_of: '[私の想いを受けとめて]', rarity: 3},
  {name:'桃(モモ)', language_of: '[あなたに夢中][チャーミング]', rarity: 3},
  {name:'ペンステモン', language_of: '[あなたに見とれています]', rarity: 3},
  {name:'パンジー', language_of: '[純愛][私を想って]', rarity: 3},
  {name:'ストック', language_of: '[豊かな愛][永遠の恋]', rarity: 3},
  {name:'胡蝶蘭(コチョウラン)', language_of: '[あなたを愛しています]', rarity: 3},
  {name:'アザレア', language_of: '[あなたに愛される幸せ]', rarity: 3},
  {name:'スターチス', language_of: '[永遠に変わらない心]', rarity: 3},
  {name:'アザレア', language_of: '[愛されることを知った喜び]', rarity: 3},
  {name:'アングレカム', language_of: '[いつまでもあなたと一緒]', rarity: 3},
  {name:'錨草(イカリソウ)', language_of: '[君を離さない]', rarity: 3},
  {name:'蝦夷菊(エゾギク)', language_of: '[私を信じてください]', rarity: 3},
  {name:'エンゼルランプ', language_of: '[あなたを守りたい]', rarity: 3},
  {name:'オレンジ', language_of: '[花嫁の喜び]', rarity: 3},
  {name:'海棠(カイドウ)', language_of: '[温和][妖艶]', rarity: 3},
  {name:'カミツレ', language_of: '[逆境の中の活力][仲直り]', rarity: 3},
  {name:'カルミア', language_of: '[大志を抱く][野心]', rarity: 3},
  {name:'枯葉(カレハ)', language_of: '[新春を待つ]', rarity: 3},
  {name:'蒲(ガマ)', language_of: '[従順][素直]', rarity: 3},
  {name:'月下美人(ゲッカビジン)', language_of: '[ただ一度だけ会いたくて]', rarity: 3},
  {name:'鷺草(サギソウ)', language_of: '[神秘][夢でもあなたを想う]', rarity: 3},
  {name:'酔仙翁(スイセンノウ)', language_of: '[いつも愛して]', rarity: 3},
  {name:'千日紅(センニチコウ)', language_of: '[変わらない愛情を永遠に]', rarity: 3},
  {name:'蓮華草(レンゲソウ)', language_of: '[私の苦しみを和らげる]', rarity: 3},
  {name:'ラナンキュラス', language_of: '[晴れやかな魅力][あなたは魅力に満ちている]', rarity: 3},
  {name:'ラベンダー', language_of: '[あなたを待っています][私に答えて下さい][疑い]', rarity: 3},
  {name:'立金花(リュウキンカ)', language_of: '[かならず来る幸福]', rarity: 3},
  {name:'ルピナス', language_of: '[いつも幸せ][あなたは私の心に安らぎを与える]', rarity: 3},
  {name:'紫露草(ムラサキツユクサ)', language_of: '[尊敬しています][ひとときの幸せ]', rarity: 3},
  {name:'木香薔薇(モッコウバラ)', language_of: '[あなたにふさわしい人][初恋]', rarity: 3},
  {name:'麦藁菊(ムギワラギク)', language_of: '[いつも覚えていたい][永遠の記憶]', rarity: 3},
  {name:'紫華鬘(ムラサキケマン)', language_of: '[あなたの助けになる][助力][喜び]', rarity: 3},
  {name:'菩提樹(ボダイジュ)', language_of: '[熱愛][夫婦の愛]', rarity: 3},
  {name:'ベラドンナ・リリー', language_of: '[ありのままの私を見て]', rarity: 3},
  {name:'ペチュニア', language_of: '[あなたと一緒なら心が和らぐ]', rarity: 3},
  {name:'ヒマラヤスギ', language_of: '[たくましさ][あなたのために生きる]', rarity: 3},
  {name:'向日葵(ヒマワリ)', language_of: '[私の目はあなただけを見つめる]', rarity: 3},
  {name:'華麒麟(ハナキリン)', language_of: '[冷たくしないで][逆境に耐える]', rarity: 3},
  {name:'花菖蒲(ハナショウブ)', language_of: '[うれしい知らせ][あなたを信じる]', rarity: 3},
  {name:'花菱草(バナビシソウ)', language_of: '[私の希望を入れて下さい][私を拒絶しないで]', rarity: 3},
  {name:'野薊(ノアザミ)', language_of: '[私をもっと知ってください]', rarity: 3},
  {name:'薺(ナズナ)', language_of: '[すべてを捧げます]', rarity: 3},
  {name:'七竈(ナナカマド)', language_of: '[私と一緒にいれば安心]', rarity: 3},
  {name:'真弓(マユミ)', language_of: '[あなたの魅力を心に刻む]', rarity: 3},
  {name:'錦木(ニシキギ)', language_of: '[あなたの魅力を心に刻む]', rarity: 3},



  //バラ
  {name:'薔薇(バラ)〔帯紅〕', language_of: '[私を射止めて！]', rarity: 3},
  {name:'薔薇(バラ)〔赤〕', language_of: '[愛情][情熱]', rarity: 3},
  {name:'薔薇(バラ)〔白〕', language_of: '[尊敬][私はあなたに相応しい]', rarity: 3},
  {name:'薔薇(バラ)〔ピンク〕', language_of: '[上品][愛を持つ]', rarity: 3},
  {name:'薔薇(バラ)〔薄オレンジ〕', language_of: '[無邪気][さわやか]', rarity: 3},
  {name:'薔薇(バラ)〔青〕', language_of: '[神の祝福][奇跡]', rarity: 3},
  {name:'パセリ', language_of: '[役に立つ知識][勝利][祝祭]', rarity: 3},

  //ヒヤシンス
  {name:'ヒヤシンス〔ピンク〕', language_of: '[しとやかな可愛らしさ]', rarity: 3},
  {name:'ヒヤシンス〔白〕', language_of: '[心静かな愛][控えめな愛らしさ]', rarity: 3},
  {name:'ヒヤシンス〔紫〕', language_of: '[初恋のひたむきさ]', rarity: 3},
  {name:'ヒヤシンス〔黄〕', language_of: '[勝負][あなたとなら幸せ]', rarity: 3},

  //★レア クローバー
  {name:'★四つ葉のクローバー', language_of: '[幸運][私のものになって]', rarity: 5},
  {name:'クローバー', language_of: '[復讐][約束][勤勉]など', rarity: 4},

  //★レア オリエンタルポピー
  {name:'★オリエンタルポピー', language_of: '[女の盛りは、40過ぎからよっ！]', rarity: 5},
  {name:'ポピー', language_of: '[いたわり][陽気で優しい]', rarity: 4},

  //★レア スノードロップ
  {name:'★スノードロップ', language_of: '[去年の恋の名残りの涙]', rarity: 5},
  {name:'スノードロップ', language_of: '[希望][慰め]', rarity: 4},

  //★レア ジョンソンズブルー
  {name:'★ジョンソンズブルー', language_of: '[大天使ガブリエルの哀しいあやまち]', rarity: 5},
  {name:'風露草(フウロソウ)', language_of: '[変わらぬ信頼]', rarity: 4},

  //★レア ユーフォルビア
  {name:'★ユーフォルビア', language_of: '[乙女の祈り]', rarity: 5},
  {name:'野漆(ノウルシ)', language_of: '[控えめ][地味]', rarity: 4},

  //★レア フロックスオーレライ
  {name:'★フロックスローレライ', language_of: '[妖精たちの新盆の迎え火]', rarity: 5},
  {name:'花魁草(オイランソウ)', language_of: '[あなたの望みを受けます][協調]', rarity: 4},

  //★レア バーベナ・ハクタタ・ピンクスピアーズ
  {name:'★バーベナ・ハクタタ・ピンクスピアーズ', language_of: '[どうせあたいは田舎者、街の女にゃなれないの]', rarity: 5},
  {name:'バーベナ', language_of: '[家族の和合][魅了する]', rarity: 4},

  {name:'山査子(サンザシ)', language_of: '[ただ一つの恋]', rarity: 2},
  {name:'チューリップ', language_of: '[恋の宣言][博愛]', rarity: 2},
  {name:'玉簾(タマスダレ)', language_of: '[汚れなき愛]', rarity: 2},
  {name:'椿(ツバキ)', language_of: '[理想の愛]', rarity: 2},
  {name:'マーガレット', language_of: '[心に秘めた愛][恋を占う]', rarity: 2},
  {name:'禊萩(ミソハギ)', language_of: '[愛の悲しみ][純真な愛情]', rarity: 2},
  {name:'桔梗(キキョウ)', language_of: '[変わらぬ愛]', rarity: 2},
  {name:'待宵草(マツヨイグサ)', language_of: '[ほのかな恋]', rarity: 2},
  {name:'アカシア', language_of: '[秘密の愛]', rarity: 2},
  {name:'アガパンサス', language_of: '[恋の訪れ]', rarity: 2},
  {name:'木通(アケビ)', language_of: '[才能][唯一の恋]', rarity: 2},
  {name:'色待宵草(イロマツヨイグサ)', language_of: '[静かな喜び]', rarity: 2},
  {name:'花梨(カリン)', language_of: '[努力][唯一の恋]', rarity: 2},
  {name:'黄菖蒲(キショウブ)', language_of: '[私は燃えている]', rarity: 2},
  {name:'コリウス', language_of: '[恋の望み]', rarity: 2},
  {name:'エーデルワイス', language_of: '[大切な思い出]', rarity: 2},
  {name:'朝顔(アサガオ)', language_of: '[短い愛][はかない恋]', rarity: 2},
  {name:'サンピタリア', language_of: '[切なる喜び][愛の始まり]', rarity: 2},
  {name:'芍薬(シャクヤク)', language_of: '[はにかみ][恥じらい]', rarity: 2},
  {name:'シンビジウム', language_of: '[華やかな恋][飾らない心]', rarity: 2},
  {name:'吸葛(スイカズラ)', language_of: '[愛のきずな]', rarity: 2},
  {name:'菫(スミレ)', language_of: '[小さな愛][誠実]', rarity: 2},
  {name:'蒲公英(タンポポ)', language_of: '[真心の愛]', rarity: 2},
  {name:'デュランタ', language_of: '[あなたを見守る]', rarity: 2},
  {name:'吾亦紅(ワレモコウ)', language_of: '[愛慕][変化]', rarity: 2},
  {name:'ロベリア', language_of: '[いつも愛らしい][謙遜]', rarity: 2},
  {name:'レモン', language_of: '[心からの思慕][誠実な愛]', rarity: 2},
  {name:'都忘れ(ミヤコワスレ)', language_of: '[しばしの憩い][短い恋]', rarity: 2},
  {name:'水芭蕉(ミズバショウ)', language_of: '[美しい思い出][変わらぬ美しさ]', rarity: 2},
  {name:'三椏(ミツマタ)', language_of: '[意外な思い][永遠の愛]', rarity: 2},
  {name:'待宵草(マツヨイグサ)', language_of: '[ほのかな恋][浴後の美人]', rarity: 2},
  {name:'ポインセチア', language_of: '[私の心は燃えている]', rarity: 2},
  {name:'布袋葵(ホテイアオイ)', language_of: '[恋の愉しみ][恋の悲しみ]', rarity: 2},
  {name:'ヒメアンスリウム', language_of: '[粋でかわいい]', rarity: 2},
  {name:'葉牡丹(ハボタン)', language_of: '[物事に動じない][愛を包む]', rarity: 2},
  {name:'野薔薇(ノバラ)', language_of: '[素朴な愛][才能]', rarity: 2},
  {name:'凌霄花(ノウゼンカズラ)', language_of: '[華のある人生][愛らしい]', rarity: 2},
  {name:'ネモフィラ', language_of: '[どこでも成功][可憐][私はあなたを許す]', rarity: 2},
  {name:'ネリネ', language_of: '[また会う日を楽しみに][幸せな思い出]', rarity: 2},
  {name:'庭石菖(ニワゼキショウ)', language_of: '[繁栄][豊かな感情]', rarity: 2},
  {name:'日本桜草(ニホンサクラソウ)', language_of: '[初恋][純潔]', rarity: 2},
  {name:'ニセアカシア', language_of: '[慕情][友情][頼られる人]', rarity: 2},
  {name:'撫子(ナデシコ)', language_of: '[純愛][大胆][勇敢]', rarity: 2},
  {name:'匂い菫(ニオイスミレ)', language_of: '[秘密の愛][高尚][控えた美しさ]', rarity: 2},
]

module.exports = function selectTea(user) {
  let choice = Math.abs(randomChoice(user)) % teaList.length 
  return teaList[choice]
}

/**
 * ユーザIDと今日の日付をシードとし、乱数を生成します。
 * @param {number} -2^31 〜 2^31-1 の乱数
 */
let randomChoice = (user) => {
  let x = 163981341
  let y = 398398398
  let z = 134134116  
  let w = user.id_str.substr(-9) * 1 ^ ( new Date().getTime()/86400000|0)
  let t

  // XorShift
  t = x ^ (x << 11)
  x = y; y = z; z = w
  return (w ^ (w >>> 19)) ^ (t ^ (t >>> 8))
}
