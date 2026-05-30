import { Radical } from "../types";

// Raw basic data for all 214 radicals to save code size
// Format: "id|character|variant|strokes|pinyin|hanViet|meaning|category|frequency"
const rawRadicalsData: string[] = [
  // 1 nét
  "1|一||1|yī|NHẤT|Số một|Tự nhiên|high",
  "2|丨||1|gǔn|CỔN|Nét sổ thẳng|Trạng thái & Hành động|low",
  "3|丶||1|zhǔ|CHỦ|Điểm, dấu chấm|Trạng thái & Hành động|low",
  "4|丿||1|piě|PHIỆT|Nét phẩy|Trạng thái & Hành động|low",
  "5|乙|⺄|1|yǐ|ẤT|Vị trí thứ hai|Trạng thái & Hành động|medium",
  "6|亅||1|jué|QUYẾT|Móc, nét móc|Trạng thái & Hành động|low",
  // 2 nét
  "7|二||2|èr|NHỊ|Số hai|Tự nhiên|high",
  "8|亠||2|tóu|ĐẦU|Không có nghĩa (che chở)|Đồ vật & Công cụ|low",
  "9|人|亻|2|rén|NHÂN|Con người|Con người & Cơ thể|high",
  "10|儿||2|ér|NHÂN (ĐI)|Người đi, chân người|Con người & Cơ thể|medium",
  "11|入||2|rù|NHẬP|Vào, đi vào|Trạng thái & Hành động|medium",
  "12|八|丷|2|bā|BÁT|Số tám, chia ra|Tự nhiên|high",
  "13|冂||2|jiōng|QUYNH|Vùng biên giới xa|Tự nhiên|low",
  "14|冖||2|mì|MỊCH|Khăn trùm đầu|Đồ vật & Công cụ|medium",
  "15|冫||2|bīng|BĂNG|Nước đá, lạnh|Tự nhiên|high",
  "16|几||2|jī|KỶ|Cái ghế nhỏ, cái bàn|Đồ vật & Công cụ|medium",
  "17|凵||2|qiǎn|KHẢM|Há miệng, hố sâu|Đồ vật & Công cụ|low",
  "18|刀|刂|2|dāo|ĐAO|Con dao, vũ khí|Đồ vật & Công cụ|high",
  "19|力||2|lì|LỰC|Sức mạnh|Con người & Cơ thể|high",
  "20|勹||2|bāo|BAO|Bao bọc, ôm lấy|Trạng thái & Hành động|medium",
  "21|匕||2|bǐ|CHỦY|Cái thìa, cái muỗng|Đồ vật & Công cụ|medium",
  "22|匚||2|fāng|PHƯƠNG|Tủ đựng đồ|Đồ vật & Công cụ|low",
  "23|匸||2|xì|HỆ|Che đậy, giấu kín|Trạng thái & Hành động|low",
  "24|十||2|shí|THẬP|Số mười|Tự nhiên|high",
  "25|卜||2|bǔ|BỐC|Xem bói toán|Trạng thái & Hành động|medium",
  "26|卩|⺋|2|jié|TIẾT|Đốt tre, điều khiển|Đồ vật & Công cụ|medium",
  "27|厂||2|hǎn|HÁN|Sườn núi, vách đá|Tự nhiên|medium",
  "28|厶||2|sī|KHƯ|Riêng tư, cá nhân|Con người & Cơ thể|medium",
  "29|又||2|yòu|HỰU|Lại nữa, bàn tay phải|Con người & Cơ thể|high",
  // 3 nét
  "30|口||3|kǒu|KHẨU|Cái miệng|Con người & Cơ thể|high",
  "31|囗||3|wéi|VI|Vây quanh, bao quanh|Tự nhiên|high",
  "32|土||3|tǔ|THỔ|Đất, địa cầu|Tự nhiên|high",
  "33|士||3|shì|SĨ|Kẻ sĩ, người trí thức|Con người & Cơ thể|high",
  "34|夂||3|zhǐ|TRUY|Đi chậm|Trạng thái & Hành động|low",
  "35|夊||3|suī|SÚY|Đi chậm trễ|Trạng thái & Hành động|low",
  "36|夕||3|xī|TỊCH|Buổi tối, đêm tối|Tự nhiên|high",
  "37|大||3|dà|ĐẠI|To lớn, vĩ đại|Trạng thái & Hành động|high",
  "38|女||3|nǚ|NỮ|Phụ nữ, con gái|Con người & Cơ thể|high",
  "39|子||3|zǐ|TỬ|Con cái, trẻ nhỏ|Con người & Cơ thể|high",
  "40|宀||3|mián|MIÊN|Mái nhà, che chở|Đồ vật & Công cụ|high",
  "41|寸||3|cùn|THỐN|Đơn vị tấc (đo lường)|Đồ vật & Công cụ|medium",
  "42|小|⺌|3|xiǎo|TIỂU|Nhỏ bé|Trạng thái & Hành động|high",
  "43|尢|兀|3|yóu|UÔNG|Yếu đuối, què quặt|Con người & Cơ thể|low",
  "44|尸||3|shī|THI|Xác chết, thân thể|Con người & Cơ thể|medium",
  "45|屮||3|chè|TRIỆT|Cỏ mới mọc|Động vật & Thực vật|low",
  "46|山||3|shān|SƠN|Núi non, cao ráo|Tự nhiên|high",
  "47|巛|川|3|chuān|XUYÊN|Sông ngòi, dòng chảy|Tự nhiên|high",
  "48|工||3|gōng|CÔNG|Thợ thủ công, công việc|Đồ vật & Công cụ|high",
  "49|己|已|3|jǐ|KỶ|Bản thân mình|Con người & Cơ thể|high",
  "50|巾||3|jīn|CÂN|Cái khăn, vải vóc|Đồ vật & Công cụ|medium",
  "51|干||3|gān|CAN|Thiên can, xúc phạm|Tự nhiên|medium",
  "52|幺||3|yāo|YÊU|Nhỏ nhắn, tơ sợi|Trạng thái & Hành động|medium",
  "53|广||3|guǎng|QUẢNG|Mái nhà rộng, sườn núi|Đồ vật & Công cụ|high",
  "54|廴||3|yǐn|DẪN|Đi dài, bước dài|Trạng thái & Hành động|medium",
  "55|廾||3|gǒng|CỦNG|Chắp tay cung kính|Con người & Cơ thể|low",
  "56|弋||3|yì|DỰC|Bắn cung, mũi tên|Đồ vật & Công cụ|low",
  "57|弓||3|gōng|CUNG|Cái cung (bắn tên)|Đồ vật & Công cụ|medium",
  "58|彐|彑|3|jì|KỆ|Đầu con heo rừng|Động vật & Thực vật|low",
  "59|彡||3|shān|SÂM|Tóc dài, họa tiết|Con người & Cơ thể|medium",
  "60|彳||3|chì|XÍCH|Bước ngắn chân trái|Trạng thái & Hành động|high",
  // 4 nét
  "61|心|忄|4|xīn|TÂM|Quả tim, tấm lòng|Con người & Cơ thể|high",
  "62|戈||4|gē|QUA|Cái mác (vũ khí)|Đồ vật & Công cụ|high",
  "63|戶|户|4|hù|HỘ|Cửa một cánh, gia đình|Đồ vật & Công cụ|medium",
  "64|手|扌|4|shǒu|THỦ|Bàn tay, hành động|Con người & Cơ thể|high",
  "65|支||4|zhī|CHI|Chi nhánh, cành cây|Động vật & Thực vật|medium",
  "66|攴|攵|4|pū|PHỐC|Gõ nhẹ, đánh khẽ|Trạng thái & Hành động|high",
  "67|文||4|wén|VĂN|Văn chương, chữ viết|Đồ vật & Công cụ|high",
  "68|斗||4|dǒu|ĐẤU|Cái đấu đo lường|Đồ vật & Công cụ|low",
  "69|斤||4|jīn|CÂN|Cái rìu, đơn vị cân|Đồ vật & Công cụ|medium",
  "70|方||4|fāng|PHƯƠNG|Hình vuông, hướng đi|Tự nhiên|high",
  "71|无|無|4|wú|VÔ|Không có|Trạng thái & Hành động|medium",
  "72|日||4|rì|NHẬT|Mặt trời, ngày|Tự nhiên|high",
  "73|曰||4|yuē|VIẾT|Nói rằng, xướng ca|Con người & Cơ thể|medium",
  "74|月||4|yuè|NGUYỆT|Mặt trăng, tháng, thịt|Tự nhiên|high",
  "75|木||4|mù|MỘC|Cây cối, gỗ|Động vật & Thực vật|high",
  "76|欠||4|qiàn|KHIẾM|Thiếu thốn, ngáp dài|Con người & Cơ thể|medium",
  "77|止||4|zhǐ|CHỈ|Dừng lại, bàn chân|Trạng thái & Hành động|high",
  "78|歹|歺|4|dǎi|ĐÃI|Xương tàn, xấu xa|Trạng thái & Hành động|medium",
  "79|殳||4|shū|THÙ|Binh khí dài bằng tre|Đồ vật & Công cụ|low",
  "80|毋|母|4|wú|VÔ|Chớ, không nên (Mẹ)|Con người & Cơ thể|medium",
  "81|比||4|bǐ|BỈ|So sánh, kề cạnh|Trạng thái & Hành động|medium",
  "82|毛||4|máo|MAO|Lông loài thú, râu|Động vật & Thực vật|medium",
  "83|氏||4|shì|THỊ|Dòng họ, họ tộc|Con người & Cơ thể|low",
  "84|气||4|qì|KHÍ|Hơi nước, không khí|Tự nhiên|high",
  "85|水|氵|4|shuǐ|THỦY|Nước, dòng sông|Tự nhiên|high",
  "86|火|灬|4|huǒ|HỎA|Ngọn lửa, sức nóng|Tự nhiên|high",
  "87|爪|爫|4|zhǎo|TRẢO|Móng vuốt chim thú|Động vật & Thực vật|medium",
  "88|父||4|fù|PHỤ|Người cha, tráng sỹ|Con người & Cơ thể|high",
  "89|爻||4|yáo|HÀO|Hào quẻ Kinh Dịch|Trạng thái & Hành động|low",
  "90|爿|丬|4|qiáng|TƯỜNG|Tấm phản, mảnh gỗ|Đồ vật & Công cụ|low",
  "91|片||4|piàn|PHIẾN|Mảnh tre, lát mỏng|Đồ vật & Công cụ|medium",
  "92|牙||4|yá|NHA|Răng loài thú|Con người & Cơ thể|medium",
  "93|牛|牜|4|niú|NGƯU|Con trâu, con bò|Động vật & Thực vật|high",
  "94|犬|犭|4|quǎn|KHUYỂN|Con chó|Động vật & Thực vật|high",
  // 5 nét
  "95|玄||5|xuán|HUYỀN|Màu đen kỳ ảo|Tự nhiên|low",
  "96|玉|王|5|yù|NGỌC|Vương giả, đá quý|Đồ vật & Công cụ|high",
  "97|瓜||5|guā|QUA|Quả dưa|Động vật & Thực vật|medium",
  "98|瓦||5|wǎ|NGÕA|Ngói lợp nhà, đồ nung|Đồ vật & Công cụ|low",
  "99|甘||5|gān|CAM|Ngọt ngào, thơm|Trạng thái & Hành động|medium",
  "100|生||5|shēng|SANH|Sinh đẻ, sống động|Trạng thái & Hành động|high",
  "101|用|甩|5|yòng|DỤNG|Sử dụng, dùng đến|Trạng thái & Hành động|high",
  "102|田||5|tián|ĐIỀN|Ruộng lúa, canh tác|Tự nhiên|high",
  "103|疋|⺪|5|pǐ|SẤT|Thước đo vải, bàn chân|Đồ vật & Công cụ|low",
  "104|疒||5|nè|NẰC|Bệnh tật, ốm đau|Con người & Cơ thể|high",
  "105|癶||5|bō|BÁT|Dấu chân rẽ ra|Trạng thái & Hành động|low",
  "106|白||5|bái|BẠCH|Màu trắng, sáng tỏ|Tự nhiên|high",
  "107|皮||5|pí|BÌ|Da loài thú, vỏ cây|Động vật & Thực vật|medium",
  "108|皿||5|mǐn|MÃNH|Bát dĩa, vật đựng|Đồ vật & Công cụ|medium",
  "109|目|目|5|mù|MỤC|Con mắt, dò xét|Con người & Cơ thể|high",
  "110|矛||5|máo|MÂU|Cái giáo, vũ khí|Đồ vật & Công cụ|low",
  "111|矢||5|shǐ|THỈ|Mũi tên|Đồ vật & Công cụ|medium",
  "112|石||5|shí|THẠCH|Đá, sỏi cát|Tự nhiên|high",
  "113|示|礻|5|shì|THỊ|Chỉ dẫn, thần linh|Trạng thái & Hành động|high",
  "114|禸||5|róu|NHỰU|Vết chân động vật dã|Động vật & Thực vật|low",
  "115|禾||5|hé|HÒA|Lúa mỳ, cây lúa|Động vật & Thực vật|high",
  "116|穴||5|xué|HUYỆT|Hang động, hầm đất|Tự nhiên|high",
  "117|立||5|lì|LẬP|Đứng thẳng, thiết lập|Trạng thái & Hành động|high",
  // 6 nét
  "118|竹|⺮|6|zhú|TRÚC|Cây tre, sáo trúc|Động vật & Thực vật|high",
  "119|米||6|mǐ|MỄ|Gạo trắng, cơm tẻ|Động vật & Thực vật|high",
  "120|糸|纟|6|mì|MỊCH|Tơ lụa, liên kết|Đồ vật & Công cụ|high",
  "121|缶||6|fǒu|PHUN|Đồ sành đất nung|Đồ vật & Công cụ|low",
  "122|网|罒|6|wǎng|VÕNG|Cái lưới đánh cá|Đồ vật & Công cụ|medium",
  "123|羊|⺷|6|yáng|DƯƠNG|Con dê, con cừu|Động vật & Thực vật|high",
  "124|羽||6|yǔ|VŨ|Lông vũ, cánh chim|Động vật & Thực vật|medium",
  "125|老|耂|6|lǎo|LÃO|Người già, kính trọng|Con người & Cơ thể|high",
  "126|而||6|ér|NHI|Mà, lại còn (râu)|Trạng thái & Hành động|medium",
  "127|耒||6|lěi|LỖI|Cái cày lật đất|Đồ vật & Công cụ|low",
  "128|耳||6|ěr|NHĨ|Cái tai, lắng nghe|Con người & Cơ thể|high",
  "129|聿|⺾|6|yù|DUẬT|Cây bút lông viết|Đồ vật & Công cụ|medium",
  "130|肉|⺼|6|ròu|NHỤC|Thịt bắp, cơ thể|Con người & Cơ thể|high",
  "131|臣||6|chén|THẦN|Tôi tớ, quan thần|Con người & Cơ thể|medium",
  "132|自||6|zì|TỰ|Tự mình, cái mũi|Con người & Cơ thể|high",
  "133|至||6|zhì|CHÍ|Đến nơi, cao nhất|Trạng thái & Hành động|medium",
  "134|臼||6|jiù|CỮU|Cái cối giã gạo|Đồ vật & Công cụ|low",
  "135|舌||6|shé|THIỆT|Cái lưỡi|Con người & Cơ thể|medium",
  "136|舛||6|chuǎn|SỄN|Sai lệch, trái ngược|Trạng thái & Hành động|low",
  "137|舟||6|zhōu|CHU|Chiếc thuyền nhỏ|Đồ vật & Công cụ|medium",
  "138|艮||6|gèn|CẤN|Quẻ Cấn, vững vàng|Tự nhiên|medium",
  "139|色||6|sè|SẮC|Màu sắc, thần thái|Tự nhiên|medium",
  "140|艸|艹|6|cǎo|THẢO|Cỏ bờ, thảo mộc|Động vật & Thực vật|high",
  "141|虍||6|hū|HÔ|Vằn da hổ, dũng mãnh|Động vật & Thực vật|medium",
  "142|虫||6|chóng|TRÙNG|Sâu bọ, côn trùng|Động vật & Thực vật|high",
  "143|血||6|xuè|HUYẾT|Máu đỏ, huyết thống|Con người & Cơ thể|medium",
  "144|行||6|xíng|HÀNH|Đường đi, thực hiện|Trạng thái & Hành động|high",
  "145|衣|衤|6|yī|Y|Quần áo, che thân|Đồ vật & Công cụ|high",
  "146|襾|西|6|yà|Á|Che đậy (Hướng Tây)|Đồ vật & Công cụ|low",
  // 7 nét
  "147|見|见|7|jiàn|KIẾN|Nhìn thấy, quan điểm|Con người & Cơ thể|high",
  "148|角||7|jiǎo|GIÁC|Sừng thú, góc vuông|Động vật & Thực vật|medium",
  "149|言|讠|7|yán|NGÔN|Lời nói, ngôn ngữ|Con người & Cơ thể|high",
  "150|谷||7|gǔ|CỐC|Khe núi, thung lũng|Tự nhiên|medium",
  "151|豆||7|dòu|ĐẬU|Cây hạt đậu, bát thờ|Động vật & Thực vật|medium",
  "152|豕||7|shǐ|THỈ|Con heo, con lợn|Động vật & Thực vật|medium",
  "153|豸||7|zhì|TRĨ|Loài sâu không chân|Động vật & Thực vật|low",
  "154|貝|贝|7|bèi|BỐI|Sò biển, bảo bối quý|Đồ vật & Công cụ|high",
  "155|赤||7|chì|SÍ|Màu đỏ thắm|Tự nhiên|medium",
  "156|走||7|zǒu|TẨU|Chạy đi, dời bước|Trạng thái & Hành động|high",
  "157|足|⻊|7|zú|TÚC|Bàn chân, đầy đủ|Con người & Cơ thể|high",
  "158|身||7|shēn|THÂN|Thân thể, tự sự|Con người & Cơ thể|high",
  "159|車|车|7|chē|XA|Chiếc xe đi lại|Đồ vật & Công cụ|high",
  "160|辛||7|xīn|TÂN|Cay đắng, vất vả|Trạng thái & Hành động|medium",
  "161|辰||7|chén|THẦN|Ngôi sao, thiên can|Tự nhiên|low",
  "162|辵|⻍|7|chuò|SƯỚC|Đi chợt dừng, bước|Trạng thái & Hành động|high",
  "163|邑|⻎|7|yì|ẤP|Vùng đất, kinh đô|Tự nhiên|medium",
  "164|酉||7|yǒu|DẬU|Hũ rượu, chi Dậu|Đồ vật & Công cụ|medium",
  "165|采||7|cǎi|THẢI|Hái lượm, thu hoạch|Trạng thái & Hành động|low",
  "166|里||7|lǐ|LÝ|Dặm đo, làng xóm|Tự nhiên|high",
  // 8 nét
  "167|金|钅|8|jīn|KIM|Vàng, kim loại sắc|Tự nhiên|high",
  "168|長|长|8|cháng|TRƯỜNG|Dài dài, trưởng bối|Trạng thái & Hành động|high",
  "169|門|门|8|mén|MÔN|Cửa hai cánh, cổng|Đồ vật & Công cụ|high",
  "170|阜|⻏|8|fù|PHỤ|Đồi đất sa bồi|Tự nhiên|high",
  "171|隶||8|dài|LỆ|Kịp đến, lệ thuộc|Trạng thái & Hành động|low",
  "172|隹||8|zhuī|CHUY|Loài chim đuôi ngắn|Động vật & Thực vật|high",
  "173|雨||8|yǔ|VŨ|Mưa sa, khí tượng|Tự nhiên|high",
  "174|青|靑|8|qīng|THANH|Màu xanh hy vọng|Tự nhiên|high",
  "175|非||8|fēi|PHI|Sai lầm, không phải|Trạng thái & Hành động|medium",
  // 9 nét
  "176|面|靣|9|miàn|DIỆN|Khuôn mặt, bề mặt|Con người & Cơ thể|medium",
  "177|革||9|gé|CÁCH|Da thú đã thuộc|Động vật & Thực vật|medium",
  "178|韋|韦|9|wéi|VI|Da thú mềm dai|Động vật & Thực vật|low",
  "179|韭||9|jiǔ|CỬU|Cây rau hẹ gieo|Động vật & Thực vật|low",
  "180|音||9|yīn|ÂM|Âm thanh, tiếng hát|Trạng thái & Hành động|high",
  "181|頁|页|9|yè|HIỆT|Cái đầu cổ, tờ giấy|Con người & Cơ thể|high",
  "182|風|风|9|fēng|PHONG|Gió bão, phong tục|Tự nhiên|high",
  "183|飛|飞|9|fēi|PHI|Bay lượn trên cao|Trạng thái & Hành động|medium",
  "184|食|饣|9|shí|THỰC|Ăn uống, thức ăn|Đồ vật & Công cụ|high",
  "185|首||9|shǒu|THỦ|Cái đầu hướng đạo|Con người & Cơ thể|high",
  "186|香||9|xiāng|HƯƠNG|Mùi thơm ngọt ngào|Tự nhiên|medium",
  // 10 nét
  "187|馬|马|10|mǎ|MÃ|Con ngựa phi nhanh|Động vật & Thực vật|high",
  "188|骨||10|gǔ|CỐT|Khung xương thân thể|Con người & Cơ thể|medium",
  "189|高||10|gāo|CAO|Chiều cao, thanh cao|Trạng thái & Hành động|high",
  "190|髟||10|biāo|TIÊU|Mái tóc che dài|Con người & Cơ thể|low",
  "191|鬥||10|dòu|ĐẤU|Chiến đấu, cự cãi|Trạng thái & Hành động|low",
  "192|鬯||10|chàng|SƯỚNG|Rượu thơm cúng tế|Đồ vật & Công cụ|low",
  "193|鬲||10|lì|LỊCH|Cái chảo ba chân nấu|Đồ vật & Công cụ|low",
  "194|鬼||10|guǐ|QUỶ|Thần quỷ, ám ảnh|Tự nhiên|medium",
  // 11 nét
  "195|魚|鱼|11|yú|NGƯ|Con cá biển sông|Động vật & Thực vật|high",
  "196|鳥|鸟|11|niǎo|ĐIỂU|Cánh chim, loài chim|Động vật & Thực vật|high",
  "197|鹵||11|lǔ|LỖ|Đất mặn, muối mỏ|Tự nhiên|low",
  "198|鹿||11|lù|LỘC|Con hươu dã hoang|Động vật & Thực vật|medium",
  "199|麥|麦|11|mài|MẠCH|Cành lúa mạch mỳ|Động vật & Thực vật|medium",
  "200|麻||11|má|MA|Cây gai dầu xe tơ|Động vật & Thực vật|medium",
  // 12 nét
  "201|黃|黄|12|huáng|HOÀNG|Màu vàng rơm rực|Tự nhiên|high",
  "202|黍||12|shǔ|THỬ|Lúa nếp ngon hạt|Động vật & Thực vật|low",
  "203|黑||12|hēi|HẮC|Màu đen kịt tối|Tự nhiên|high",
  "204|黹||12|zhǐ|CHỈ|May vá thêu thùa|Đồ vật & Công cụ|low",
  // 13 nét
  "205|黽|黾|13|mǐn|MÃNH|Con ếch, loài lưỡng|Động vật & Thực vật|low",
  "206|鼎||13|dǐng|ĐỈNH|Cái lư đỉnh cúng tế|Đồ vật & Công cụ|medium",
  "207|鼓||13|gǔ|CỔ|Cái trống kèn nhạc|Đồ vật & Công cụ|medium",
  "208|鼠||13|shǔ|THỬ|Con chuột bò nhanh|Động vật & Thực vật|medium",
  // 14 nét
  "209|鼻||14|bí|TỊ|Cái mũi thở thở|Con người & Cơ thể|medium",
  "210|齊|齐|14|qí|TỀ|Đều đặn, chỉnh đốn|Trạng thái & Hành động|low",
  // 15 nét
  "211|齒|齿|15|chǐ|XỈ|Hàm răng nhai nhai|Con người & Cơ thể|medium",
  // 16 nét
  "212|龍|龙|16|lóng|LONG|Con rồng linh thiêng|Động vật & Thực vật|medium",
  "213|龜|龟|16|guī|QUY|Con rùa sống thọ|Động vật & Thực vật|low",
  // 17 nét
  "214|龠||17|yuè|DƯỢC|Ống sáo sáo tre thổi|Đồ vật & Công cụ|low"
];

// Rich mnemonic origin data and commonTraditionalWords for the core/important radicals
const richMnemonicData: Record<number, { desc: string; words: Radical["commonWords"] }> = {
  1: {
    desc: "Biểu thị sự khởi đầu vạn vật, nét gạch ngang tượng trưng cho một đường ranh giới hoặc số một.",
    words: [
      { word: "世", pinyin: "shì", hanViet: "THẾ", meaning: "Thế giới (bao gồm nét Nhất chỉ ranh giới đất đai)" },
      { word: "三", pinyin: "sān", hanViet: "TAM", meaning: "SỐ ba (ba nét ngang cộng lại)" }
    ]
  },
  9: {
    desc: "Hình ảnh một người đang đứng nghiêng, dang tay phục vụ hoặc bước đi. Khi viết bên cạnh chữ khác biến thành bộ Nhân đứng 亻.",
    words: [
      { word: "他", pinyin: "tā", hanViet: "THA", meaning: "Anh ấy (Người khác - có bộ Nhân đứng 亻)" },
      { word: "休", pinyin: "xiū", hanViet: "HƯU", meaning: "Nghỉ ngơi (Người 亻 tựa vào gốc cây 木 để nghỉ)" },
      { word: "信", pinyin: "xìn", hanViet: "TÍN", meaning: "Uy tín, tin tưởng (Lời của con người 亻 nói ra 言 thì phải giữ uy tín)" }
    ]
  },
  15: {
    desc: "Tượng trưng cho hai giọt nước đóng băng bên vách đá. Chữ nào chứa bộ này thường mang nghĩa lạnh lẽo, đông đặc.",
    words: [
      { word: "冬", pinyin: "dōng", hanViet: "ĐÔNG", meaning: "Mùa đông lạnh lẽo (Phía dưới có bộ Băng 冫)" },
      { word: "冰", pinyin: "bīng", hanViet: "BĂNG", meaning: "Nước đá đông lạnh (Băng giá có bộ 冫)" }
    ]
  },
  18: {
    desc: "Hình con dao găm cầm tay. Khi ghép bên phải chữ biến thể thành bộ Đao đứng 刂 chỉ việc chém giết, cắt gọt.",
    words: [
      { word: "分", pinyin: "fēn", hanViet: "PHÂN", meaning: "Phân chia (Dao 刀 cắt đôi vật ở trên 八)" },
      { word: "剪", pinyin: "jiǎn", hanViet: "TIỄN", meaning: "Cái kéo cắt vải (Bên dưới dùng dao 刀 cắt)" },
      { word: "切", pinyin: "qiē", hanViet: "THIẾT", meaning: "Cắt lát, chặt nhỏ (Dùng dao 刀 để băm cắt)" }
    ]
  },
  30: {
    desc: "Vẽ hình cái miệng hé mở để ăn uống, nói năng, phát âm.",
    words: [
      { word: "唱", pinyin: "chàng", hanViet: "XƯỚNG", meaning: "Hát ca (Dùng miệng 口 xướng âm thanh dưới ánh nắng 日)" },
      { word: "問", pinyin: "wèn", hanViet: "VẤN", meaning: "Hỏi han (Ghé miệng 口 vào cửa 門 để hỏi thăm)" },
      { word: "吃", pinyin: "chī", hanViet: "KHẤT", meaning: "Ăn uống (Hành động dùng miệng 口)" }
    ]
  },
  32: {
    desc: "Vẽ hình một đống đất nhô lên trên mặt đất. Chữ chứa bộ thổ liên quan đến bùn, cát, đất đai, xây dựng.",
    words: [
      { word: "地", pinyin: "dì", hanViet: "ĐỊA", meaning: "Đất đai (Gồm bộ Thổ 土 kết hợp bộ Dã 也)" },
      { word: "城", pinyin: "chéng", hanViet: "THÀNH", meaning: "Thành quách (Xây đắp phòng thủ bằng đất 土)" }
    ]
  },
  38: {
    desc: "Hình vẽ một phụ nữ quý tộc thời cổ ngồi cúi mình thục nữ, hai tay đan chéo cung kính.",
    words: [
      { word: "媽", pinyin: "mā", hanViet: "MÃ", meaning: "Mẹ (Người phụ nữ 女 hiền dịu dỗ dành con như ngựa phi 馬)" },
      { word: "好", pinyin: "hǎo", hanViet: "HẢO", meaning: "Tốt đẹp (Hạnh phúc khi phụ nữ 女 sinh được con trai 子)" },
      { word: "妻", pinyin: "qī", hanViet: "THÊ", meaning: "Người vợ (Người phụ nữ 女 bện tóc cài trâm)" }
    ]
  },
  61: {
    desc: "Hình vẽ quả tim xương sườn của con người. Biến thể bên sườn là Tâm đứng 忄. Các chữ chứa bộ Tâm thường chỉ cảm xúc, tinh thần, suy nghĩ.",
    words: [
      { word: "想", pinyin: "xiǎng", hanViet: "TƯỞNG", meaning: "Suy nghĩ (Dùng tâm 心 suy xét hình tướng 相 của sự vật)" },
      { word: "情", pinyin: "qíng", hanViet: "TÌNH", meaning: "Tình cảm (Tâm trạng 忄 trong sáng xanh biếc 青)" },
      { word: "愛", pinyin: "ài", hanViet: "ÁI", meaning: "Yêu thương (Ôm ấp bằng cả con tim 心 ở giữa chữ)" }
    ]
  },
  64: {
    desc: "Hình dáng bàn tay năm ngón xòe ra. Khi viết bên trái biến thành bộ Thủ đứng 扌 chỉ toàn bộ các hành động vật lý bưng, bê, kéo, đẩy.",
    words: [
      { word: "打", pinyin: "dǎ", hanViet: "ĐẢ", meaning: "Đánh đập (Dùng tay 扌 cầm đinh đập)" },
      { word: "推", pinyin: "tuī", hanViet: "THÔI", meaning: "Kéo đẩy (Hành động của bàn tay 扌 tác động vào chim 隹)" },
      { word: "拿", pinyin: "ná", hanViet: "NÃ", meaning: "Cầm lấy, bắt lấy (Hợp tay 合 và tay 手 lại bưng lên)" }
    ]
  },
  72: {
    desc: "Vẽ vầng thái dương tròn có vết đen ở giữa. Liên quan đến mặt mặt trời, thời gian, ngày giờ, ánh sáng chói lọi.",
    words: [
      { word: "明", pinyin: "míng", hanViet: "MINH", meaning: "Sáng sủa (Nhật 日 mặt trời phối hợp với Nguyệt 月 mặt trăng phát sáng)" },
      { word: "時", pinyin: "shí", hanViet: "THỜI", meaning: "Thời gian (Mặt trời 日 chiếu trên bước chân canh tấc Thốn 寸)" },
      { word: "晴", pinyin: "qíng", hanViet: "TÌNH", meaning: "Trời nắng ráo (Mặt trời 日 lên cao chiếu sáng màu xanh lam 青)" }
    ]
  },
  75: {
    desc: "Vẽ một cây thân thẳng đứng, phía trên có cành xòe, phía dưới rễ đâm sâu vào lòng đất.",
    words: [
      { word: "林", pinyin: "lín", hanViet: "LÂM", meaning: "Rừng nhỏ (Hai cây 木 cạnh nhau thành rừng)" },
      { word: "森", pinyin: "sēn", hanViet: "SÂM", meaning: "Rừng rậm rạp hoang vu (Ba cây 木 xếp chồng che bóng mát)" },
      { word: "櫻", pinyin: "yīng", hanViet: "ANH", meaning: "Hoa anh đào (Loài cây gỗ 木 cho hoa đỏ như chuỗi ngọc 嬰)" }
    ]
  },
  85: {
    desc: "Dòng nước uốn lượn chảy xiết giữa hai bờ suối. Thường viết ở bên sườn thành bộ Thủy đứng (hay còn gọi là Ba chấm thủy) 氵.",
    words: [
      { word: "江", pinyin: "jiāng", hanViet: "GIANG", meaning: "Sông lớn (Dòng nước 氵 kết hợp âm Công 工)" },
      { word: "海", pinyin: "hǎi", hanViet: "HẢI", meaning: "Biển cả bao la (Dòng nước 氵 chảy đến mọi vùng đất mỗi người 每)" },
      { word: "流", pinyin: "liú", hanViet: "LƯU", meaning: "Chảy trôi dạt (Nước 氵 chảy dạt luân chuyển)" }
    ]
  },
  86: {
    desc: "Hình vẽ ngọn lửa cháy bốc lên hoặc đống củi hừng hực. Khi viết dưới đáy chữ biến thành bốn chấm hỏa 灬.",
    words: [
      { word: "燒", pinyin: "shāo", hanViet: "THIÊU", meaning: "Đốt cháy, nướng (Châm lửa 火 đốt lò đất nghi ngút)" },
      { word: "熱", pinyin: "rè", hanViet: "NHIỆT", meaning: "Nóng bức, nhiệt lực (Bên dưới có bộ lửa bốn chấm 灬 nóng)" },
      { word: "照", pinyin: "zhào", hanViet: "CHIẾU", meaning: "Chiếu sáng (Ngọn lửa 灬 soi tỏ ánh sáng rực rỡ)" }
    ]
  },
  120: {
    desc: "Các sợi tơ nhỏ xoắn lại với nhau thành bó chỉ nối. Biến thể bên sườn là bộ Mịch đứng 纟. Chỉ sự may vá, sặc sỡ, liên kết, trói buộc.",
    words: [
      { word: "紅", pinyin: "hóng", hanViet: "HỒNG", meaning: "Sợi dây màu đỏ thắm (Vải vóc 糸 nhuộm màu thủ công 工)" },
      { word: "綠", pinyin: "lǜ", hanViet: "LỤC", meaning: "Màu xanh lá cây (Tơ lụa 糸 nhuộm màu hoa cỏ)" },
      { word: "終", pinyin: "zhōng", hanViet: "CHUNG", meaning: "Kết thúc, hoàn thành (Sợi tơ 糸 được buộc nút thắt giữ bền lâu)" }
    ]
  },
  140: {
    desc: "Hình hai cây cỏ nhỏ vươn lá khỏi nền đất. Thường viết ở đỉnh chữ sườn bộ Thảo đầu 艹 chỏ về thảo mộc, thuốc thang, hoa quả.",
    words: [
      { word: "茶", pinyin: "chá", hanViet: "TRÀ", meaning: "Lá trà xanh (Có bộ Thảo đầu 艹 ở trên đỉnh)" },
      { word: "花", pinyin: "huā", hanViet: "HOA", meaning: "Bông hoa tươi (Cỏ cây 艹 biến hóa 化 khoe sắc hương)" },
      { word: "藥", pinyin: "yào", hanViet: "DƯỢC", meaning: "Thuốc chữa bệnh (Làm từ thảo mộc 艹 mang lại niềm vui 樂)" }
    ]
  },
  149: {
    desc: "Hình vẽ lưỡi lè ra ở miệng để thốt thành tiếng nói. Liên quan đến ngôn ngữ, bàn bạc, chửi mắng, khuyên răn.",
    words: [
      { word: "說", pinyin: "shuō", hanViet: "THUYẾT", meaning: "Nói cặn kẽ giải thích (Dùng lời nói 言 để làm vui tai người khác)" },
      { word: "語", pinyin: "yǔ", hanViet: "NGỮ", meaning: "Ngôn ngữ, tiếng nói (Lời nói 言 chia sẻ của năm người 五 miệng 口)" },
      { word: "讀", pinyin: "dú", hanViet: "ĐỘC", meaning: "Đọc sách thành tiếng (Dùng lời nói 言 đọc văn bản buôn bán)" }
    ]
  }
};

// Traditional to Simplified translations dictionary
const radicalSimplifications: Record<number, { character: string; variant?: string; strokes: number }> = {
  63: { character: "户", variant: "户", strokes: 4 }, // 63 is 戶 -> 户
  120: { character: "纟", variant: "纟", strokes: 3 }, // 120 is 糸 -> 纟
  147: { character: "见", strokes: 4 }, // 147 is 見 -> 见
  149: { character: "讠", variant: "讠", strokes: 2 }, // 149 is 言 -> 讠
  154: { character: "贝", strokes: 4 }, // 154 is 貝 -> 贝
  159: { character: "车", strokes: 4 }, // 159 is 車 -> 车
  167: { character: "钅", variant: "钅", strokes: 5 }, // 167 is 金 -> 钅
  169: { character: "门", strokes: 3 }, // 169 is 門 -> 门
  178: { character: "韦", strokes: 4 }, // 178 is 韋 -> 韦
  181: { character: "页", strokes: 6 }, // 181 is 頁 -> 页
  182: { character: "风", strokes: 4 }, // 182 is 風 -> 风
  183: { character: "飞", strokes: 3 }, // 183 is 飛 -> 飞
  184: { character: "饣", variant: "饣", strokes: 3 }, // 184 is 食 -> 饣
  187: { character: "马", strokes: 3 }, // 187 is 馬 -> 马
  195: { character: "鱼", strokes: 8 }, // 195 is 魚 -> 鱼
  196: { character: "鸟", strokes: 5 }, // 196 is 鳥 -> 鸟
  197: { character: "卤", strokes: 7 }, // 197 is 鹵 -> 卤
  199: { character: "麦", strokes: 7 }, // 199 is 麥 ->麦
  201: { character: "黄", strokes: 11 }, // 201 is 黃 -> 黄
  205: { character: "黾", strokes: 8 }, // 205 is 黽 -> 黾
  210: { character: "齐", strokes: 6 }, // 210 is 齊 -> 齐
  211: { character: "齿", strokes: 8 }, // 211 is 齒 -> 齿
  212: { character: "龙", strokes: 5 }, // 212 is 龍 -> 龙
  213: { character: "龟", strokes: 7 }  // 213 is 龜 -> 龟
};

const wordSimplificationMap: Record<string, string> = {
  "紅": "红", "綠": "绿", "終": "终",
  "說": "说", "語": "语", "讀": "读",
  "藥": "药", "媽": "妈", "愛": "爱",
  "問": "问", "聞": "闻", "門": "门",
  "車": "车", "風": "风", "醫": "医",
  "體": "体", "學": "学", "漢": "汉",
  "書": "书", "國": "国", "會": "会",
  "東": "东", "義": "义", "頭": "头",
  "萬": "万", "開": "开", "親": "亲",
  "業": "业", "寫": "写", "畫": "画",
  "聽": "听", "驚": "惊", "難": "难",
  "魚": "鱼", "鳥": "鸟", "馬": "马",
  "貝": "贝", "見": "见", "麥": "麦",
  "齒": "齿", "龍": "龙", "龜": "龟",
  "齊": "齐", "黽": "黾", "韋": "韦",
  "頁": "页", "飛": "飞"
};

// Programmatic compilation of all 214 Chinese Traditional Radicals
export const radicals: Radical[] = rawRadicalsData.map((item) => {
  const parts = item.split("|");
  const id = parseInt(parts[0], 10);
  const character = parts[1];
  const variant = parts[2] || undefined;
  const strokes = parseInt(parts[3], 10);
  const pinyin = parts[4];
  const hanViet = parts[5];
  const meaning = parts[6];
  const category = parts[7];
  const frequency = parts[8] as "high" | "medium" | "low";

  // Check if we have rich mnemonic and common characters data, otherwise fallback
  const richData = richMnemonicData[id];
  const description = richData
    ? richData.desc
    : `Bộ thủ chữ Hán thứ ${id}, nằm trong nhóm nghĩa "${category}" với độ phổ biến "${
        frequency === "high" ? "Cao" : frequency === "medium" ? "Trung bình" : "Thấp"
      }".`;

  // Fallback common characters if not explicitly defined
  const nativeWords = richData && richData.words ? richData.words : [
    {
      word: `${character}字`,
      pinyin: `${pinyin} zì`,
      hanViet: `${hanViet} TỰ`,
      meaning: `Chữ ghép điển hình chứa bộ thủ ${character}`
    }
  ];

  // Map Simplified fields for the radical
  const simRad = radicalSimplifications[id];
  const simplifiedCharacter = simRad ? simRad.character : character;
  const simplifiedVariant = simRad ? simRad.variant : (variant ? (wordSimplificationMap[variant] || variant) : undefined);
  const simplifiedStrokes = simRad ? simRad.strokes : strokes;

  // Map Simplified fields for commonWords
  const commonWords = nativeWords.map((cw) => {
    const simplifiedWord = cw.word.split("").map(char => wordSimplificationMap[char] || char).join("");
    return {
      word: cw.word,
      simplifiedWord,
      pinyin: cw.pinyin,
      hanViet: cw.hanViet,
      meaning: cw.meaning
    };
  });

  return {
    id,
    character,
    simplifiedCharacter,
    variant,
    simplifiedVariant,
    strokes,
    simplifiedStrokes,
    pinyin,
    hanViet,
    meaning,
    category,
    frequency,
    description,
    commonWords
  };
});

// Category list to guide menu rendering
export const categories = [
  "Con người & Cơ thể",
  "Tự nhiên",
  "Động vật & Thực vật",
  "Đồ vật & Công cụ",
  "Trạng thái & Hành động"
];
