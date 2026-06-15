import type { PromptExample } from "@/lib/types";

export const categories = ["全部", "海报", "信息图", "空间", "UI", "品牌", "商品图", "人物", "插画", "场景", "其他"] as const;

export type ExampleCategory = (typeof categories)[number];

export const examples: PromptExample[] = [
  {
    id: "awesome-case-5",
    title: "主题海报版式设计",
    category: "海报",
    tags: ["海报","叙事","剪影"],
    description: "用人物剪影包裹完整世界观，适合史诗感主题海报和叙事视觉。",
    sampleImageUrl: "/examples/awesome-case-5.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "根据【XXX主题】自动生成一张收藏版史诗叙事海报：巨大优雅的人物侧脸剪影作为外轮廓，剪影内部自动生长出最契合该主题的完整世界观、标志性场景、角色关系、象征符号、关键建筑、生物、道具与氛围。整体不是普通拼贴，而是高级的剪影轮廓填充式叙事合成，带有双重曝光式联想，但更偏电影海报与梦幻水彩插画融合风格；柔和空气透视，轻雾化过渡，纸张颗粒，边缘飞白与刷痕，大面积留白，版式克制高级，安静、宏大、神圣、怀旧、诗意、传说感强。风格、色彩、场景、材质全部根据主题自动适配，所有元素必须强绑定主题，一眼识别，不要杂乱，不要硬拼贴，不要模板化背景，不要廉价奇幻素材。画面中需自然加入专属签名“WHY”，作为海报设计的一部分，位置低调但清晰，可放在左下角、右下角或标题附近，风格需与整体版式统一，像收藏版海报的作者落款或设计签章；签名字体精致、克制、高级，不可过大，不可破坏主体构图，不可显得突兀廉价。"
  },
  {
    id: "awesome-case-8",
    title: "科普百科图",
    category: "信息图",
    tags: ["信息图","百科","图鉴"],
    description: "模块化百科信息图，适合把主题、细节和知识点整理成收藏级图鉴。",
    sampleImageUrl: "/examples/awesome-case-8.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "根据【主题】生成一张高质量竖版「科普百科图」。\n这张图不是普通海报，也不是单纯插画，而是一张兼具图鉴感、百科感、信息结构感和收藏感的模块化科普信息图。整体风格参考高级博物图鉴、现代百科书页、生活方式知识卡，以及社交媒体上更容易传播的信息图风格。\n让画面包含：\n一个清晰好看的主题主视觉\n若干局部特征放大细节\n多个圆角模块化信息分区\n清楚的标题层级与重点标签\n简洁但信息丰富的百科内容\n可视化评分、要点总结或 Top 5 模块\n内容栏目请根据主题自动适配，优先从这些方向里选择并合理组合：\n基础档案、分类信息、外观特征、习性生态、形成机制或结构组成、生长或使用条件、养护或维护建议、风险与注意事项、适合人群或适用场景、优缺点对比、快速评分卡。\n视觉要求：\n浅色干净背景，柔和配色，轻阴影，精致小图标，圆角信息框，整体排版整洁清爽。信息密度要丰富，但不能显得拥挤，阅读体验要舒服。最终效果要像真正可以发布、阅读、收藏、批量做成系列内容的科普百科卡，而不是广告感很重的宣传海报。\n不要做成普通商业宣传海报，要重点突出“知识整理”“模块信息”“图鉴式展示”这几个特征。"
  },
  {
    id: "awesome-case-9",
    title: "主题海报版式设计",
    category: "海报",
    tags: ["城市","国潮","旅行"],
    description: "明亮国潮城市宣传海报，适合城市、旅行和节庆主题视觉。",
    sampleImageUrl: "/examples/awesome-case-9.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "2026中国城市系列宣传海报，主题为【北京】。现代、多彩、明亮通透的国潮风，竖版9:16。大面积白色纹理留白背景，一条从右下向左上盘旋的红色丝绸形成S型主构图。右下角一位东方女性挥舞红绸，服饰需结合北京地域文化定制。红绸延展为城市长卷，融合天坛、长城、鸟巢、喇叭沟门原始森林公园、什刹海、京味相声。左侧排版SPRING 2026、竖排Beijing和小印章“北京”。要求统一系列感，但不能雷同，细节丰富，城市辨识度强。文字清晰且精美布局，高端图形设计。"
  },
  {
    id: "awesome-case-11",
    title: "一张手绘风格的城市美食地图，以台州为主题",
    category: "空间",
    tags: ["地图","美食","手绘"],
    description: "手绘城市美食地图，用可爱插画和地标组织地方内容。",
    sampleImageUrl: "/examples/awesome-case-11.jpg",
    defaultAspectRatio: "1:1",
    originalPrompt: "一张手绘风格的城市美食地图，以台州为主题。画面以鸟瞰视角的手绘简化城市地图为底，标注椒江、路桥、黄岩等区域和灵江、台州湾等水系地标，不追求精确比例而是追求可爱的水彩手绘感。地图上分布着12个美食地点的精致手绘小插画：1. 椒江老粮坊的蛋清羊尾（金黄蓬松的蛋泡甜点撒着糖粉，筷子夹起拉丝）2. 临海紫阳古街的食饼筒（一个饱满的麦饼卷切开露出肉丝、蛋皮、米面等丰富馅料）3. 三门的青蟹（一只肥硕的青壳大蟹张着大钳子，旁边一小碟姜醋）4. 温岭石塘渔港的海鲜面（粗瓷大碗浓白鱼汤面铺满虾、蛏子、小黄鱼）5. 路桥的糟羹（一锅稠厚的五彩羹，芥菜、冬笋、香干、牡蛎粒粒可见）6. 玉环坎门的炊圆（三四个白胖糯米团子卧在笼屉里，旁边酱油碟滴着麻油）7. 黄岩的麦虾（陶锅里面疙瘩配蛤蜊、青菜翻滚冒泡）8. 仙居的八大碗（八只粗陶小碗围成一圈——土鸡、溪鱼、豆腐皮俱全）9. 天台的饺饼筒（几卷金黄酥脆的薄饼整齐码放，露出红烧肉和豆面馅）10. 临海的麦油脂（竹盘上摊着薄如蝉翼的饼皮卷着肉末、豆芽、鸡蛋丝）11. 温岭的嵌糕（厚实的年糕饼中间嵌着红烧肉和油条，正在铁板上滋滋作响）12. 椒江的姜汁调蛋（一只青花碗里琥珀色姜汤卧着嫩滑蛋花，撒几粒核桃碎）。每个插画约占地图5%面积，旁边用手写体标注店名和一句推荐语如“阿婆凌晨四点就起来和面”“本地人认准这口锅”。地图边缘用手绘藤蔓、杨梅枝和小海鲜（虾、蟹、贝壳）装饰形成边框。右下角有一个手绘指南针（标注“东海”方向）和图例说明。左上角标题“台州·山海食光地图”使用胖圆的手绘美术字，用杨梅和小黄鱼点缀装饰。整体画风为水彩+彩铅混合的手绘质感，颜色以杨梅红、姜黄、海蓝、翠绿为主，图片比例1:1。"
  },
  {
    id: "awesome-case-41",
    title: "插画艺术风格创作",
    category: "插画",
    tags: ["插画","角色","艺术风格"],
    description: "插画艺术风格创作模板，适合角色、人物和风格化视觉实验。",
    sampleImageUrl: "/examples/awesome-case-41.jpg",
    defaultAspectRatio: "4:3",
    originalPrompt: "{ \"type\": \"VTuber profile sheet\", \"theme\": \"{argument name=\\\"color theme\\\" default=\\\"purple and white\\\"}, elegant, lace, ribbon motifs\", \"character\": { \"name\": \"{argument name=\\\"character name\\\" default=\\\"紫咲リリー\\\"}\", \"archetype\": \"{argument name=\\\"character archetype\\\" default=\\\"elegant ojousama\\\"}\", \"appearance\": \"anime girl, long black hair with purple highlights, purple eyes, wearing a white blazer, purple pleated skirt, thigh-highs, ribbons\", \"pose\": \"standing, finger to lips, looking slightly to the side\" }, \"chibi_character\": { \"appearance\": \"same character in chibi form\", \"pose\": \"sitting down, smiling\" }, \"layout\": { \"header\": { \"top_left\": \"Ribbon banner reading 'VTuber Profile'\", \"top_center\": \"Logo with text '{argument name=\\\"vtuber type\\\" default=\\\"清楚系お嬢様Vtuber\\\"}' and '{argument name=\\\"character name\\\" default=\\\"紫咲リリー\\\"}' and 'Shisaki Lily'\", \"top_right\": \"Quote '{argument name=\\\"catchphrase\\\" default=\\\"皆さまの心に、優雅なひとときをお届けしますわ\\\"}' followed by a 3-line introductory paragraph\" }, \"columns\": [ { \"position\": \"left\", \"content\": \"Full-body character portrait\" }, { \"position\": \"center\", \"sections\": [ { \"title\": \"Profile\", \"count\": 9, \"labels\": [\"名前\", \"誕生日\", \"年齢\", \"身長\", \"属性\", \"一人称\", \"出身\", \"職業\", \"活動開始日\"] }, { \"title\": \"Personality\", \"content\": \"2-line text block\" }, { \"title\": \"Hobby & Special Skill\", \"count\": 2, \"labels\": [\"趣味\", \"特技\"] }, { \"title\": \"Like & Dislike\", \"count\": 2, \"labels\": [\"好きなもの\", \"苦手なもの\"] } ] }, { \"position\": \"right\", \"sections\": [ { \"title\": \"Streaming Content\", \"content\": \"1-line text block\" }, { \"title\": \"Schedule\", \"count\": 2, \"labels\": [\"配信時間\", \"配信頻度\"] }, { \"title\": \"Goals\", \"content\": \"3-line text block\" }, { \"title\": \"Fan & Tag\", \"count\": 3, \"labels\": [\"ファンネーム\", \"ファンアートタグ\", \"総合タグ\"], \"extra\": \"4 hashtag rows with small icons\" }, { \"title\": \"Creator\", \"count\": 3, \"labels\": [\"イラストレーター (ママ)\", \"モデラー (パパ)\", \"使用モデル\"] }, { \"title\": \"Links\", \"count\": 4, \"labels\": [\"YouTube\", \"X (Twitter)\", \"BOOTH\", \"FANBOX\"] }, { \"content\": \"Chibi character illustration placed at the bottom right corner\" } ] } ], \"footer\": { \"sections\": [ { \"title\": \"Rules\", \"count\": 3, \"description\": \"3 bullet points with heart icons\" }, { \"content\": \"2-line closing message at the bottom center\" } ] } } }"
  },
  {
    id: "awesome-case-50",
    title: "建筑空间场景图",
    category: "空间",
    tags: ["建筑","空间","场景"],
    description: "建筑空间场景图模板，适合室内、建筑和环境氛围设定。",
    sampleImageUrl: "/examples/awesome-case-50.jpg",
    defaultAspectRatio: "16:9",
    originalPrompt: "A highly detailed, cinematic wide shot of a grand, dark gothic hall with a {argument name=\"atmosphere\" default=\"dark fantasy\"} aesthetic. In the center, a single figure wearing a {argument name=\"clothing\" default=\"long white robe\"} kneels on a highly reflective stone floor, facing an ornate golden altar illuminated by a row of lit candles. To the right of the kneeling figure, a single {argument name=\"floor object\" default=\"wooden violin\"} rests on the ground. The cavernous room is framed by massive dark stone pillars detailed with {argument name=\"accent color\" default=\"glowing blue\"} ethereal cracks and veins. Suspended from the high ceiling are dozens of {argument name=\"floating objects\" default=\"white porcelain theatrical masks\"} hanging on thin strings, filling the upper half of the space and creating a haunting, surreal atmosphere. The lighting is dramatic and moody, featuring a rich color palette of deep blacks, tarnished golds, and cool blue accents. Format 16:9."
  },
  {
    id: "awesome-case-85",
    title: "关系图谱信息图",
    category: "信息图",
    tags: ["信息图","关系图谱","可视化"],
    description: "关系图谱信息图，用节点、连线和层级组织复杂关系。",
    sampleImageUrl: "/examples/awesome-case-85.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "Please generate a high-design character relationship map poster based on {argument name=\"theme\" default=\"Demon Slayer\"}. This image should not be a simple illustration, but a character relationship map that combines information visualization, narrative structure, poster design sense, and stylistic fidelity.\n\nPlease automatically complete the following:\n- Identify the work and core settings corresponding to the theme\n- Extract the most representative 6–12 key characters, not exceeding 15 if necessary\n- Identify and display key character relationships, including blood ties, romance, friendship, alliances, hostility, master-disciple, etc.\n- Automatically choose a composition method based on the work's characteristics, such as protagonist-centered, dual-core confrontation, faction-based, family tree, or chronological evolution\n- Automatically refine the work's style DNA, including color, worldview symbols, textures, mood, typography, and representative elements\n- Transform these stylistic elements into an overall visual design for the relationship map, rather than simply copying an official poster\n- Use different colors, line types, and arrows to distinguish different relationships, ensuring clear lines and layers without clutter\n- Make core characters most prominent, followed by important characters, and subordinate characters weakened to form a clear visual hierarchy\n- Ensure every character name is legible, with identity or faction labels if necessary\n\nThe final product should satisfy:\n- Immediate understanding of character hierarchy and key relationships\n- Obvious alignment with the original work's temperament and setting\n- Combines the clarity of an infographic with the premium design of a poster\n- Unified, exquisite, complete, and suitable for social media sharing or poster display\n- Avoids a cheap flowchart feel, messy piling, and information overload."
  },
  {
    id: "awesome-case-84",
    title: "关系图谱信息图",
    category: "信息图",
    tags: ["信息图","关系图谱","结构化"],
    description: "结构化关系图谱信息图，适合人物、事件和知识网络梳理。",
    sampleImageUrl: "/examples/awesome-case-84.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "Please generate a high-design character relationship map poster based on {argument name=\"theme\" default=\"Demon Slayer\"}. This image should not be a simple illustration, but a character relationship map that combines information visualization, narrative structure, poster design sense, and stylistic fidelity.\n\nPlease automatically complete the following:\n- Identify the work and core settings corresponding to the theme\n- Extract the most representative 6–12 key characters, not exceeding 15 if necessary\n- Identify and display key character relationships, including blood ties, romance, friendship, alliances, hostility, master-disciple, etc.\n- Automatically choose a composition method based on the work's characteristics, such as protagonist-centered, dual-core confrontation, faction-based, family tree, or chronological evolution\n- Automatically refine the work's style DNA, including color, worldview symbols, textures, mood, typography, and representative elements\n- Transform these stylistic elements into an overall visual design for the relationship map, rather than simply copying an official poster\n- Use different colors, line types, and arrows to distinguish different relationships, ensuring clear lines and layers without clutter\n- Make core characters most prominent, followed by important characters, and subordinate characters weakened to form a clear visual hierarchy\n- Ensure every character name is legible, with identity or faction labels if necessary\n\nThe final product should satisfy:\n- Immediate understanding of character hierarchy and key relationships\n- Obvious alignment with the original work's temperament and setting\n- Combines the clarity of an infographic with the premium design of a poster\n- Unified, exquisite, complete, and suitable for social media sharing or poster display\n- Avoids a cheap flowchart feel, messy piling, and information overload."
  },
  {
    id: "awesome-case-88",
    title: "信息图可视化设计",
    category: "信息图",
    tags: ["信息图","可视化","版式"],
    description: "信息图可视化设计模板，适合把复杂内容整理成清晰版式。",
    sampleImageUrl: "/examples/awesome-case-88.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "GPT-Image-2 prompt: please automatically generate a top-tier concept poster / infographic-style movie poster centered around {argument name=\"theme\" default=\"ranking of emperors in Chinese history\"}.\n\nRequire the AI to automatically derive and uniformly design the entire following visual system based on this theme, without my extra specification:\n- Core subject (automatically judge suitability for people, products, architecture, artifacts, symbols, scenes, or abstract imagery)\n- Bottom supporting structure\n- Hovering symbols or spiritual symbols above\n- Scene wrapping elements\n- Metaphor system\n- Color hierarchy\n- Material contrast\n- Lighting logic\n- Title, subtitle, and auxiliary copy\n- Brand sense and high-end expression\n\nThe final frame must be: a shocking, precise, unified, cinematic, ultra-high detail conceptual key visual poster suitable for high-end printing.\n\n[Overall Style]\nUltra-realistic 3D commercial CGI rendering, merging cinematic lighting, luxury visual language, futuristic concept design, and epic composition. The image must have a \"single main visual core,\" not messy, not like a collage, and not like a regular e-commerce poster.\n\n[Automatic Derivation Rules]\nAI must automatically decide based on the [theme]:\n1. Core visual metaphor\n2. Subject type and posture\n3. Form of supporting structure\n4. Form of suspended elements\n5. Scene shell and spatial atmosphere\n6. Main, auxiliary, and emphasis colors\n7. Material combinations\n8. Text temperament and layout style\n\n[Composition Rules]\n- Absolute sense of premium quality\n- Strong central order, overall unity\n- Allows for axial symmetry or epic composition near the central axis\n- Clear visual gravity, forming clear levels from top to bottom\n- Edge negative space is clean, restrained, and has room to breathe\n\n[Visual Quality]\n- Ultra-high detail\n- Clear volumetric light\n- Authentic materials\n- Natural reflection, refraction, shadows, fog, and depth of field\n- Overall standard of high-end brand campaign key visual / luxury invitation poster / conceptual editorial poster\n\n[Typography System]\n- Overall 90% visual, 10% text\n- AI automatically generates the most matching main title and subtitle based on the [theme]\n- Title must be concise, sharp, and powerful\n- Text should be as minimal and accurate as possible; do not stack words\n\n[Signature Requirement]\nNaturally add the author signature in the bottom corner: @a9quant"
  },
  {
    id: "awesome-case-94",
    title: "绘画艺术风格图",
    category: "UI",
    tags: ["UI","绘画","艺术风格"],
    description: "绘画艺术风格图模板，适合生成 UI 化的艺术风格展示。",
    sampleImageUrl: "/examples/awesome-case-94.jpg",
    defaultAspectRatio: "1:1",
    originalPrompt: "{\n  \"type\": \"VTuber stream thumbnail\",\n  \"theme\": \"pastel pink, soft, cute, lace, ribbons, hearts, bunny motif\",\n  \"character\": {\n    \"position\": \"right side, waist-up\",\n    \"appearance\": \"anime girl, {argument name=\\\"hair color\\\" default=\\\"pastel pink\\\"} long wavy hair, large grey eyes, blush, pink heart earrings\",\n    \"accessories\": \"white bunny ears, large pink bow on head\",\n    \"outfit\": \"white frilly dress with lace, large pink ribbon bow at collar with heart gem\"\n  },\n  \"layout\": {\n    \"background\": \"soft pink with subtle sparkles, lace patterns, floating hearts\",\n    \"text_elements\": [\n      {\n        \"type\": \"main title\",\n        \"position\": \"top left\",\n        \"style\": \"large stylized pink text with white outline\",\n        \"text\": \"{argument name=\\\"main title\\\" default=\\\"雑談配信\\\"}\"\n      },\n      {\n        \"type\": \"speech bubble\",\n        \"position\": \"above main title\",\n        \"text\": \"まったり\"\n      },\n      {\n        \"type\": \"circular badge\",\n        \"position\": \"top right\",\n        \"details\": \"lace-edged with small pink bow\",\n        \"text\": \"きてくれてありがとう♡\"\n      },\n      {\n        \"type\": \"heart badge\",\n        \"position\": \"bottom right\",\n        \"details\": \"large lace-edged heart\",\n        \"text\": \"みんなとおしゃべりできるの楽しみにしてるね♡\"\n      }\n    ],\n    \"list_section\": {\n      \"position\": \"bottom left\",\n      \"count\": 3,\n      \"style\": \"horizontal pill-shaped banners with lace edges, each featuring a pink heart with white bunny ears and a tiny bow on the left\",\n      \"items\": [\n        \"{argument name=\\\"list item 1\\\" default=\\\"初見さん〇\\\"}\",\n        \"{argument name=\\\"list item 2\\\" default=\\\"ポイント回収〇\\\"}\",\n        \"{argument name=\\\"list item 3\\\" default=\\\"ROM〇\\\"}\"\n      ]\n    }\n  }\n}"
  },
  {
    id: "awesome-case-131",
    title: "界面交互设计图",
    category: "UI",
    tags: ["UI","落地页","玻璃拟态"],
    description: "深色玻璃拟态落地页样机，适合科技产品和工具类 UI 视觉。",
    sampleImageUrl: "/examples/awesome-case-131.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "{\n  \"type\": \"UI/UX landing page mockup\",\n  \"theme\": \"dark mode, sleek modern aesthetic, glassmorphism, {argument name=\\\"primary accent color\\\" default=\\\"neon purple and blue\\\"} glowing accents\",\n  \"header\": {\n    \"logo\": \"{argument name=\\\"brand name\\\" default=\\\"goViralX\\\"}\",\n    \"top_right_tag\": \"VIRAL CAMPAIGN CASE STUDY\"\n  },\n  \"layout\": {\n    \"sections\": [\n      {\n        \"name\": \"Hero\",\n        \"headline\": \"{argument name=\\\"hero headline\\\" default=\\\"How We Created 10M+ Viral Impact\\\"}\",\n        \"subheadline\": \"3天引爆全网, 助力品牌实现指数级增长\",\n        \"stats_row\": {\n          \"count\": 4,\n          \"labels\": [\"总播放量\", \"互动率\", \"转化咨询\", \"执行周期\"],\n          \"values\": [\"{argument name=\\\"main statistic\\\" default=\\\"10,240,000+\\\"}\", \"18.7%\", \"3,200+\", \"72小时\"]\n        },\n        \"visual\": \"cinematic shot of a person in a hoodie looking at glowing digital screens and graphs, large play button overlay\"\n      },\n      {\n        \"name\": \"Strategy\",\n        \"title\": \"Our 3-Day Execution Strategy\",\n        \"layout_type\": \"vertical timeline\",\n        \"steps_count\": 3,\n        \"elements_per_step\": [\"timeline node\", \"title\", \"bullet points\", \"video thumbnail with play button\", \"description box\"]\n      },\n      {\n        \"name\": \"Performance\",\n        \"title\": \"Data-Driven Performance\",\n        \"left_column\": {\n          \"stat_cards_count\": 4,\n          \"values\": [\"10M+\", \"43%\", \"28,000+\", \"3,200+\"]\n        },\n        \"right_column\": {\n          \"charts_count\": 2,\n          \"chart_1\": \"line graph showing 7-day growth peaking at Day 3\",\n          \"chart_2\": \"horizontal segmented bar chart showing platform distribution (TikTok 52%, Instagram 24%, X 15%, YouTube 9%)\"\n        }\n      },\n      {\n        \"name\": \"Keys to Success\",\n        \"title\": \"The 3 Keys to Viral Success\",\n        \"cards_count\": 3,\n        \"card_elements\": [\"glowing icon (fire, target, antenna)\", \"title\", \"description\", \"VIEW DETAIL link\"]\n      },\n      {\n        \"name\": \"Social Proof\",\n        \"title\": \"TRUSTED BY CREATORS & BRANDS\",\n        \"left_column\": {\n          \"logos_count\": 8,\n          \"grid\": \"2x4\",\n          \"brands\": [\"SHEIN\", \"SHOPLINE\", \"Blueglass\", \"instacart\", \"lemon8\", \"mi\", \"CIDER\", \"bellroy\"]\n        },\n        \"right_column\": {\n          \"testimonial_cards_count\": 2,\n          \"elements\": [\"quote\", \"author title (SaaS Founder, Growth Manager)\"]\n        }\n      },\n      {\n        \"name\": \"Call to Action\",\n        \"title\": \"READY TO GO VIRAL?\",\n        \"interactive_elements\": [\"text input field\", \"glowing button with text '{argument name=\\\"call to action text\\\" default=\\\"获取专属增长方案 ->\\\"}'\"],\n        \"visual\": \"3D render of a rocket ship taking off with purple and blue flames\"\n      }\n    ]\n  }\n}"
  },
  {
    id: "awesome-case-54",
    title: "人物角色设定图",
    category: "商品图",
    tags: ["商品","广告","四宫格"],
    description: "四宫格讽刺商品广告模板，适合脑洞产品、角色商品和社媒梗图。",
    sampleImageUrl: "/examples/awesome-case-54.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "{\n  \"type\": \"4-panel satirical product advertisement grid\",\n  \"layout\": {\n    \"grid\": \"2x2\",\n    \"panels\": [\n      {\n        \"position\": \"top-left\",\n        \"product_name\": \"{argument name=\\\"top left product name\\\" default=\\\"座る石\\\"}\",\n        \"visual\": \"man in white shirt and dark pants sitting on a large round stone in a park\",\n        \"catchphrase\": \"いつでも、どこでも、落ち着ける。\",\n        \"sales_badge\": \"累計販売数 12,000個 突破!\",\n        \"vertical_text\": \"公園のベンチが埋まっていた日に。\",\n        \"features_count\": 3,\n        \"features_labels\": [\n          \"重さ約8kgで安定感抜群\",\n          \"底面フェルト加工で傷つけにくい\",\n          \"付属の専用ベルトで持ち運び簡単\"\n        ],\n        \"extra_visual\": \"small inset image of the stone with a leather carrying strap\",\n        \"specs\": [\n          \"耐荷重 150kg\",\n          \"安心の日本製\"\n        ]\n      },\n      {\n        \"position\": \"top-right\",\n        \"product_name\": \"{argument name=\\\"top right product name\\\" default=\\\"磨きたくない人の歯ブラシ\\\"}\",\n        \"visual\": \"sleek light blue toothbrush angled diagonally on a dark blue background\",\n        \"toothbrush_text\": \"I don't want to brush my yeeth.\",\n        \"catchphrase\": \"持っているだけで安心感\",\n        \"vertical_text\": \"歯を磨く代わりに、これを持つ。\",\n        \"sales_badge\": \"シリーズ累計販売数 85,000本 突破!\",\n        \"features_count\": 3,\n        \"features_labels\": [\n          \"気持ちを落ち着けるお守り代わりに\",\n          \"会議や商談前のエチケットに\",\n          \"磨かない選択を、もっと自由に。\"\n        ],\n        \"bottom_banner\": \"歯磨きストレスから、あなたを解放する。\"\n      },\n      {\n        \"position\": \"bottom-left\",\n        \"product_name\": \"{argument name=\\\"bottom left product name\\\" default=\\\"雲の貯金箱\\\"}\",\n        \"visual\": \"hand inserting a coin into a fluffy white cloud-shaped piggy bank\",\n        \"catchphrase\": \"空気より軽い、安心感。\",\n        \"sales_badge\": \"累計販売数 23,567個 突破!\",\n        \"features_count\": 3,\n        \"features_labels\": [\n          \"ふわふわの触り心地\",\n          \"割れないから安心\",\n          \"インテリアに馴染むデザイン\"\n        ],\n        \"color_variants_count\": 3,\n        \"color_variants_labels\": [\n          \"blue\",\n          \"pink\",\n          \"white\"\n        ],\n        \"price\": \"¥2,980 (税込)\",\n        \"bottom_text\": \"今日から、空に向かってコツコツ貯めよう。\"\n      },\n      {\n        \"position\": \"bottom-right\",\n        \"product_name\": \"{argument name=\\\"bottom right product name\\\" default=\\\"叱ってくれる石\\\"}\",\n        \"visual\": \"round stone on a wooden desk with a pen, text written on the stone\",\n        \"stone_text\": \"{argument name=\\\"scolding phrase\\\" default=\\\"いいかげんやれ\\\"}\",\n        \"catchphrase\": \"やる気が出ないあなたへ。\",\n        \"sales_badge\": \"累計販売数 18,000個 突破!\",\n        \"features_count\": 3,\n        \"features_labels\": [\n          \"見るたびに心を奮い立たせる\",\n          \"厳選された言葉をランダム表示\",\n          \"電池不要、半永久的に叱ってくれる\"\n        ],\n        \"phrase_variants_count\": 10,\n        \"phrase_variants_labels\": [\n          \"甘えるな\",\n          \"考えるな\",\n          \"動け\",\n          \"現実を見ろ\",\n          \"逃げるな\",\n          \"寝るな\",\n          \"やればできる\",\n          \"お前ならできる\",\n          \"寝るな\",\n          \"もう言い訳するな\"\n        ],\n        \"price\": \"¥3,500 (税込)\"\n      }\n    ]\n  }\n}"
  },
  {
    id: "awesome-case-130",
    title: "界面交互设计图",
    category: "品牌",
    tags: ["品牌","周边","提案板"],
    description: "品牌识别与周边提案板，适合把 Logo、色彩和物料统一展示。",
    sampleImageUrl: "/examples/awesome-case-130.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "{\n  \"type\": \"brand identity and merchandise design board\",\n  \"theme\": {\n    \"color_palette\": \"{argument name=\\\"theme color\\\" default=\\\"pastel pink\\\"} and white\",\n    \"motif\": \"{argument name=\\\"motif\\\" default=\\\"cherry blossoms\\\"} and pink hearts\"\n  },\n  \"character\": {\n    \"description\": \"anime girl with short brown bob hair, pink eyes, wearing a white hoodie, gentle smile\"\n  },\n  \"branding\": {\n    \"main_logo\": \"{argument name=\\\"character name\\\" default=\\\"癒音ちー\\\"}\",\n    \"sub_logo\": \"{argument name=\\\"character subtext\\\" default=\\\"ゆおんちー\\\"}\"\n  },\n  \"layout\": {\n    \"sections\": [\n      {\n        \"type\": \"header banner\",\n        \"position\": \"top\",\n        \"elements\": [\"large main logo\", \"sub logo\", \"cherry blossom graphics\", \"character portrait on the right\"]\n      },\n      {\n        \"type\": \"product packaging\",\n        \"position\": \"middle left\",\n        \"elements\": [\"1 square box with heart-shaped transparent window showing pink heart candies\", \"character illustration on box\", \"2 individual candy wrappers\", \"5 scattered heart candies\"]\n      },\n      {\n        \"type\": \"promotional poster\",\n        \"position\": \"middle right\",\n        \"elements\": [\"character portrait\", \"heart-shaped candy bowl\", \"main logo\", \"text '4.26 NEW OPEN'\", \"text '{argument name=\\\"social handle\\\" default=\\\"@yuonchii\\\"}'\"]\n      },\n      {\n        \"type\": \"horizontal web banner\",\n        \"position\": \"lower middle\",\n        \"elements\": [\"main logo\", \"cherry blossoms\", \"character portrait on the right\"]\n      },\n      {\n        \"type\": \"social media profile mockup\",\n        \"position\": \"bottom left\",\n        \"elements\": [\"header image with logo\", \"1 circular profile picture\", \"handle '{argument name=\\\"social handle\\\" default=\\\"@yuonchii\\\"}'\", \"1 follow button\", \"mock bio text\"]\n      },\n      {\n        \"type\": \"merchandise collection\",\n        \"position\": \"bottom right\",\n        \"count\": 9,\n        \"items\": [\"1 white t-shirt with logo\", \"1 white mug with character\", \"4 round pin badges\", \"1 acrylic keychain\", \"2 candy packets\"]\n      }\n    ]\n  }\n}"
  },
  {
    id: "awesome-case-155",
    title: "人物角色设定图",
    category: "商品图",
    tags: ["角色","周边","商品"],
    description: "围绕角色生成周边商品，适合虚拟主播、IP 和粉丝向物料。",
    sampleImageUrl: "/examples/awesome-case-155.jpg",
    defaultAspectRatio: "1:1",
    originalPrompt: "Create {argument name=\"items\" default=\"fan goods\"} for a standard {argument name=\"character type\" default=\"Vtuber\"} in {argument name=\"style\" default=\"live-action\"}"
  },
  {
    id: "awesome-case-156",
    title: "应用界面样机图",
    category: "UI",
    tags: ["UI","电商","直播"],
    description: "直播电商移动端界面样机，适合商品展示、主播场景和 UI 预览。",
    sampleImageUrl: "/examples/awesome-case-156.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "{\n  \"type\": \"mobile live-streaming e-commerce interface mockup\",\n  \"subject\": {\n    \"description\": \"young Asian woman, long dark hair, wearing light-colored floral pajama set with a pink bow, holding the pajama top outward to show the fabric\",\n    \"background\": \"cozy room, clothing rack with pajamas, flowers, warm lighting\"\n  },\n  \"ui_layout\": {\n    \"top_bar\": {\n      \"time\": \"20:34\",\n      \"host_info\": {\n        \"name\": \"{argument name=\\\"host name\\\" default=\\\"小雨睡衣\\\"}\",\n        \"stats\": \"12.8万本场点赞\",\n        \"button\": \"关注\"\n      },\n      \"viewer_info\": {\n        \"avatars_count\": 3,\n        \"total_viewers\": \"1.2万\"\n      }\n    },\n    \"floating_tags\": {\n      \"count\": 2,\n      \"labels\": [\"带货总榜第3名\", \"人气榜\"]\n    },\n    \"widgets\": {\n      \"top_left\": \"red envelope icon with timer 03:45\",\n      \"top_right\": \"floating heart icon with text 直播好物大赏 发现新热爱\"\n    },\n    \"marketing_text_overlay\": {\n      \"position\": \"mid-right\",\n      \"lines_count\": 5,\n      \"lines\": [\n        \"{argument name=\\\"main headline\\\" default=\\\"新款睡衣\\\"}\",\n        \"{argument name=\\\"sub headline\\\" default=\\\"正在秒杀中...\\\"}\",\n        \"亲肤透气\",\n        \"柔软舒适\",\n        \"不起球 不褪色\"\n      ]\n    },\n    \"chat_log\": {\n      \"position\": \"bottom-left\",\n      \"message_count\": 7,\n      \"messages\": [\n        \"32 雨*** 加入了直播间\",\n        \"小***: 好看，多少钱\",\n        \"小***: 拍了，期待发货\",\n        \"C***: 质量看着不错\",\n        \"用***: 身高165，体重120斤，穿多大码？\",\n        \"@***: 主播身上这款有货吗？\",\n        \"晴***: 已拍，坐等收货！\"\n      ]\n    },\n    \"product_card\": {\n      \"position\": \"bottom-right\",\n      \"thumbnail\": \"miniature of the host\",\n      \"title\": \"{argument name=\\\"product title\\\" default=\\\"【小雨睡衣】春季新款家居服套装\\\"}\",\n      \"tags_count\": 2,\n      \"tags\": [\"7天无理由退货\", \"运费险\"],\n      \"price_section\": \"秒杀价 ¥ {argument name=\\\"product price\\\" default=\\\"89.9\\\"}\",\n      \"action_button\": \"抢\"\n    },\n    \"bottom_bar\": {\n      \"input_placeholder\": \"说点什么...\",\n      \"icon_count\": 5,\n      \"icons\": [\"smiley face\", \"shopping cart\", \"heart/gift\", \"gift box\", \"three dots\"]\n    }\n  }\n}"
  },
  {
    id: "awesome-case-381",
    title: "90 年代公寓场景参考板",
    category: "空间",
    tags: ["空间","参考板","电影感"],
    description: "90 年代公寓电影场景参考板，适合空间氛围、道具和灯光设定。",
    sampleImageUrl: "/examples/awesome-case-381.jpg",
    defaultAspectRatio: "16:9",
    originalPrompt: "{\n  \"type\": \"scene reference board — 90s apartment living room, cinematic night\",\n  \"style\": \"cinematic film photography, 35mm grain, warm amber shadow fill, deep chiaroscuro lighting, hyper-detailed interior, production design reference quality\",\n  \"layout\": {\n    \"main_panel_center_left\": {\n      \"label\": \"CAMERA A — FRONT VIEW\",\n      \"scene\": \"Wide shot, L-shaped tan sectional sofa, grey knit throw blanket, wooden coffee table (remote, mug, ashtray, Rolling Stone stack), lava lamp left, table lamp right, rain-streaked city window behind, Nirvana poster left wall. 35mm grain.\"\n    },\n    \"main_panel_center_right\": {\n      \"label\": \"CAMERA B — REVERSE VIEW\",\n      \"scene\": \"Wide reverse from behind sofa. CRT TV prominent right, grey static screen. Tall bookshelf, VHS tapes. Cool blue backlight from window behind camera. Deep shadow.\"\n    },\n    \"prop_strip_bottom\": \"6 close-up tiles: 1. LAVA LAMP — chrome base, blue-green wax blobs; 2. COFFEE TABLE — remote, mug, ashtray, magazines; 3. NIRVANA POSTER — black smiley face, wall texture; 4. CRT TELEVISION — static screen, VHS stack; 5. WINDOW/RAIN — city bokeh, water streaks; 6. THROW BLANKET — sofa corner, worn upholstery\",\n    \"top_right_inset\": \"SOURCE REF thumbnail — original photo\",\n    \"footer\": \"2700K PRACTICAL · 4100K CITY NIGHT · 24mm · 35MM\"\n  },\n  \"background\": \"deep charcoal #1a1a1a, thin white separators\",\n  \"dimensions\": \"wide landscape 3:1, high resolution\"\n}"
  },
  {
    id: "awesome-case-211",
    title: "天坛古建拆解全图",
    category: "空间",
    tags: ["建筑","拆解","中式"],
    description: "中式建筑拆解说明图，用标注和分层展示古建结构。",
    sampleImageUrl: "/examples/awesome-case-211.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "[中文]\n生成一个天坛的建筑拆解图，有详细的说明，中式美学风格\n\n[English]\nGenerate an architectural exploded view of the Temple of Heaven, with detailed annotations, Chinese aesthetic style"
  },
  {
    id: "awesome-case-187",
    title: "韩系极简氛围感少女写真",
    category: "人物",
    tags: ["写真","人物","韩系"],
    description: "韩系极简氛围写真模板，适合干净柔和的人像摄影风格。",
    sampleImageUrl: "/examples/awesome-case-187.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "[中文]\n9:16 竖版 — 杂志人像，单一主体  柔和的黑色迷雾滤镜，微妙的薄雾，柔和的高光泛光，柔和的色调  极简的室内空间，干净的背景，轻微的纹理  年轻韩国女性，淡妆，自然的皮肤纹理  服装：贴身的罗纹针织上衣或柔软的吊带背心叠穿在宽松衬衫下，搭配高腰短裤或裙子；面料轻微贴合身体曲线，柔软自然，无暴露元素  头发：略显凌乱，自然的蓬松度  姿势：坐在地板上，一条腿弯曲，另一条腿放松，身体微微倾斜，肩膀不对称，头部倾斜  构图：主体略微偏离中心，存在留白  表情：平静，略显疏离，自然的嘴唇  光线：柔和的侧光，温和的阴影衰减  氛围：低调，安静，通过自然的身体线条展现微妙的性感，放松且非摆拍  画质：细腻颗粒，轻微的柔和感，写实外观\n\n[English]\n9:16 vertical — editorial portrait, single subject  soft black mist filter, subtle haze, gentle highlight bloom, muted tones  minimal indoor space, clean background, slight texture  young Korean woman, minimal makeup, natural skin texture  outfit: fitted ribbed knit top or soft camisole layered under a loose shirt, paired with high-waisted shorts or skirt; fabric slightly clings to body shape, soft and natural, no revealing elements  hair: slightly messy, natural volume  pose: sitting on floor with one leg bent and the other relaxed, body slightly leaning, shoulders not aligned, head tilted  composition: subject slightly off-center, negative space present  expression: calm, slightly distant, natural lips  lighting: soft side light, gentle shadow falloff  mood: understated, quiet, subtly sensual through natural body lines, relaxed and unposed  quality: fine grain, slight softness, realistic look"
  },
  {
    id: "awesome-case-113",
    title: "动漫插画创作图",
    category: "插画",
    tags: ["动漫","插画","角色"],
    description: "高细节动漫战士插画，适合角色封面和幻想题材视觉。",
    sampleImageUrl: "/examples/awesome-case-113.jpg",
    defaultAspectRatio: "4:3",
    originalPrompt: "A highly detailed anime illustration of a fierce female warrior with long flowing {argument name=\"hair color\" default=\"black\"} hair and piercing {argument name=\"eye color\" default=\"blue\"} eyes, wearing a mix of silver plate armor with gold trim and a {argument name=\"outfit color\" default=\"blue and white\"} tunic. She is captured in a dynamic combat stance, swinging a massive, {argument name=\"weapon type\" default=\"segmented metallic whip-sword\"} that curves dramatically into the extreme foreground. The weapon leaves a sweeping trail of kinetic energy and wind. The scene is set against a {argument name=\"background setting\" default=\"ruined battlefield with rocky terrain, floating debris, and large blue banners fluttering in the wind\"} under a dramatic cloudy sky. The artwork features cinematic lighting, intense action, and a dramatic forced perspective on the weapon."
  },
  {
    id: "awesome-case-452",
    title: "极简童话手绘儿童插画",
    category: "插画",
    tags: ["插画","童话","手绘"],
    description: "极简童话手绘插画，把照片或主题转成柔和儿童绘本感。",
    sampleImageUrl: "/examples/awesome-case-452.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "Transform the photo into a delicate minimalist hand-drawn children’s illustration with a soft whimsical fairy-tale aesthetic. Use simple elongated shapes, thin imperfect hand-drawn lines, flat pastel colors, minimal details, and a cute doll-like character style with rosy cheeks, tiny facial features, and simplified anatomy. Add subtle paper texture, soft pencil and pastel shading, watercolor softness, and a clean white background with small stars or sparkles.\n\nStylize the clothing in a playful storybook way with simplified shapes and gentle decorative details. The overall mood should feel airy, cozy, naive, and charming, like a modern Scandinavian nursery postcard or children’s book illustration. Avoid photorealism, 3D, cinematic lighting, glossy surfaces, complex shadows, realistic anatomy, and hyper-detail."
  },
  {
    id: "awesome-case-27",
    title: "人物角色设定图",
    category: "人物",
    tags: ["人物","角色","设定"],
    description: "人物角色设定照片集合，适合展示发型、服装和道具变化。",
    sampleImageUrl: "/examples/awesome-case-27.jpg",
    defaultAspectRatio: "4:3",
    originalPrompt: "{\n  \"type\": \"collection of instant photos\",\n  \"setting\": \"laid out flat on a white fabric surface\",\n  \"character\": {\n    \"hair\": \"{argument name=\\\"hair color\\\" default=\\\"long pink hair with blue inner color\\\"}\",\n    \"outfit\": \"{argument name=\\\"outfit\\\" default=\\\"black and white maid uniform with frilly headband and black ribbons\\\"}\",\n    \"eyes\": \"reddish-pink\"\n  },\n  \"layout\": {\n    \"arrangement\": \"two rows of five polaroid photos\",\n    \"count\": 10,\n    \"photos\": [\n      { \"position\": \"top row 1\", \"description\": \"holding a pink heart cushion\" },\n      { \"position\": \"top row 2\", \"description\": \"winking, making a peace sign\" },\n      { \"position\": \"top row 3\", \"description\": \"making a hand heart, pink heart doodle on the bottom border\" },\n      { \"position\": \"top row 4\", \"description\": \"resting chin on hands, gentle smile\" },\n      { \"position\": \"top row 5\", \"description\": \"holding a red rose, winking\" },\n      { \"position\": \"bottom row 1\", \"description\": \"finger to lips, shy expression\" },\n      { \"position\": \"bottom row 2\", \"description\": \"holding a small pink cake\" },\n      { \"position\": \"bottom row 3\", \"description\": \"winking, hand near face, signature '{argument name=\\\"signature text\\\" default=\\\"Hanashi\\\"}' and heart doodle on border\" },\n      { \"position\": \"bottom row 4\", \"description\": \"holding a pink bunny plushie, sparkle doodles, signature '{argument name=\\\"signature text\\\" default=\\\"Hanashi\\\"}' and bunny doodle on border\" },\n      { \"position\": \"bottom row 5\", \"description\": \"winking, sparkle doodles, message '{argument name=\\\"message text\\\" default=\\\"いつも応援ありがとう！これからもよろしくね♪\\\"}' and signature '{argument name=\\\"signature text\\\" default=\\\"Hanashi\\\"}' on border\" }\n    ]\n  }\n}"
  },
  {
    id: "awesome-case-206",
    title: "国风工笔八仙长卷插画",
    category: "海报",
    tags: ["国风","长卷","工笔"],
    description: "国风工笔人物长卷，适合神话、历史和群像百科海报。",
    sampleImageUrl: "/examples/awesome-case-206.jpg",
    defaultAspectRatio: "16:9",
    originalPrompt: "[中文]\n（国风卷轴插画师）你是一位顶尖的中国传统工笔人物画师，擅长将经典人物群像绘制成长卷式百科海报。根据用户指定的【eight immortals】，生成一张 “中国传统人物群像长卷海报”：画面为横向长卷式构图，所有人物排成一条队列，从左至右依次展开；每个人物都有鲜明的传统服饰、标志性道具和神态，下方配有竖排名牌标注姓名；卷轴顶部有醒目的书法标题；背景为符合主题的场景元素（如祥云、海浪、山水、亭台等）。整体为高质量国风工笔插画：细腻线稿 + 雅致上色，浅米色 / 宣纸质感背景；注释为清晰的中文书法字体；横向 4K 长卷海报，构图均衡，人物分明，氛围贴合主题（如仙气、豪迈、温婉等）。直接出图，人物群像为【eight immortals】。\n\n[English]\n(Guofeng scroll illustrator) You are a top Chinese traditional Gongbi figure painter, skilled in painting classic character group portraits into long-scroll-style encyclopedia posters. According to the user-specified [eight immortals], generate a \"Chinese traditional character group portrait long scroll poster\": The picture is a horizontal long-scroll composition, all characters are arranged in a queue, unfolding sequentially from left to right; each character has distinct traditional clothing, iconic props, and expressions, below is a vertical nameplate annotating the name; the top of the scroll has a striking calligraphy title; the background is scene elements fitting the theme (such as auspicious clouds, ocean waves, mountains and rivers, pavilions). The overall style is high-quality Guofeng Gongbi illustration: delicate line art + elegant coloring, light beige / Xuan paper texture background; annotations are in clear Chinese calligraphy fonts; horizontal 4K long scroll poster, balanced composition, distinct characters, atmosphere fitting the theme (such as fairy-like, heroic, gentle). Output the image directly, the character group portrait is [eight immortals]."
  },
  {
    id: "awesome-case-207",
    title: "黑神话潘金莲绝美游戏封面",
    category: "海报",
    tags: ["游戏","封面","角色"],
    description: "游戏介绍画面模板，适合角色封面和暗黑幻想视觉。",
    sampleImageUrl: "/examples/awesome-case-207.jpg",
    defaultAspectRatio: "4:3",
    originalPrompt: "[中文]\n生成一张黑神话·潘金莲的游戏介绍画面，人物十分的迷人\n\n[English]\nGenerate a game introduction screen for Black Myth: Pan Jinlian, the character is extremely charming."
  },
  {
    id: "awesome-case-251",
    title: "言叶之庭春雨绿意单日历",
    category: "其他",
    tags: ["日历","单日","视觉"],
    description: "单日日历视觉，适合电影、动画和纪念日主题。",
    sampleImageUrl: "/examples/awesome-case-251.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "[中文]\n生成一张言叶之庭2026年4月19日单日日历\n\n[English]\nGenerate a single-day calendar for The Garden of Words on April 19, 2026"
  },
  {
    id: "awesome-case-248",
    title: "景德镇青花瓷全景解说图谱",
    category: "信息图",
    tags: ["信息图","青花瓷","解说"],
    description: "传统工艺解说图谱，适合器物、非遗和知识解析内容。",
    sampleImageUrl: "/examples/awesome-case-248.jpg",
    defaultAspectRatio: "4:3",
    originalPrompt: "[中文]\n为我生成景德镇青花瓷的详细解说图，配上详细的中文知识解析\n\n[English]\nGenerate a detailed explanatory diagram of Jingdezhen blue and white porcelain, accompanied by detailed Chinese knowledge analysis."
  },
  {
    id: "awesome-case-243",
    title: "定制专属风格界面设计系统",
    category: "UI",
    tags: ["UI","设计系统","控件"],
    description: "完整 UI 设计系统模板，适合生成网页、移动端、卡片和控件。",
    sampleImageUrl: "/examples/awesome-case-243.jpg",
    defaultAspectRatio: "1:1",
    originalPrompt: "[中文]\n用xx风格帮我生成一套UI设计系统，包含网页、移动端、卡片、控件、按钮 以及其它\n\n[English]\nGenerate a UI design system for me in xx style, including web pages, mobile, cards, controls, buttons, and others"
  },
  {
    id: "awesome-case-238",
    title: "星云巨鲤与小人的奇幻对话",
    category: "场景",
    tags: ["奇幻","场景","插画"],
    description: "超现实奇幻场景，用巨大主体和小人物制造梦幻叙事。",
    sampleImageUrl: "/examples/awesome-case-238.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "[中文]\n一幅超现实主义数字插画风格，采用低角度仰拍视角。画面描绘了一条巨型彩色锦鲤遨游在梦幻般的星云中，四周环绕着色彩鲜艳的星云与气泡。\n画面中央还站着一个小人，背对观众，神情平静地仰望空中这条巨大的锦鲤，锦鲤头向下看着小人。\n整体画面呈现出强烈的大小对比，氛围空灵又梦幻。比例9:16\n\n[English]\nA surrealist digital illustration style, adopting a low-angle upward perspective. The picture depicts a giant colorful koi swimming in a dreamy nebula, surrounded by colorful nebulae and bubbles. In the center of the picture stands a small figure, with their back to the audience, calmly looking up at this huge koi in the air, and the koi is looking down at the small figure. The overall picture presents a strong size contrast, and the atmosphere is ethereal and dreamy. Aspect ratio 9:16"
  },
  {
    id: "awesome-case-230",
    title: "极简国潮鎏金广州塔海报",
    category: "海报",
    tags: ["城市","国潮","海报"],
    description: "极简国潮城市海报，适合地标、文旅和东方意境主题。",
    sampleImageUrl: "/examples/awesome-case-230.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "[中文]\n新中式极简风格高端城市海报，9:16竖版构图，以广州为核心主题，画面中心为抽象几何化的广州塔，造型简洁但具有辨识度，\n\n整体采用S型流动构图，从下方向上延展，珠江水系被设计为流动的水波纹与传统祥云纹样融合，环绕整个画面形成视觉动线，\n\n广州地标建筑以“留白+线描+局部色块”的方式点缀其中：珠江新城双塔、猎德大桥、白云山轮廓、岭南骑楼，\n传统与现代建筑自然融合，层次递进，远近虚实分明，\n\n风格控制：极简 + 高级 + 东方意境，不杂乱不过度写实，\n\n色彩方案（重点）：\n高饱和但克制 ，中国红、青蓝、鎏金为主色，\n辅以少量暖金高光点缀，形成强烈视觉冲击但不俗艳，\n\n背景：大面积纯净留白或淡宣纸肌理，增强呼吸感与高级感，\n\n细节：祥云与水纹具有轻微浮雕/烫金质感，\n局部加入微光粒子或流动光线，增强现代感，\n\n光影：柔和渐变光+局部高光，突出恢弘大气氛围，\n\n整体风格：国潮高级插画 / 品牌海报级质感 / 8K / 超清细节\n\n[English]\nNeo-Chinese minimalist style high-end city poster, 9:16 vertical composition, with Guangzhou as the core theme, the center of the image is an abstract geometric Canton Tower, simple in shape but highly recognizable,\n\nThe overall adopts an S-shaped flowing composition, extending from bottom to top, the Pearl River water system is designed as flowing water ripples fused with traditional auspicious cloud patterns, surrounding the entire image to form a visual dynamic line,\n\nGuangzhou landmark buildings are embellished in it in the way of \"blank space + line drawing + local color blocks\": Zhujiang New Town Twin Towers, Liede Bridge, Baiyun Mountain outline, Lingnan arcade houses,\nTraditional and modern architecture naturally blend, progressive layers, clear distinction between far and near, virtual and real,\n\nStyle control: minimalist + high-end + Eastern artistic conception, not cluttered and not overly realistic,\n\nColor scheme (key point):\nHigh saturation but restrained, Chinese red, cyan blue, and gilded gold as the main colors,\nSupplemented by a small amount of warm gold highlight embellishments, forming a strong visual impact but not tacky,\n\nBackground: large area of pure blank space or light Xuan paper texture, enhancing a sense of breathing and high-end feel,\n\nDetails: auspicious clouds and water ripples have a slight relief/gold stamping texture,\nLocally add faint light particles or flowing light lines to enhance modernity,\n\nLight and shadow: soft gradient light + local highlights, highlighting a magnificent and grand atmosphere,\n\nOverall style: Guochao high-end illustration / brand poster-level texture / 8K / ultra-clear details"
  },
  {
    id: "awesome-case-229",
    title: "琉璃透明画眉鸟飞舞羊城墨卷",
    category: "海报",
    tags: ["国潮","墨卷","3D"],
    description: "黑底鎏金国潮墨卷视觉，适合城市文化和传统建筑叙事。",
    sampleImageUrl: "/examples/awesome-case-229.jpg",
    defaultAspectRatio: "9:16",
    originalPrompt: "[中文]\n【背景与骨架线条】\n纯黑深邃底色，一条粗壮有力的墨色书法S型曲线自画面一端蜿蜒贯穿至另一端，笔触苍劲，墨迹浓淡有致，如大写意行笔，构成整幅画面的视觉骨架与叙事动线。\n【主体：透明燕子】\n曲线上方，一只展翅飞翔的画眉鸟占据视觉核心；身体呈玻璃透明质感，内部映射传统建筑群叠影，蓝绿色光流在透明羽翼间流转折射，仿佛时间长河与文明记忆凝缩其中；轮廓以极细金线勾边，增强立体感与神圣感。\n【中景：古典建筑序列】\n燕子下方，沿墨线曲线错落分布广州的各种风景名胜：白云山、陈家祠、双子塔、广州塔、猎德大桥、海珠塔依次浮现；主色调青绿与淡金，建筑细节清晰，琉璃瓦、飞檐翘角、石阶回廊；木棉花簇拥点缀于建筑周围，花瓣随风轻散，静谧而悠远；几朵水墨云朵轻盈飘浮其间，增添空灵层次。\n【前景：白鹤与水面】\n前景湖畔：数只白鹤或静立水边、或振翅腾飞，姿态各异，优雅从容；浅蓝湖面如镜，倒影荡漾，波光细碎，营造宁静氛围。\n【远景：山峦】\n远处山峦层叠起伏，青黛色晕染，墨色由浓至淡，朦胧氤氲，富有水墨层次；与前景形成近实远虚的空间纵深。\n【构图与光影】\n非线性透视构图，墨线曲线为叙事主轴，古今元素沿线嵌入；光源自画面中心向外辐射扩散，形成强烈明暗对比，中心亮、四周渐暗；冷色调主导（深蓝、青绿、银白），暖色点缀（樱花粉、淡金），和谐而神秘；东方美学与现代意象交融，超现实诗意意境。\n【技术规格】\n8K超高清渲染，极致细节精度，最佳画质，比例 9:16\n\n[English]\n[\n  Background and Skeleton Lines\n] Pure black deep background,\na thick and powerful ink calligraphy S-shaped curve meanders from one end of the picture to the other,\nwith vigorous brushstrokes and well-proportioned ink shades,\nlike freehand brushwork,\nforming the visual skeleton and narrative dynamic line of the entire picture. [\n  Subject: Transparent Swallow\n] Above the curve,\na flying thrush with spread wings occupies the visual core; the body has a glass transparent texture,\nwith overlapping shadows of traditional architectural complexes mapped inside,\nblue-green light flows circulate and refract between the transparent wings,\nas if the long river of time and civilized memories are condensed within it; the outline is bordered with extremely thin gold lines to enhance three-dimensionality and sacredness. [\n  Midground: Classical Architecture Sequence\n] Below the swallow,\nvarious scenic spots in Guangzhou are scattered along the ink curve: Baiyun Mountain,\nChen Clan Ancestral Hall,\nTwin Towers,\nCanton Tower,\nLiede Bridge,\nHaizhu Tower appear in sequence; the main tone is cyan-green and pale gold,\narchitectural details are clear,\nglazed tiles,\nflying eaves,\nstone steps and corridors; kapok flowers cluster and decorate around the buildings,\npetals scatter lightly with the wind,\nquiet and distant; a few ink clouds float lightly among them,\nadding ethereal layers. [\n  Foreground: White Cranes and Water Surface\n] Lakeside in the foreground: several white cranes either stand quietly by the water or flap their wings to soar,\nwith different postures,\nelegant and calm; the light blue lake surface is like a mirror,\nreflections rippling,\nshimmering light,\ncreating a tranquil atmosphere. [\n  Distance: Mountains\n] Distant mountains rise and fall in layers,\nsmudged in cyan-black,\nink shades from thick to light,\nhazy and misty,\nrich in ink wash layers; forming a spatial depth with solid foreground and empty distance with the foreground. [\n  Composition and Light and Shadow\n] Non-linear perspective composition,\nthe ink curve is the main narrative axis,\nancient and modern elements are embedded along the line; the light source radiates and diffuses outward from the center of the picture,\nforming a strong contrast between light and dark,\nbright in the center and gradually darkening around; cool tones dominate (dark blue,\ncyan-green,\nsilver white),\nwarm tones embellish (cherry blossom pink,\npale gold),\nharmonious and mysterious; Eastern aesthetics blend with modern imagery,\nsurreal poetic mood. [\n  Technical Specifications\n] 8K ultra-high definition rendering,\nextreme detail precision,\nbest image quality,\nratio 9:16"
  },
  {
    id: "awesome-case-224",
    title: "机甲少女立于废弃海城",
    category: "场景",
    tags: ["机甲","场景","电影感"],
    description: "机甲少女电影场景，适合科幻角色、废墟和动作设定。",
    sampleImageUrl: "/examples/awesome-case-224.jpg",
    defaultAspectRatio: "16:9",
    originalPrompt: "[中文]\n一名十几岁的机甲少女，苍白的肌肤上沾着烟尘与海水飞沫，锐利的琥珀色眼眸中映出发光的 HUD 瞄准标线；及腰的灰白色长发扎成高马尾，在海风中肆意飞扬。哑光枪灰色外骨骼装甲覆盖双肩、前臂与小腿，关节处裸露着液压活塞，胸挂布有发光的青蓝色冷却管线。一件沾着油污的超大号机库外套半滑落在一侧肩头，一门巨型轨道炮架在右肩，衣领处挂着士兵牌与磨损的红色丝带。\n她站在向左略微偏移的位置，立于倾斜钢铁平台的锈蚀边缘，平台向外延伸至漆黑海面之上；重心落在单腿上，左手紧握炮带，头部微转向镜头，投来沉静而桀骜的目光。背部推进器不断喷出蒸汽，马尾与外套在咸腥海风里向一侧狂乱飘动。\n背景是黄昏时分广袤的废弃海上都市，用途不明的巨型超级建筑从海洋中拔地而起，形成错落的剪影；骨白色的巨型塔楼与附着藤壶的钢铁结构融为一体，巨大的环形建筑以破碎的角度倾斜矗立，锈蚀的桁架骨架间缠绕着废弃线缆，深色浪涛在支撑柱间翻涌，数艘沉船半淹在柱脚。厚重的海雾萦绕在建筑底部，高耸的结构直刺入暗沉的天空，塔楼高处零星闪烁着微弱灯光，宛如遥远的眼眸。\n画面采用阴郁低调的光影：阴沉天空透出冷调青蓝环境光，画面右侧远处建筑漏出温暖的琥珀色钠灯光晕，塔楼后方低垂的太阳形成强烈逆光，勾勒出她的轮廓；体积光穿透海雾，装甲上呈现湿润的镜面高光。\n镜头使用 35mm 变形宽银幕镜头，略微低角度仰拍，越过她的肩膀望向远处建筑群；中全景构图，浅景深使前景的锈蚀景物虚化，带有横向镜头眩光，细腻的大气薄雾将远处巨型建筑压缩为层次分明的剪影。\n整体为电影感动漫主视觉风格，绘画感数字插画搭配利落线稿，采用青蓝、骨白与铁锈色为主的低饱和海洋色调，点缀少量暖色调高光；添加胶片颗粒，呈现高对比度的艺术海报质感，画幅比例 16:9。\n\n[English]\nA mecha girl mid-teens, pale skin smudged with soot and salt spray, sharp amber eyes with glowing HUD reticles, waist-length ash-white hair tied in a high ponytail whipping in the sea wind, matte gunmetal exoskeleton armor plating her shoulders, forearms and shins, exposed hydraulic pistons at the joints, chest rig with glowing cyan coolant lines, oversized oil-stained hangar jacket half slipping off one shoulder, a massive rail cannon resting on her right shoulder, dog tags and frayed red ribbon at her collar , standing off-center to the left on the rusted edge of a tilted steel platform jutting out over dark water, weight shifted onto one leg, left hand gripping the cannon strap, head turned slightly toward camera with a quiet defiant stare, steam venting from her back thrusters, her ponytail and jacket streaming sideways in the salt wind , a vast derelict sea-city at dusk, colossal megastructures of unknown purpose rising from the ocean in staggered silhouettes, bone-white monolithic towers fused with barnacled steel, cyclopean ring-shaped constructs canted at broken angles, rusted skeletal gantries threaded with dead cables, dark swells rolling between the pylons, shipwrecks half-swallowed at their feet, thick sea fog clinging to the bases while the upper structures pierce into a bruised sky, scattered faint lights blinking high in the towers like distant eyes , moody low-key lighting, cold teal ambient from the overcast sky, warm amber sodium glow leaking from a distant structure camera-right, hard backlight from a low sun behind the towers carving her silhouette, volumetric god rays cutting through sea mist, wet specular highlights on her armor , 35mm anamorphic lens, slight low angle looking up past her shoulder toward the structures, medium-wide shot, shallow depth of field with foreground rust in soft focus, horizontal lens flares, fine atmospheric haze compressing the distant megastructures into layered silhouettes , cinematic anime key visual, painterly digital illustration with crisp line art, desaturated oceanic palette of teal, bone-white and rust punched by small warm accent lights, film grain, high-contrast editorial poster aesthetic . Format 16:9."
  },
  {
    id: "awesome-case-222",
    title: "精致模块化科普百科图鉴",
    category: "信息图",
    tags: ["信息图","百科","模块化"],
    description: "精致模块化百科图鉴，适合社媒传播型知识卡和主题解说。",
    sampleImageUrl: "/examples/awesome-case-222.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "[中文]\n请根据【主题】生成一张高质量竖版「科普百科图」。\n\n这张图不是普通海报，也不是单纯插画，而是一张兼具“图鉴感、百科感、信息结构感、收藏感”的模块化科普信息图。整体风格参考高级博物图鉴、现代百科书页、生活方式知识卡和社交媒体高传播信息图的结合。\n\n请让画面包含：\n- 一个清晰漂亮的主题主视觉\n- 若干局部特征放大细节\n- 多个圆角模块化信息分区\n- 清楚的标题层级与重点标签\n- 简洁但丰富的百科内容\n- 可视化评分、要点总结或Top 5模块\n\n内容栏目请根据主题自动适配，优先从这些方向中选择并合理组合：\n基础档案、分类信息、外观特征、习性/生态、形成机制/结构组成、生长或使用条件、养护或维护建议、风险与注意事项、适合人群或适用场景、优缺点对比、快速评分卡。\n\n视觉要求：\n浅色干净背景，柔和配色，轻阴影，精致小图标，圆角信息框，整洁排版，信息密度高但不拥挤，阅读体验好。整体必须像真正可以发布、阅读、收藏、系列化生产的科普百科卡，而不是广告图。\n\n请不要做成普通商业宣传海报。要突出“知识整理 + 模块信息 + 图鉴式展示”的特征。\n\n[English]\nPlease generate a high-quality vertical \"Popular Science Encyclopedia Infographic\" based on the [Topic].\n\nThis image is not an ordinary poster, nor a simple illustration, but a modular popular science infographic with a sense of \"illustrated guide, encyclopedia, information structure, and collectibility\". The overall style references a combination of high-end natural history illustrated guides, modern encyclopedia pages, lifestyle knowledge cards, and highly shared social media infographics.\n\nPlease make the image contain:\n- A clear and beautiful theme main visual\n- Several enlarged details of local features\n- Multiple rounded modular information sections\n- Clear title hierarchy and key tags\n- Concise but rich encyclopedia content\n- Visualized scoring, key point summaries, or Top 5 modules\n\nContent columns should automatically adapt to the topic, prioritizing selection and reasonable combination from these directions:\nBasic profile, classification information, appearance features, habits/ecology, formation mechanism/structural composition, growth or usage conditions, care or maintenance suggestions, risks and precautions, suitable groups or applicable scenarios, pros and cons comparison, quick scorecard.\n\nVisual requirements:\nLight-colored clean background, soft color palette, light shadows, exquisite small icons, rounded information boxes, neat typography, high information density but not crowded, good reading experience. The overall look must be like a real popular science encyclopedia card that can be published, read, collected, and serialized, rather than an advertisement.\n\nPlease do not make it into an ordinary commercial promotional poster. It must highlight the characteristics of \"knowledge organization + modular information + illustrated guide style display\"."
  },
  {
    id: "awesome-case-218",
    title: "绘制科学百科知识图谱",
    category: "信息图",
    tags: ["信息图","知识图谱","科学"],
    description: "复杂科学百科知识图谱，适合人物、动物、植物等深度信息图。",
    sampleImageUrl: "/examples/awesome-case-218.jpg",
    defaultAspectRatio: "3:4",
    originalPrompt: "[中文]\n角色：世界级科学百科插画师兼知识图谱架构师\n任务：以经典、无品牌标识（无任何 Logo）的科学百科风格，创作一幅细节极致丰富、结构极其精巧、视觉效果惊艳的「环球图解百科科学信息图」。\n题材选择：从【人物、植物、动物】中任选其一。\n具体对象：【例如：大王乌贼 / 列奥纳多・达・芬奇 / 红杉树】\n风格：采用复古泛黄米色纸张背景，绘制精细工整的科学插画；线条细腻精致，整体繁复专业、严谨考究。\n核心视觉要求\n主体逼真 3D 效果\n位于画面视觉中心（C 位）的主体形象，需具备极致的写实感与动态张力。营造强烈的空间纵深感，让人物、植物或动物仿佛突破画框，从平面纸张中跃出、冲向观者（效果类似变形 3D 或动态弹出效果，高精度写实呈现）。\n版式布局与留白设计\n主体位置：占据画面中心，周围刻意设置规划式留白，强化立体弹出效果，使其成为绝对视觉焦点。\n周边模块：根据所选题材，在画面四周（上下左右及四角）排布 6–8 个独立且规整有序的知识模块。整体呈现规整的信息密度感，而非杂乱堆砌。每个模块需带有清晰边框、标题栏与详尽丰富的内容。\n关联结构\n运用纤细的指示线、箭头、括号、虚线与小型连接点，构建复杂且逻辑清晰的网络，将中心主体与所有周边模块相连，并使各模块之间相互关联，形成完整统一的知识体系。\n文字与标注（硬性要求：必须为清晰中文）\n主标题：以醒目大气、笔法优美的中文书法字体呈现具体对象名称【例如：大王乌贼】。\n书法点缀：在主体画面与模块标题中，对关键术语使用工整美观的中文书法字体标注。\n标准中文文本：其余所有说明文字、大量清晰中文手写注释、模块内容及注解均使用清晰可辨的简体汉字，不得出现乱码或无法识别符号，优先保证文字可读性。\n指示线标注：模块内所有细小结构、细节、子模块、图表与插画，均需搭配详尽的指示线标注（仿解剖图形式），直接指向对应部位，最大化体现专业性与科普价值，做到每一处结构均有标注。\n分题材模块结构（参考示例）\nA. 人物类\n模块 1：解剖结构与骨骼系统（含放大剖面图示）\n模块 2：生理运作机制（如循环系统、神经系统）\n模块 3：生平背景与时间线（核心成就）\n模块 4：主要贡献图解（详细拆解）\n模块 5：认知模式与心理特征\n模块 6：基因特征与演化溯源\n模块 7：全球影响力与文化冲击\n模块 8：艺术形象与后世传承\nB. 动物类\n模块 1：整体外形草图与解剖结构（含显微镜级圆形放大细节）\n模块 2：行为模式与生命周期（如交配、迁徙，流程图形式）\n模块 3：消化系统与骨骼系统\n模块 4：栖息环境与分布地图（含环境细节）\n模块 5：独特适应性特征（如伪装、捕食器官）\n模块 6：演化历史与亲缘物种\n模块 7：共生关系与生态位作用\n模块 8：保护现状与人类互动\nC. 植物类\n模块 1：植株整体草图与解剖结构（含叶片、根部放大细节）\n模块 2：光合作用与生命周期流程（搭配环境示意图标）\n模块 3：细胞结构（圆形放大视图）\n模块 4：药用价值与实际应用\n模块 5：环境适应性与独有特征\n模块 6：分布地图与生长环境\n模块 7：基因变异与培育方式\n模块 8：历史用途与民间传说\n整体构图要求\n信息密度极高，规整划分为 6–8 个结构化模块，同时通过中心区域的规划留白突出超写实主体的立体弹出效果。风格硬核、专业、学术化，凭借动态 3D 主体实现极强视觉吸引力。\n无任何百科品牌标识（如 DK 等 Logo）。\n所有标注清晰可辨，所有手写注释工整可读。\n主标题采用中文书法字体。\n画面比例：3:4。\n【主题内容】\n\n[English]\nRole: World-class Scientific Encyclopedia Illustrator & Knowledge Graph Architect.\n\nTask: Generate a highly detailed, extremely intricate, and visually stunning \"Universal Illustrated Encyclopedia Science Infographic\" in a classic, unbranded (NO logos) scientific encyclopedia style.\n\nSubject Matter: Choose one from [People, Plants, or Animals].\n\nSpecific Subject: [e.g., The Giant Squid / Leonardo da Vinci / The Sequoia Tree].\n\nStyle: Fine, detailed scientific illustration on a retro, aged beige paper background. Delicate linework. Intricately complex and professional.\n\nKey Visual Requirements:\n\n1.  Lifelike 3D Effect (The Central Subject): The central subject in the \"C position\" must be rendered with extraordinary realism and dynamism. Create a dramatic sense of depth where the character, plant, or animal appears to break the frame, leaping or bursting out of the flat paper towards the viewer (an effect similar to anamorphic 3D or dynamic pop-out, with high-precision realism).\n\n2.  Layout & Strategic White Space:\n    * Central Subject: Dominates the center, with intentional \"strategic white space\" around it to enhance the popping-out effect and make the figure the clear focal point.\n    * Surrounding Modules: The surrounding area (left, right, top, bottom, and corners) must be filled with 6-8 distinct, highly organized knowledge modules, depending on the subject. There should be a sense of organized density, not random clutter. The modules themselves must have clear borders, headers, and extensive, detailed content.\n\n3.  Connections: Use a complex, logical network of fine leader lines, arrows, brackets, dotted lines, and small connection points to link the central figure to all surrounding modules, and interconnect the modules themselves into a cohesive knowledge web.\n\n4.  Text & Annotation (Hard Requirement - Must be CLEAR Chinese):\n    * Main Title: A large, prominent, beautifully executed **Chinese calligraphy** (书法体) of the specific subject's name [e.g., \"大王乌贼\"].\n    * Calligraphic Accents: Scattered throughout the main content and module titles, use beautiful, clear Chinese calligraphy for important terms.\n    * Standard Chinese Text: All other descriptive text, handwritten notes (大量清晰中文手写注释), module content, and annotations must be clear, legible Chinese characters (简体中文), not gibberish or unreadable symbols. Ensure text clarity is prioritized.\n    * Leader Line Annotations: Every single small component, detail, submodule, diagram, or illustration within the modules must have detailed leader line annotations (拟解剖图) pointing directly to it for maximum professionalism and educational value. Every part should be labeled.\n\nSubject-Specific Module Structure (Example for general reference):\n\nA. For Humans [People]:\n   - Module 1: Anatomy & Skeletal Structure (w/ magnified cross-sections)\n   - Module 2: Physiological Processes (e.g., Circulatory/Nervous System)\n   - Module 3: Historical Context & Timeline (Key Achievements)\n   - Module 4: Major Contribution Diagram (Detailed breakdown)\n   - Module 5: Cognitive Process / Psychological Insight\n   - Module 6: Genetic Profile / Evolution\n   - Module 7: Global Influence & Cultural Impact\n   - Module 8: Cultural Representations / Legacy\n\nB. For Animals:\n   - Module 1: Full External Sketch & Anatomy (w/ microscope magnified detail circular windows)\n   - Module 2: Behavioral Patterns & Lifecycle (e.g., Mating/Migration, Flowchart style)\n   - Module 3: Digestive & Skeletal System\n   - Module 4: Habitats & Distribution Map (with environmental details)\n   - Module 5: Unique Adaptations (e.g., camouflage, hunting tools)\n   - Module 6: Evolutionary History & Relatives\n   - Module 7: Symbiotic Relationships / Ecosystem Role\n   - Module 8: Conservation Status & Human Interaction\n\nC. For Plants:\n   - Module 1: Full Plant Sketch & Anatomy (w/ magnified leaf/root details)\n   - Module 2: Photosynthesis & Lifecycle Flow (w/ icons for environment)\n   - Module 3: Cellular Structure (Magnified circular views)\n   - Module 4: Medicinal Properties / Practical Applications (as in original original prompt)\n   - Module 5: Environmental Adaptations / Unique Features\n   - Module 6: Distribution Map & Environmental Context\n   - Module 7: Genetic Variations & Cultivation\n   - Module 8: Historical Usage & Folklore\n\nOverall Composition: Extremely dense with information, organized into 6-8 structured modules, but balanced with strategic empty space around the center to allow the main, hyper-realistic figure to pop. Hard-core, professional, academic, but visually engaging due to the dynamic 3D central figure. No branding from any specific encyclopedia (e.g., no \"DK\" logos). All annotations must be legible. All handwritten notes must be clear. Main titles in Chinese calligraphy. Aspect Ratio: 3:4.\n\n[主题内容]"
  }
];

export function findExampleById(id: string): PromptExample | null {
  return examples.find((example) => example.id === id) ?? null;
}

export function filterExamples({
  category,
  query
}: {
  category: string;
  query: string;
}): PromptExample[] {
  const normalizedQuery = query.trim().toLowerCase();

  return examples.filter((example) => {
    const matchesCategory = category === "全部" || example.category === category;
    const haystack = [
      example.title,
      example.category,
      example.description,
      example.originalPrompt,
      ...example.tags
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
