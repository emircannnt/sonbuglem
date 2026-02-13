const storiesList = [
    {
        "id": 1,
        "title": "Âdem (a.s.) Kıssası",
        "summary": "Allah, Âdem’i topraktan yarattı ve ona ruhundan üfledi. Meleklere Âdem’e secde etmelerini emretti; hepsi secde etti, ancak İblis kibirlenerek karşı çıktı. Bunun üzerine İblis lanetlendi. Allah, Âdem ile Havva’yı cennete yerleştirdi ve bir ağaca yaklaşmamalarını söyledi. İblis onları aldattı ve yasak ağaca yaklaştılar. Bunun sonucu olarak yeryüzüne indirildiler. Âdem hatasını kabul edip tövbe etti. Allah da tövbesini kabul etti. Böylece insanlık yeryüzündeki hayatına başladı."
    },
    {
        "id": 2,
        "title": "İdris (a.s.) Kıssası",
        "summary": "İdris Peygamber, Kur’an’da çok doğru sözlü ve sabırlı bir peygamber olarak anılır. Kavmine Allah’a kulluğu ve doğru yaşamayı öğretti. İnsanları iyiliğe çağırdı, kötülükten sakındırdı. Allah, İdris’i yüksek bir makama yükseltti. Rivayetlere göre ilimle meşgul olan, yazıyı öğreten ilk kişilerden biri olduğu söylenir. Hayatı boyunca doğruluktan ayrılmadan tebliğini sürdürdü."
    },
    {
        "id": 3,
        "title": "Nuh (a.s.) Kıssası",
        "summary": "Nuh Peygamber, kavmini uzun yıllar Allah’a iman etmeye çağırdı. Ancak çoğu inkâr etti ve alay etti. Allah’ın emriyle büyük bir gemi yaptı. İnananları ve hayvanlardan birer çift gemiye aldı. Sonunda büyük tufan geldi; inkârcılar helak oldu. Nuh’un iman etmeyen oğlu da kurtulamadı. Böylece yalnız iman edenler kurtuldu. Bu kıssa, sabrı ve Allah’a güvenmeyi öğretir."
    },
    {
        "id": 4,
        "title": "Hud (a.s.) – Âd Kavmi",
        "summary": "Hud Peygamber, güçlü ve kibirli Âd kavmine gönderildi. Onları yalnız Allah’a kulluğa çağırdı, zulümden ve putlardan uzak durmalarını istedi. Ancak kavmi onu yalanladı ve tehdit etti. Bunun üzerine Allah, şiddetli ve dondurucu bir rüzgâr gönderdi. Günlerce süren fırtına sonunda Âd kavmi helak edildi. Hud ve ona iman edenler ise kurtarıldı."
    },
    {
        "id": 5,
        "title": "Salih (a.s.) – Semûd Kavmi",
        "summary": "Salih Peygamber, Semûd kavmine gönderildi. Onları Allah’a iman etmeye çağırdı. Allah, mucize olarak kayadan çıkan bir deve verdi ve ona dokunmamalarını emretti. Ancak kavmi isyan etti ve deveyi öldürdü. Bunun üzerine büyük bir gürültü ve sarsıntı geldi; Semûd kavmi helak oldu. Salih ve iman edenler kurtuldu."
    },
    {
        "id": 6,
        "title": "İbrahim (a.s.) Kıssası",
        "summary": "İbrahim Peygamber, putlara tapılan bir toplumda Allah’ın birliğini anlattı. Putları kırdı, bunun üzerine halkı tarafından ateşe atıldı. Allah ateşi serin ve zararsız yaptı, İbrahim kurtuldu. Oğlu İsmail’i Allah yolunda kurban etmeye razı olacak kadar teslimiyet gösterdi. İbrahim, tevhidin simgesi oldu ve insanlara doğru yolu öğretti."
    },
    {
        "id": 7,
        "title": "Lut (a.s.) Kıssası",
        "summary": "Lut Peygamber, ahlâksızlık yapan kavmine gönderildi. Onları uyardı, doğru yola çağırdı; fakat kavmi söz dinlemedi. Allah’ın emriyle Lut ve iman edenler şehirden çıkarıldı. Ardından kavmin üzerine taş yağdırıldı ve şehir altüst edilerek helak edildi."
    },
    {
        "id": 8,
        "title": "İsmail (a.s.) Kıssası",
        "summary": "İsmail Peygamber, babası İbrahim’in Allah’a olan teslimiyetine ortak oldu. Allah’ın emriyle kurban edilmek istendiğinde, sabır ve itaat gösterdi. Bunun üzerine Allah bir koç göndererek onu kurtardı. İsmail, babasıyla birlikte Kâbe’nin temellerini yükseltti. Teslimiyetin ve sadakatin örneği oldu."
    },
    {
        "id": 9,
        "title": "İshak (a.s.) Kıssası",
        "summary": "İshak Peygamber, İbrahim Peygamber’in oğludur. Allah tarafından müjdelenmiş, salih ve hayırlı bir evlat olarak dünyaya gelmiştir. Kur’an’da onun doğru yolda olan bir peygamber olduğu bildirilir. İshak, insanlara Allah’a kulluğu öğreten, sakin ve takvalı bir hayat sürmüştür."
    },
    {
        "id": 10,
        "title": "Yakup (a.s.) Kıssası",
        "summary": "Yakup Peygamber, Yusuf’un babasıdır. Oğlunu kaybettiğinde büyük bir sabır gösterdi ve Allah’a olan güvenini hiç kaybetmedi. Gözleri üzüntüden görmez oldu ama ümidini yitirmedi. Yıllar sonra Yusuf’la yeniden kavuştu. Yakup Peygamber, sabrın ve tevekkülün en güzel örneklerinden biri oldu."
    },
    {
        "id": 11,
        "title": "Yusuf (a.s.) Kıssası",
        "summary": "Yusuf Peygamber, kardeşleri tarafından kıskanıldı ve kuyuya atıldı. Bir kervan tarafından bulunup Mısır’a götürüldü. Zor durumlara düştü, hapse girdi; fakat Allah’a olan bağlılığını hiç kaybetmedi. Rüyaları yorumlama yeteneği sayesinde Mısır’da yüksek bir makama geldi. Yıllar sonra ailesiyle kavuştu ve kardeşlerini affetti."
    },
    {
        "id": 12,
        "title": "Şuayb (a.s.) Kıssası",
        "summary": "Şuayb Peygamber, Medyen halkına gönderildi. Onları Allah’a iman etmeye, ölçü ve tartıda dürüst olmaya çağırdı. Kavmi ise hile yapmayı sürdürdü ve onu yalanladı. Bunun üzerine şiddetli bir sarsıntı ve azap geldi; inkârcılar helak edildi. Şuayb ve iman edenler kurtuldu."
    },
    {
        "id": 13,
        "title": "Eyyub (a.s.) Kıssası",
        "summary": "Eyyub Peygamber, büyük bir mal, sağlık ve aile nimetlerine sahipti. Ancak Allah’ın izniyle ağır bir hastalık ve sıkıntılarla sınandı. Buna rağmen sabır ve tevekkül gösterdi, şikâyet etmedi. Sonunda Allah onu iyileştirdi ve nimetlerini geri verdi. Eyyub, sabrın ve şükürle dayanmanın örneği oldu."
    },
    {
        "id": 14,
        "title": "Zülkifl (a.s.) Kıssası",
        "summary": "Zülkifl Peygamber, sabırlı ve adaletli bir kul olarak bilinir. Kavmini doğruya çağırdı ve insanlara hakkı öğretti. Kur’an’da onun Allah’a bağlılığı ve görevini yerine getirmedeki kararlılığı övülür. Zülkifl, sabır ve doğrulukla hareket eden bir örnek olarak gösterilir."
    },
    {
        "id": 15,
        "title": "Musa (a.s.) Kıssası",
        "summary": "Musa Peygamber, Firavun’un zulmü altındaki Mısır halkını kurtarmak için gönderildi. Allah’ın mucizeleriyle Firavun’u ve ordusunu yola getirmeye çalıştı. Kızıldeniz’in yarılması gibi mucizelerle İsrailoğullarını Mısır’dan çıkardı ve onlara Allah’ın buyruklarını iletti. Musa, sabır ve liderlik örneği oldu."
    },
    {
        "id": 16,
        "title": "Harun (a.s.) Kıssası",
        "summary": "Harun Peygamber, Musa’nın kardeşi ve yardımcısı olarak gönderildi. Kavmiyle iletişimde Musa’ya destek oldu ve onları Allah’a davet etti. Harun, Musa’nın yokluğunda bile halkı doğruya yönlendirmeye çalıştı ve peygamberlik görevini sadakatle sürdürdü."
    },
    {
        "id": 17,
        "title": "Firavun Kıssası",
        "summary": "Firavun, Allah’a isyan eden ve zulmeden Mısır kralıdır. Musa’ya karşı kibirle durdu ve İsrailoğullarına zulmetti. Sonunda Allah’ın azabıyla Kızıldeniz’de boğuldu. Bu kıssa, kibir ve zulmün cezasını gösterir."
    },
    {
        "id": 18,
        "title": "Hızır Kıssası",
        "summary": "Hızır, Allah’ın özel bir kulu olarak Musa’ya ilahi hikmetleri öğretti. Bazı olayları anlaması zor olan Musa’ya sabrı ve hikmeti anlattı. Kıssa, insanın her şeyi bilemeyeceğini ve Allah’ın hikmetine güvenmeyi öğretir."
    },
    {
        "id": 19,
        "title": "Talut ve Calut Kıssası",
        "summary": "Talut, İsrailoğullarının kralı olarak seçildi. Calut ve ordusuna karşı az bir orduyla savaştılar. İman ve Allah’a güven sayesinde az sayıdaki asker, büyük düşmanı yendi. Kıssa, iman ve sabrın zafer getirdiğini gösterir."
    },
    {
        "id": 20,
        "title": "Davud (a.s.) Kıssası",
        "summary": "Davud Peygamber, İsrailoğullarına gönderilmiş peygamberlerden biridir. Allah ona hüküm ve hikmet verdi; insanlar arasında adaleti sağlamakla görevlendirildi. Davud, genç yaşta Calut adlı dev düşmanı yendi. Allah ona zikir ve ilim, güzel bir kalp, sabır ve şükür verdi. İnsanlar arasında adil bir yönetici olarak tanındı.",
        "reference": "En’am 6:84, Sad 38:20"
    },
    {
        "id": 21,
        "title": "Süleyman (a.s.) Kıssası",
        "summary": "Süleyman Peygamber, Davud’un oğlu ve peygamberidir. Allah ona cinleri, kuşları ve hayvanları kontrol etme yetkisi verdi. Büyük bir hükümdar olarak kavmini adaletle yönetti. Allah ona bilgelik, hükmetme yeteneği ve geniş mülk verdi. Kavmi arasında adaletli davranarak, herkese hakkını verdi.",
        "reference": "Sebe 34:12"
    },
    {
        "id": 22,
        "title": "Sebe Melikesi (Belkıs) Kıssası",
        "summary": "Belkıs, Sebe Kraliçesi’dir. Süleyman Peygamber, Allah’ın izniyle kendisini iman etmeye davet etti. Süleyman’ın mektubu ve mucizeleriyle karşılaşınca gerçeği fark etti. Tahtının Allah tarafından gösterilen mucizevi şekilde getirilmesi, onun iman etmesine vesile oldu. Sonunda Belkıs, doğru yola yöneldi ve iman etti."
    },
    {
        "id": 23,
        "title": "İlyas (a.s.) Kıssası",
        "summary": "İlyas Peygamber, kavmini Allah’a kulluğa çağırmak için gönderildi. İnsanları putperestlikten uzak durmaya ve yalnızca Allah’a tapmaya davet etti. Kavmi çoğunlukla onu yalanladı. Kur’an’da İlyas’a gönderilen mesaj sabır ve tebliğ üzerine odaklanmıştır.",
        "reference": "Sad 38:48"
    },
    {
        "id": 24,
        "title": "Elyesa (a.s.) Kıssası",
        "summary": "Elyesa Peygamber, İlyas’ın ardından kavmine gönderildi. Görevi, insanları Allah’a iman etmeye çağırmak ve doğru yolu göstermekti. İnsanları Allah’a ibadete, iyiliğe ve doğruluğa davet etti. Kavminin çoğu inkâr etti; Elyesa sabır ve tebliğ örneği oldu.",
        "reference": "Sad 38:48"
    },
    {
        "id": 25,
        "title": "Yunus (a.s.) Kıssası",
        "summary": "Yunus Peygamber, kavmini Allah’a çağırdı, ancak çoğu onu dinlemedi. Bunun üzerine kavminden ayrıldı ve denize açıldı. Büyük bir balığın karnına düştü ve burada Allah’a dua etti. Allah, Yunus’u balığın karnından kurtardı. Sonunda kavmi tövbe etti ve kurtuluş buldu.",
        "reference": "Saffat 37:143-144"
    },
    {
        "id": 26,
        "title": "Zekeriyya (a.s.) Kıssası",
        "summary": "Zekeriyya Peygamber, Allah’a ibadet eden bir peygamberdi. Yaşlı olmasına rağmen Allah’tan bir evlat diledi. Allah, ona Yahya’yı verdi. Oğlu Yahya da peygamber oldu ve doğru yolda yetiştirildi.",
        "reference": "Meryem 19:2-7"
    },
    {
        "id": 27,
        "title": "Yahya (a.s.) Kıssası",
        "summary": "Yahya Peygamber, Zekeriyya (a.s.)’ın duası ile dünyaya geldi. Allah’a bağlı, temiz ve salih bir hayat sürdü. İnsanlara Allah’a kulluğu ve doğru yolu öğretti. Peygamberliği, babası Zekeriyya’dan aldığı öğütler ve ilimle pekişti.",
        "reference": "Âl-i İmrân 3:39"
    },
    {
        "id": 28,
        "title": "Meryem Kıssası",
        "summary": "Meryem, Allah tarafından seçilmiş ve korunmuş bir kadındır. Allah ona mucize olarak İsa’yı doğurdu. Allah’ın emriyle İsa’nın doğumu, babasız gerçekleşti. Meryem, Allah’a teslimiyet ve temiz yaşamın örneğidir.",
        "reference": "Âl-i İmrân 3:42"
    },
    {
        "id": 29,
        "title": "İsa (a.s.) Kıssası",
        "summary": "İsa Peygamber, Allah tarafından mucizevi şekilde Meryem’den doğdu. İnsanlara Allah’a kulluğu ve doğru yolu öğretmek için gönderildi. Ölüleri diriltme ve hastaları iyileştirme gibi mucizeler verdi. İnsanları tevhide çağırdı ve peygamberlik görevini yerine getirdi.",
        "reference": "Mâide 5:110"
    },
    {
        "id": 30,
        "title": "Ashab-ı Kehf Kıssası",
        "summary": "Bir grup genç, zulümden ve putperestlikten kaçarak bir mağaraya sığındı. Allah onları uyuttu ve yıllarca uyumalarını sağladı. Uyanınca dünyadaki değişimi fark ettiler. Allah’ın kudreti ve koruması sayesinde imanları korunmuş oldu.",
        "reference": "Kehf 18:25"
    },
    {
        "id": 31,
        "title": "Zülkarneyn Kıssası",
        "summary": "Zülkarneyn, Allah’ın izniyle yeryüzünde adaleti sağlayan bir hükümdardır. Batıdan Doğuya ve doğudan batıya seyahat ederek halkları yönlendirdi. Ye’cüc ve Me’cüc adlı toplulukların insanlara zarar vermesini önlemek için bir set yaptı. Allah’ın yardımıyla halkları korudu ve doğru yola yönlendirdi.",
        "reference": "Kehf 18:84-98"
    },
    {
        "id": 32,
        "title": "Ashab-ı Uhdud Kıssası",
        "summary": "Ashab-ı Uhdud, iman eden bir topluluktu. Zalim bir kral, onları ateşe atmakla tehdit etti. İnananlar imanlarından vazgeçmedi ve Allah’a teslim oldular. Kur’an, onların sabrını ve imanlarını örnek gösterir.",
        "reference": "Bakara 2:71"
    },
    {
        "id": 33,
        "title": "Fil Ashabı Kıssası",
        "summary": "Fil Ashabı, Kâbe’ye saldırmak isteyen ordudur. Allah, onların üzerine ebabil kuşları gönderdi. Kuşlar taş atarak orduyu yok etti. Bu olay, Allah’ın kudretini ve Kâbe’yi korumasını gösterir.",
        "reference": "Fil 105:1-5"
    },
    {
        "id": 34,
        "title": "Karun Kıssası",
        "summary": "Karun, Allah’ın nimetlerine sahip bir adamdı fakat kibirli ve bencildi. Servetini gösteriş için kullandı ve insanlara zulmetti. Sonunda Allah, onu ve servetini yeryüzüne gömdü.",
        "reference": "Kasas 28:76-82"
    },
    {
        "id": 35,
        "title": "Cumartesi Yasağı Kıssası",
        "summary": "Allah, Beni İsrail’e cumartesi günü yasağı koymuştu. Onlar bu yasakları çiğnediler ve balık tutmaya devam ettiler. Sonuç olarak, Allah’ın azabı geldi ve isyan edenler cezalandırıldı.",
        "reference": "A’raf 7:163-166"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = storiesList;
} else {
    window.storiesList = storiesList;
}
