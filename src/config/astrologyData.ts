/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TarotCard } from '../types';

export const TAROT_DECK: TarotCard[] = [
  {
    id: "0_fool",
    name: "愚者 (The Fool)",
    type: "major",
    uprightMeaning: "展開新局、天真爛漫、無畏冒險、傾聽內心直覺與信任宇宙安排。",
    reversedMeaning: "草率決定、不負責任、過度冒險、逃避現實或缺乏周全規劃。",
    imageUrl: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂡"
  },
  {
    id: "1_magician",
    name: "魔術師 (The Magician)",
    type: "major",
    uprightMeaning: "無限創造力、專注實踐、資源充沛、掌握純熟技能與展現強大個人魅力。",
    reversedMeaning: "意志分散、能力未發揮、心機欺瞞、投機取巧或缺乏行動方向。",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂢"
  },
  {
    id: "2_high_priestess",
    name: "女祭司 (The High Priestess)",
    type: "major",
    uprightMeaning: "直覺敏銳、潛意識覺醒、內斂智慧、尋求心靈平靜與探索隱秘世界。",
    reversedMeaning: "忽視直覺、過度理性、情緒壓抑、表面化交往或內心秘密外流。",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂣"
  },
  {
    id: "3_empress",
    name: "皇后 (The Empress)",
    type: "major",
    uprightMeaning: "豐盛富足、母性關懷、大自然生長、感官享受、藝術靈感與生命豐收。",
    reversedMeaning: "創造力阻滯、過度保護、物質主義、自我懷疑、資源浪費或情感窒息。",
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂤"
  },
  {
    id: "4_emperor",
    name: "皇帝 (The Emperor)",
    type: "major",
    uprightMeaning: "權威秩序、自我克制、建立結構、強大意志力、父親形象與領袖風範。",
    reversedMeaning: "專制暴虐、控制狂、缺乏紀律、權力動搖、行事古板或推卸責任。",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂥"
  },
  {
    id: "5_hierophant",
    name: "教皇 (The Hierophant)",
    type: "major",
    uprightMeaning: "傳統智慧、心靈導師、道德禮制、體系依歸、尋求認可與學習精神真理。",
    reversedMeaning: "挑戰傳統、教條主義、盲目服從、流言蜚語、被錯誤引導或堅持己見。",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂦"
  },
  {
    id: "6_lovers",
    name: "戀人 (The Lovers)",
    type: "major",
    uprightMeaning: "和諧結合、深層默契、價值抉擇、關係建立、吸引力吸引與內在平衡。",
    reversedMeaning: "關係失和、抉擇瓶頸、理念動搖、缺乏承諾、遇事逃避或逃避情感連結。",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂧"
  },
  {
    id: "7_chariot",
    name: "戰車 (The Chariot)",
    type: "major",
    uprightMeaning: "意志掌控、奮勇向前、克服阻礙、迅速勝利、自律自製與掌控混亂局勢。",
    reversedMeaning: "失去方向、挫敗受阻、情緒失控、好勝心過強、車毀人亡或行事急躁。",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂨"
  },
  {
    id: "8_strength",
    name: "力量 (Strength)",
    type: "major",
    uprightMeaning: "溫柔克剛、內心勇氣、耐心包容、信念力量、克制慾望與安撫野獸。",
    reversedMeaning: "自我懷疑、力量虛空、過度情緒化、懦弱退縮、意志動搖或暴力相向。",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂩"
  },
  {
    id: "9_hermit",
    name: "隱士 (The Hermit)",
    type: "major",
    uprightMeaning: "退思自省、內求真理、精神引導、沈默守序、靈魂沉澱與智慧獨處。",
    reversedMeaning: "孤僻寂寞、拒絕客觀意見、逃避現實、自我封閉、空虛悲觀或固執己見。",
    imageUrl: "https://images.unsplash.com/photo-1500051644838-9519f0224d67?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂪"
  },
  {
    id: "10_wheel_of_fortune",
    name: "命運之輪 (Wheel of Fortune)",
    type: "major",
    uprightMeaning: "命運流轉、機遇降臨、重大轉折、契機、順應天命與幸運之神的微笑。",
    reversedMeaning: "阻礙不順、霉運接連、拒絕改變、惡性循環、時機未到或抗拒命運。",
    imageUrl: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂫"
  },
  {
    id: "11_justice",
    name: "正義 (Justice)",
    type: "major",
    uprightMeaning: "誠實平等、理智判斷、因果律、法理裁決、理性決斷與承擔自身責任。",
    reversedMeaning: "偏見不公、失衡、拒絕認錯、官司不利、是非混淆或逃避業力後果。",
    imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂬"
  },
  {
    id: "12_hanged_man",
    name: "吊人 (The Hanged Man)",
    type: "major",
    uprightMeaning: "換位思考、甘願奉獻、以靜制動、沉潛開悟、等待時機與釋放控制慾。",
    reversedMeaning: "無謂犧牲、停滯不前、逃避決策、抗拒代價、受困泥沼或白費心機。",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂭"
  },
  {
    id: "13_death",
    name: "死亡 (Death)",
    type: "major",
    uprightMeaning: "終結、大轉折、告別舊時代、新生、痛苦蛻變與不可阻擋的自然汰換。",
    reversedMeaning: "抗拒改變、在痛苦中拖延、沉溺過去、勉強維持殘影、害怕重啟新生。",
    imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🂮"
  },
  {
    id: "14_temperance",
    name: "節制 (Temperance)",
    type: "major",
    uprightMeaning: "融合溝通、平衡協調、細水長流、身心靈修復、耐心包容與藝術煉金術。",
    reversedMeaning: "生活失衡、缺乏節制、溝通不良、水火不容、過度極端或健康警訊。",
    imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃁"
  },
  {
    id: "15_devil",
    name: "惡魔 (The Devil)",
    type: "major",
    uprightMeaning: "物質誘惑、執念束縛、感官狂愛、暗影面覺醒、財物沉溺或突破禁忌。",
    reversedMeaning: "擺脫束縛、靈魂覺醒、拒絕誘惑、告別沉迷、面對暗影或迎來精神自由。",
    imageUrl: "https://images.unsplash.com/photo-1502481851512-e9e2529bbbf9?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃂"
  },
  {
    id: "16_tower",
    name: "高塔 (The Tower)",
    type: "major",
    uprightMeaning: "驟變爆發、劇烈震盪、幻象幻滅、破壞後重建、強烈啟示與防線崩解。",
    reversedMeaning: "緩慢的危機、逃過一劫、害怕崩塌、強撐危局或拒絕接受徹底洗牌。",
    imageUrl: "https://images.unsplash.com/photo-1536566482680-fca31930a0bd?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃃"
  },
  {
    id: "17_star",
    name: "星星 (The Star)",
    type: "major",
    uprightMeaning: "充滿希望、心靈療癒、宇宙眷顧、靈性啟發、重拾平靜與璀璨願景。",
    reversedMeaning: "失望失落、悲觀絕望、缺乏信任、靈感枯竭、錯失美好契機或自我懷疑。",
    imageUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃄"
  },
  {
    id: "18_moon",
    name: "月亮 (The Moon)",
    type: "major",
    uprightMeaning: "迷惘不安、深層夢境、潛意識波動、流言蜚語、未知陰影與敏感藝術天賦。",
    reversedMeaning: "迷霧漸散、迎接真相、破除陰影、戰勝恐懼不安、直覺獲得實證。",
    imageUrl: "https://images.unsplash.com/photo-1510137600163-2729bc6959a6?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃅"
  },
  {
    id: "19_sun",
    name: "太陽 (The Sun)",
    type: "major",
    uprightMeaning: "無比光明、生命活力、巨大成功、幸福快樂、自信非凡與溫暖真誠。",
    reversedMeaning: "光芒受阻、過度狂傲、小小挫折、活力暫失、目標模糊或自我膨脹。",
    imageUrl: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃆"
  },
  {
    id: "20_judgement",
    name: "審判 (Judgement)",
    type: "major",
    uprightMeaning: "神聖召喚、宿命重大契機、自我覺醒、業力清算、釋放釋懷與重大抉擇。",
    reversedMeaning: "拒絕召喚、優柔寡斷、悔恨不已、錯失重大時機、自我逃避或因循守舊。",
    imageUrl: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃇"
  },
  {
    id: "21_world",
    name: "世界 (The World)",
    type: "major",
    uprightMeaning: "大功告成、完美旅程、旅途圓滿、與宇宙融合、事業成就與新境界的展開。",
    reversedMeaning: "事未竟成、美中不足、阻礙不前、抗拒踏出舒適圈、缺乏收尾力量。",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=500&q=80",
    mysticSymbol: "🃈"
  }
];

export const MOOD_KEYWORDS = [
  "沉穩泰然", "靈感泉湧", "溫柔自洽", "高瞻遠矚", "細嚼慢嚥", 
  "豐足感恩", "敏銳覺知", "優雅從容", "腳踏實地", "靜水流深"
];

export const CONSTELLATIONS = [
  "牡羊座", "金牛座", "雙子座", "巨蟹座", "獅子座", "處女座",
  "天秤座", "天蠍座", "射手座", "摩羯座", "水瓶座", "雙魚座"
];

export const RECOMMENDED_DOS_TAURUS = [
  "花 15 分鐘仔細品味一杯單品咖啡或手沖茶，感受五感的全然綻放。",
  "重整書桌或臥室的一角，擺飾一件富有美學價值的藝術品或水晶。",
  "在大自然中散步，赤腳踩踏草地，做三次沉穩的腹式呼吸（接地氣）。",
  "檢視個人儲蓄與投資帳戶，為中長期目標做出理性的資金分配計畫。",
  "對一位重要的人，親口或手寫表達真實而沉甸甸的暖心謝意。",
  "手寫梳理當前的思緒，排除腦袋中過载的發散雜訊，找回內在秩序。",
  "使用柑橘、檀香或尤加利香氛沐浴，深層放鬆累積的頸肩肌肉張力。",
  "為自己烹調或挑選一頓色彩斑斕、營養均衡的豐盈天然午餐。",
  "溫習一個你喜愛的哲學主題或跨文化史地知識，充盈你的第九宮智慧。",
  "挑選一首古典、氛圍或神聖的純樂，放慢呼吸閉目冥想 10 分鐘。"
];

export const DAILY_WISDOM_QUOTES = [
  "親愛的，真正持久的高貴在於內心的穩定與無畏。今天請慢下來，大地會托住你的一切。",
  "當上升處女座的細緻遇到太陽金牛的穩健，你有條理也有底氣去迎接任何靈魂考驗。",
  "財富常流向懂得享受當下、珍惜微小存在的人。今天，你就是最豐饒的存在。",
  "不要急著趕路，金牛的魅力在於沉澱出的厚度。最美的花朵，都需要耐心的生長積累。",
  "內心渴望秩序時，不妨從整理周遭開始。當外在條理分明，你那月亮天秤的和諧便會油然而生。",
  "宇宙在你的第九宮灑落智慧之光。傾聽直覺，把心胸敞開得像星空一樣遼闊吧。",
  "與其尋求外在的掌聲，不如肯定自我的踏實。你走過的每一步，都沒有白費。"
];

export const CRYSTALS = [
  "綠幽靈 (提升金牛財運及事業契機)", "黃水晶 (激發創造力與豐盛振動)",
  "白水晶 (淨化磁場、放大和諧意念)", "粉晶 (溫柔撫平焦慮與連結內在美)",
  "拉長石 (連結第三眼，引領哲學洞察)", "青金石 (加強第九宮的宏觀視野)",
  "琥珀 (溫潤 grounding 兼具避邪作用)", "紫水晶 (安撫心智、轉化浮躁焦慮)"
];

export const PLANTS = [
  "黃金葛 (象徵豐盛、生命力持久)", "薄荷 (帶來清新思維與活力能量)",
  "百合花 (展現優雅與和諧的美學氣質)", "多肉植物 (耐旱堅毅，代表腳踏實地)",
  "迷迭香 (提升專注、安神淨化氣場)", "尤加利 (開闊胸懷，釋放積壓情緒)",
  "茉莉花 (展現高雅內斂的吸引魅力)"
];

export const SCENTS = [
  "大西洋雪松與尤加利 (穩定安心)", "檀香與乳香 (深層冥想、探索心靈)",
  "白麝香與大馬士革玫瑰 (極致感官)", "甜橙與岩蘭草 (接地氣而富有活力)",
  "薰衣草與羅馬洋甘菊 (徹底放鬆)", "依蘭依蘭與廣藿香 (豐饒與和諧)"
];

export const PLACES = [
  "瀰漫咖啡香氣的安靜獨立書店", "林木茂密、能聽見鳥鳴的城市植物園",
  "館藏豐富、光線柔和寧靜的美術館", "幽靜並提供美味有機料理的小木屋",
  "波光粼粼、能望向遼闊水平線的海邊", "充滿歷史厚重感與石雕的古樸院落"
];

export const SPORTS = [
  "赤腳慢跑 (接地療癒，重新連結大地)", "哈達瑜伽 (專注呼吸，重塑身體線條)",
  "八段錦 / 太極 (舒緩經絡，調和精氣神)", "森林徒步健行 (放鬆五感、安撫神經)",
  "深層核心皮拉提斯 (鍛鍊內在控制力)"
];

export const DIRECTIONS = ["正東方 (喜神照拂)", "東南方 (財氣引流)", "西南方 (和諧人情)", "正北方 (智慧沉澱)"];

export const LOCATIONS = ["微風輕拂的挑高露天咖啡座", "散發木質與精油香氣的芳療室", "擺放大量植栽的明亮溫室花房", "俯瞰城市夜景的幽靜景觀草原"];

export const TIME_SLOTS = ["07:00 - 09:00 (朝陽初昇，定神期)", "13:00 - 14:30 (正午微醺，思索期)", "19:00 - 21:00 (華燈暗香，沉澱期)", "22:30 - Midnight (星輝入夢，靜修期)"];

export const COLORS = [
  { name: "森林墨綠", hex: "#14532d" },
  { name: "香檳暖金", hex: "#ca8a04" },
  { name: "霧暮黛藍", hex: "#1e3a8a" },
  { name: "大地奶駝", hex: "#d97706" },
  { name: "煙燻柔粉", hex: "#be185d" },
  { name: "極光暖月", hex: "#aca072" },
  { name: "澄澈鼠尾草綠", hex: "#4d7c0f" }
];

export const WEEKLY_BEST_POOL = [
  {
    best: "專業技能的突破性展現 (事業顯化)",
    details: "你的上升處女座分析才華與天頂雙子的表達能力完美激盪。本週在提報、規劃、談判或寫作中，你將靈巧展示無可替代的專業價值，引來貴人瞩目。"
  },
  {
    best: "投資儲蓄與資源整合大旺 (財帛豐盈)",
    details: "得益於月亮落在第 2 宮天秤座與太陽金牛的強大呼應，你在資產配置、二手交易或談判權益上非常有遠見。有機會獲得意料之外的折扣、補貼或財富渠道。"
  },
  {
    best: "高階心智的開悟與哲學啟迪 (心靈富足)",
    details: "在第 9 宮太陽金牛深度的思考下，你對未來 1-3 年的規劃將豁然開朗。可能在閱讀某本書、觀賞影片或一場深度對話中，推開至關重要的靈魂真理之門。"
  },
  {
    best: "親密關係與深層默契的和睦 (人緣和善)",
    details: "天秤月亮為你注入無限的溫柔。你與家人的誤會、或與朋友的合作摩擦將在本週如冬雪初融。你展現的極致包容魅力，會深深感化身邊重要的人。"
  }
];

export const WEEKLY_WARNING_POOL = [
  {
    warning: "過度專注細節而流於苛刻 (見樹不見林)",
    details: "上升處女座有時會陷於雞毛蒜皮的完美主義中，導致專案拖延或對合作夥伴產生無端焦慮。記得退後一步，用太陽金牛的宏觀眼光包容瑕疵。"
  },
  {
    warning: "積累的頸肩僵硬與身體排毒警訊 (身體抗議)",
    details: "金牛主控頸部與喉嚨。本週因工作或緊繃思慮，可能出現喉嚨沙啞、頸肩僵硬等情況。請務必在工作一小時後起來拉伸，並多喝溫熱甘菊茶。"
  },
  {
    warning: "因面子或執念而固執己見 (牛脾氣爆發)",
    details: "當面臨團隊分歧或方向調整時，金牛座的固執常在無形中抬頭，抗拒不適應的微調。試著借用雙子天頂的彈性靈巧，擁抱更多可能性。"
  },
  {
    warning: "因感官慰藉而引發的報復性開銷 (財帛波動)",
    details: "情緒波動或疲憊時，你極易透過精緻美食、奢華香氛或大筆購物來補償內心。本週請務必設定娛樂購物限額，避免衝動結帳後帶來莫大悔意。"
  }
];
