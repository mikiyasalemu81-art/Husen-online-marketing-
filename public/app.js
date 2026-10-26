/**
 * HUSEN ONLINE MARKETING — Main Application Logic
 * Telegram Mini App Native Styling, 2-Column Mobile Grid, Pinned Real-time Search,
 * 3-Payment Checkout (COD, Chapa, Manual Direct Transfer), Phone Validation,
 * Admin Multi-Photo Device Uploader & Cloud State Syncing
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. TELEGRAM WEBAPP SDK INITIALIZATION
  // ==========================================================================
  if (window.Telegram && window.Telegram.WebApp) {
    try {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log('[Telegram WebApp] Ready & Expanded');
    } catch (e) {
      console.warn('[Telegram WebApp] Init notice:', e);
    }
  }

  // ==========================================================================
  // 2. LOCALIZATION DICTIONARY (Amharic, Afaan Oromoo, English)
  // ==========================================================================
  const I18N = {
    am: {
      categories: {
        all: "ሁሉንም",
        kitchen: "ማብሰያ & ኩሽና",
        home: "የቤት ዕቃዎች",
        beauty: "ውበት",
        health: "ጤና"
      },
      heroBadge: "አዳማ ፈጣን የቤት ማድረስ",
      heroHeadline: "ጥራት ያላቸው የቤት እና የውበት ዕቃዎች",
      heroSubtext: "ለአዳማ ከተማ ፈጣን ማድረስ በቴሌብር፣ በኢትዮጵያ ንግድ ባንክ (Chapa)፣ ቀጥታ ባንክ ማስተላለፍ እና በእጅ ሲደርስ ክፍያ።",
      statDelivery: "በአዳማ በዕለቱ ማድረስ",
      statQuality: "100% አስተማማኝ ጥራት",
      statTelebirr: "Chapa (ቴሌብር እና ንግድ ባንክ)",
      catalogTitle: "ተወዳጅ ምርቶች",
      catalogSubtitle: "ዝርዝር ለማየት ወይም ወዲያውኑ ለማዘዝ ይጫኑ",
      itemsCount: "ዕቃዎች",
      inStock: "ክምችት ላይ አለ",
      outOfStock: "አልቋል",
      buyNow: "አሁኑኑ ይግዙ",
      addToCart: "ወደ ጋሪ ጨምር",
      addedToCartToast: "ወደ ጋሪ ተጨምሯል!",
      cartTitle: "የእርስዎ የገበያ ጋሪ",
      cartEmpty: "የእርስዎ ጋሪ ባዶ ነው",
      cartEmptySub: "ዕቃዎችን ይምረጡና እዚህ ያክሉ",
      cartAdamaBanner: "በአዳማ ከተማ ውስጥ ነፃ እና ፈጣን ማድረስ",
      subtotal: "የዕቃዎች ድምር",
      adamaDelivery: "የአዳማ ከተማ ማድረሻ",
      freeDelivery: "ነፃ",
      grandTotal: "ጠቅላላ ድምር",
      proceedCheckout: "ትዕዛዝ ማጠናቀቂያ",
      step1Pill: "1. የደንበኛ መረጃ",
      step2Pill: "2. የክፍያ ዘዴ",
      checkoutTitle: "የትዕዛዝ መረጃ",
      checkoutSubtitle: "ፈጣን ማድረሻ በአዳማ ከተማ",
      orderItems: "የታዘዙ ዕቃዎች",
      fullName: "ሙሉ ስም *",
      phone: "ስልክ ቁጥር *",
      phoneHelper: "9 አሃዝ ብቻ ያስገቡ (በ 9 ወይም 7 የሚጀምር)። ቅጥያ፡ +251",
      landmarkLabel: "የማድረሻ ቦታ / መለያ ቦታ በአዳማ *",
      landmarkPlaceholder: "ምሳሌ፡ ፖስታ ቤት፣ አዳማ",
      addressLabel: "ዝርዝር አድራሻ ወይም የቤት/ፎቅ ቁጥር",
      addressPlaceholder: "ምሳሌ፡ የቤት ቁጥር 204፣ 2ኛ ፎቅ",
      continueToPayment: "ወደ ክፍያ ይቀጥሉ",
      choosePaymentLabel: "የክፍያ ዘዴ ይምረጡ፡",
      chapaName: "ዲጂታል ክፍያ (ቴሌብር / ንግድ ባንክ በ Chapa)",
      chapaDesc: "በቴሌብር (Telebirr) ወይም በኢትዮጵያ ንግድ ባንክ (CBE) በ Chapa በኩል በቀጥታ ይክፈሉ።",
      codName: "በእጅ ሲደርስ (Cash on Delivery)",
      codDesc: "ዕቃው በአዳማ አድራሻዎ ሲደርስ ለአድራሹ ጥሬ ገንዘብ መክፈል",
      manualName: "ቀጥታ የባንክ ማስተላለፍ (CBE / ቴሌብር)",
      manualDesc: "በራስዎ የባንክ መተግበሪያ ወይም በቴሌብር ወደተጠቀሰው ሂሳብ ያስተላልፉ።",
      btnFinalizeChapa: "በ Chapa ይክፈሉ",
      btnFinalizeCod: "ትዕዛዙን አረጋግጥ (በእጅ ሲደርስ)",
      btnFinalizeManual: "ትዕዛዙን አረጋግጥ (ባንክ አስተላልፌያለሁ)",
      orderSuccessTitle: "ትዕዛዝዎ ተረጋግጧል!",
      orderSuccessSub: "ከሁሴን ኦንላይን ማርኬቲንግ ስለሸመቱ እናመሰግናለን",
      orderRef: "የትዕዛዝ መለያ ቁጥር:",
      smsNoticeTitle: "የኤስኤምኤስ (SMS) ማሳወቂያ ተልኳል",
      smsNoticeBody: "የትዕዛዝዎ ዝርዝር ለሱቁ (0907173634) በኤስኤምኤስ ተልኳል።",
      customer: "ደንበኛ:",
      phoneLabel: "ስልክ:",
      locationLabel: "የማድረሻ ቦታ:",
      paymentLabel: "የክፍያ ሁኔታ:",
      amountLabel: "ጠቅላላ ክፍያ:",
      callShopBtn: "ለሱቁ ይደውሉ (0923245529)",
      continueShoppingBtn: "ወደ ሱቅ ተመለስ",
      trustDeliveryTitle: "ፈጣን የሰፈር ማድረስ",
      trustDeliveryDesc: "ገንዳ ሃራ፣ ሥላሴ፣ አጣናተራ፣ ፒኮክ፣ ቦሌ፣ ማትዋሚስፕ እና ሌሎች የአዳማ አካባቢዎች።",
      trustSecureTitle: "አስተማማኝ የክፍያ አማራጮች",
      trustSecureDesc: "በ Chapa (ቴሌብር፣ ንግድ ባንክ)፣ ቀጥታ ማስተላለፍ ወይም በእጅ ሲደርስ ይክፈሉ።",
      trustContactTitle: "ጥያቄ ወይም እገዛ ይፈልጋሉ?",
      selectQty: "ብዛት ይምረጡ",
      totalAmountLabel: "ጠቅላላ ክፍያ:",

      // PWA Install Prompt Strings
      installBtn: "መተግበሪያውን ጫን",
      installBannerTitle: "የሁሴን መተግበሪያን ይጫኑ",
      installBannerSub: "ለፈጣን ግብይት ሁሴንን ወደ ስልክዎ መነሻ ገጽ ያክሉ",
      installBannerBtn: "መተግበሪያውን ጫን",
      iosInstallTitle: "በ iPhone ላይ ለመጫን",
      iosInstallStep1: "በ Safari ታችኛው ክፍል ላይ ያለውን የማጋሪያ (Share) ምልክት ይጫኑ",
      iosInstallStep2: "ወደ ታች ዝቅ ብለው 'Add to Home Screen' የሚለውን ይምረጡ",
      iosInstallStep3: "ከላይ በቀኝ በኩል 'Add' የሚለውን ተጭነው ያጠናቁ",
      iosToolbarHint: "ከታች ያለውን የ Safari ሜኑ ይመልከቱ",
      inAppTitle: "የሁሴን መተግበሪያን ይጫኑ",
      inAppMsg: "መተግበሪያውን ወደ ስልክዎ ለመጫን ይህንን ገጽ በ Chrome ወይም በ Safari ይክፈቱት።",
      inAppStepTip: "ከላይ በስተቀኝ ያሉትን ሶስት ነጥቦች (•••) ነክተው 'Open in browser' ይምረጡ",
      copyLinkBtn: "ሊንኩን ቅዳ",
      copiedLinkToast: "ሊንኩ ተቀድቷል!",
      openInBrowserBtn: "በብሮውዘር ክፈት",
      gotItBtn: "ገባኝ"
    },

    om: {
      categories: {
        all: "Hunda",
        kitchen: "Kushiinaa",
        home: "Meeshaa Manaa",
        beauty: "Bareedina",
        health: "Fayyaa"
      },
      heroBadge: "Adaamaa Dhaqqabsiisa Saffisaa",
      heroHeadline: "Meeshaalee Manaa fi Bareedina Qulqullina Qaban",
      heroSubtext: "Kutaalee Adaamaa hundaaf dhiyeessii saffisaa Telebirr, CBE (Chapa), Dabarsa Baankii fi kaffaltii harkaan.",
      statDelivery: "Guyyuma Sana Adaamaatti",
      statQuality: "100% Mirkanaa'aa",
      statTelebirr: "Chapa (Telebirr & CBE)",
      catalogTitle: "Meeshaalee Filataman",
      catalogSubtitle: "Bal'ina ilaaluuf yookiin hatattamaan ajajuuf tuqaa",
      itemsCount: "Meeshaalee",
      inStock: "Gurgurtaaf Jira",
      outOfStock: "Dhumateera",
      buyNow: "Amma Biti",
      addToCart: "Gaaritti Dabali",
      addedToCartToast: "Gaaritti dabalameera!",
      cartTitle: "Gaarii Bittaa Keessan",
      cartEmpty: "Gaariin keessan duwwaadha",
      cartEmptySub: "Meeshaalee filadhaatii asitti dabalaa",
      cartAdamaBanner: "Magaalaa Adaamaa keessatti bilisaan qe'eetti dhaqqaba",
      subtotal: "Dimshaasha Meeshaalee",
      adamaDelivery: "Geessituu Adaamaa",
      freeDelivery: "BILISA",
      grandTotal: "Ida'ama Waliigalaa",
      proceedCheckout: "Ajaja Xumuri",
      step1Pill: "1. Odeeffannoo Maamilaa",
      step2Pill: "2. Mala Kaffaltii",
      checkoutTitle: "Odeeffannoo Bittaa",
      checkoutSubtitle: "Magaalaa Adaamaa keessatti saffisaan dhiyaata",
      orderItems: "Meeshaalee Ajajaman",
      fullName: "Maqaa Guutuu *",
      phone: "Lakkoofsa Bilbilaa *",
      phoneHelper: "Dijitii 9 qofa galchaa (9 ykn 7 kan eegalu). Koodii: +251",
      landmarkLabel: "Iddoo Geessituu / Mallattoo Adaamaatti *",
      landmarkPlaceholder: "fk., Posta Bet, Adaamaa",
      addressLabel: "Teessoo Dabalataa ykn Lakkoofsa Manaa",
      addressPlaceholder: "fk., Mana Lakk. 204, Fooqii 2ffaa",
      continueToPayment: "Gara Kaffaltiitti Itti Fufi",
      choosePaymentLabel: "Mala Kaffaltii Filadhaa:",
      chapaName: "Kaffaltii Dijitaalaa (Telebirr / CBE karaa Chapa)",
      chapaDesc: "Karaa Chapa Telebirr ykn Baankii Daldala Itoophiyaan battalatti kaffalaa.",
      codName: "Yeroo Si Dhaqqabu (Cash on Delivery)",
      codDesc: "Yeroo meeshaan Adaamaatti qe'ee keessan ga'u qarshii harkatti kaffalaa",
      manualName: "Dabarsa Baankii Kallattii (CBE / Telebirr)",
      manualDesc: "Applikeeshinii baankii keessaniin kallattiin herrega armaan gadiitti ergaa.",
      btnFinalizeChapa: "Karaa Chapa Kaffali",
      btnFinalizeCod: "Ajaja Mirkaneessi (Harkatti)",
      btnFinalizeManual: "Ajaja Mirkaneessi (Baankiin Ergeera)",
      orderSuccessTitle: "Ajajni Keessan Mirkanaa'eera!",
      orderSuccessSub: "Husen Online Marketing wajjin waan bittaniif galatoomaa",
      orderRef: "Koodii Ajajaa:",
      smsNoticeTitle: "Ergaan Gabaabaan (SMS) Ergameera",
      smsNoticeBody: "Odeeffannoon ajaja keessanii lakkoofsa (0907173634) tiif karaa SMS ergameera.",
      customer: "Maamila:",
      phoneLabel: "Bilbila:",
      locationLabel: "Iddoo Geessituu:",
      paymentLabel: "Haala Kaffaltii:",
      amountLabel: "Kaffaltii Waliigalaa:",
      callShopBtn: "Dukaanaaf Bilbilaa (0923245529)",
      continueShoppingBtn: "Gara Dukaanaatti Deebi'i",
      trustDeliveryTitle: "Dhaqqabsiisa Naannoo Saffisaa",
      trustDeliveryDesc: "Ganda Haaraa, Sillaasee, Xannaatara, Piikook, Boolee, Matwaamispii fi Adaamaa.",
      trustSecureTitle: "Filannoowwan Kaffaltii Nageenya Qaban",
      trustSecureDesc: "Chapa (Telebirr, CBE), Dabarsa Kallattii ykn yeroo si dhaqqabu harkatti kaffalaa.",
      trustContactTitle: "Gargaarsa Barbaadduu?",
      selectQty: "Baay'ina Filadhaa",
      totalAmountLabel: "Kaffaltii Waliigalaa:",

      // PWA Install Prompt Strings
      installBtn: "Appii Fe'adhaa",
      installBannerTitle: "Appii Husen Fe'adhaa",
      installBannerSub: "Bittaa saffisaaf Husen gara iskiriinii jalqabaatti dabalaa",
      installBannerBtn: "Appii Fe'adhaa",
      iosInstallTitle: "iPhone irratti fe'achuuf",
      iosInstallStep1: "Safari keessatti mallattoo Qoodaa (Share) sarara gadii irraa tuqaa",
      iosInstallStep2: "Gadi siqaatii 'Add to Home Screen' kan jedhu filadhaa",
      iosInstallStep3: "Xumuruuf gubbaa mirgaatti 'Add' kan jedhu tuqaa",
      iosToolbarHint: "Gara gadii sarara Safari ilaalaa",
      inAppTitle: "Appii Husen Fe'adhaa",
      inAppMsg: "Appii kana fe'achuuf fuula kana Chrome ykn Safari keessatti banaa.",
      inAppStepTip: "Gubbaa mirgaatti tuqaalee sadii (•••) tuquun 'Open in browser' filadhaa",
      copyLinkBtn: "Liinkii Waraabi",
      copiedLinkToast: "Liinkiin waraabameera!",
      openInBrowserBtn: "Biroowzariin Bani",
      gotItBtn: "Hubadheera"
    },

    en: {
      categories: {
        all: "All",
        kitchen: "Kitchen",
        home: "Home",
        beauty: "Beauty",
        health: "Health"
      },
      heroBadge: "Adama Fast Local Delivery",
      heroHeadline: "Household & Lifestyle Essentials",
      heroSubtext: "Doorstep delivery across all neighborhoods in Adama with Telebirr / CBE via Chapa, Manual Direct Transfer, and Cash on Delivery.",
      statDelivery: "Same Day in Adama",
      statQuality: "100% Guaranteed",
      statTelebirr: "Chapa (Telebirr & CBE)",
      catalogTitle: "Featured Products",
      catalogSubtitle: "Tap any item to open Telegram Mini App view or order instantly",
      itemsCount: "Items",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      buyNow: "Buy Now",
      addToCart: "Add to Cart",
      addedToCartToast: "Added to your cart!",
      cartTitle: "Your Shopping Cart",
      cartEmpty: "Your cart is empty",
      cartEmptySub: "Browse products and add them here",
      cartAdamaBanner: "Free & fast doorstep delivery within Adama City",
      subtotal: "Subtotal",
      adamaDelivery: "Adama Local Delivery",
      freeDelivery: "FREE",
      grandTotal: "Grand Total",
      proceedCheckout: "Proceed to Checkout",
      step1Pill: "1. Customer Info",
      step2Pill: "2. Payment Method",
      checkoutTitle: "Customer Details",
      checkoutSubtitle: "Fast local delivery in Adama",
      orderItems: "Order Items",
      fullName: "Full Name *",
      phone: "Phone Number *",
      phoneHelper: "Enter 9 digits starting with 9 or 7 (e.g. 912345678). Static prefix +251.",
      landmarkLabel: "Delivery Landmark in Adama *",
      landmarkPlaceholder: "e.g., Posta Bet, Adama",
      addressLabel: "Specific Address or House / Floor No.",
      addressPlaceholder: "e.g., House No. 204, 2nd Floor, next to Bank",
      continueToPayment: "Continue to Payment",
      choosePaymentLabel: "Select Payment Option:",
      chapaName: "Automated Chapa (Telebirr & CBE)",
      chapaDesc: "Instant online checkout using your Telebirr account or Commercial Bank of Ethiopia (CBE) powered by Chapa.",
      codName: "Cash on Delivery",
      codDesc: "Pay cash directly to our delivery rider when your package arrives at your doorstep in Adama.",
      manualName: "Manual Direct Transfer (CBE / Telebirr)",
      manualDesc: "Transfer directly to Husen's CBE or Telebirr account with quick copy buttons.",
      btnFinalizeChapa: "Proceed with Chapa",
      btnFinalizeCod: "Confirm Cash on Delivery",
      btnFinalizeManual: "Confirm Direct Transfer",
      orderSuccessTitle: "Order Confirmed!",
      orderSuccessSub: "Thank you for shopping with Husen Online Marketing",
      orderRef: "Order Reference:",
      smsNoticeTitle: "Automated SMS Dispatched to Test Recipient",
      smsNoticeBody: "Order alert automatically dispatched to <strong>0907173634</strong> (+251907173634) via SMS Gateway for immediate courier coordination.",
      customer: "Customer:",
      phoneLabel: "Phone:",
      locationLabel: "Delivery Location:",
      paymentLabel: "Payment Method:",
      amountLabel: "Total Amount:",
      callShopBtn: "Call Husen (0923245529)",
      continueShoppingBtn: "Continue Shopping",
      trustDeliveryTitle: "Direct Neighborhood Delivery",
      trustDeliveryDesc: "Gendahara, Silasi, Atanatara, Peacock, Boli, Matwamisp & beyond in Adama.",
      trustSecureTitle: "Safe Payment Options",
      trustSecureDesc: "Chapa Gateway (Telebirr & CBE), Direct Transfer, or Cash on Delivery.",
      trustContactTitle: "Need Help? Contact Husen",
      selectQty: "Select Quantity",
      totalAmountLabel: "Total Amount:",

      // PWA Install Prompt Strings
      installBtn: "Install app",
      installBannerTitle: "Install Husen App",
      installBannerSub: "Add Husen to your home screen for faster shopping",
      installBannerBtn: "Install app",
      iosInstallTitle: "Install on iPhone",
      iosInstallStep1: "Tap the Share button in Safari toolbar below",
      iosInstallStep2: "Scroll down and select 'Add to Home Screen'",
      iosInstallStep3: "Tap 'Add' in the top right corner to finish",
      iosToolbarHint: "Look at the Safari toolbar below",
      inAppTitle: "Install Husen App",
      inAppMsg: "Open this page in Chrome or Safari to install the app.",
      inAppStepTip: "Tap the menu button (•••) at top right, then select 'Open in browser'",
      copyLinkBtn: "Copy link",
      copiedLinkToast: "Link copied to clipboard!",
      openInBrowserBtn: "Open in browser",
      gotItBtn: "Got it"
    }
  };

  // Initial Fallback Products
  const INITIAL_PRODUCTS = [
    {
      id: "prod-1",
      category: "kitchen",
      price: 1450,
      inStock: true,
      images: ["public/images/storage1.jpg"],
      name: {
        am: "የብርጭቆ ዕቃ መያዣ (4 ፍሬ)",
        om: "Qodaa Fuullee Nyaataa (Cimdi 4)",
        en: "Glass Storage Container Set (4-piece)"
      },
      spec: {
        am: "እርስ በርስ የሚገጣጠሙ፣ አየር የማያስገቡ ክሊፕ-መቆለፊያ ክዳን ያላቸው ጥራት ያላቸው የብርጭቆ ዕቃዎች።",
        om: "Qulqullina olaanaa, qilleensa kan hin galchine, cufaa jabaa kan qabu.",
        en: "Nesting, clip-lock lids, airtight premium glass containers."
      },
      fullDesc: {
        am: "4 የተለያየ መጠን ያላቸው የብርጭቆ ዕቃዎች። አየር የማያስገባ ክሊፕ ክዳን ያላቸው ሲሆን በማቀዝቀዣ፣ ማይክሮዌቭ እና በእቃ ማጠቢያ ውስጥ በደህና መጠቀም ይቻላል።",
        om: "Qodaa fuullee gosa 4 kan wal keessa galuu danda'an. Cufaa jabaa qilleensa ittisu kan qaban, firiijii fi maaykirooweevii keessatti fayyadamuuf kan ta'an.",
        en: "Set of 4 heavy-duty glass containers with snap-tight clip lids. Airtight silicone seal preserves freshness. Oven, microwave, freezer and dishwasher safe."
      },
      badge: { am: "ኦሪጅናል", om: "Qulqullina", en: "Original" }
    },
    {
      id: "prod-2",
      category: "health",
      price: 1200,
      inStock: true,
      images: ["public/images/vest1.jpg", "public/images/vest2.jpg"],
      name: {
        am: "የጀርባ አቋም ማስተካከያ ቬስት",
        om: "Vestii Dugdaa Sirreessu",
        en: "Posture Corrector Compression Vest"
      },
      spec: {
        am: "የጀርባ አጥንትን እና ትከሻን የሚያስተካክል፣ የሚለጠጥና ምቹ የድጋፍ ቬስት።",
        om: "Dugda fi ceekuuf deeggarsa kan kennu, mijataa fi sirreeffamuu kan danda'u.",
        en: "Adjustable back support, breathable compression vest."
      },
      fullDesc: {
        am: "ለትከሻና ለጀርባ ህመም ፈጣን እፎይታ የሚሰጥ። በልብስ ስር የማይታወቅ፣ የሚለጠጥና እንደ ሰውነት መጠን የሚስተካከል የጀርባ አቋም ማስተካከያ።",
        om: "Dhukkubbi dugdaa fi ceekuu salphisuuf kan gargaaru. Uffata jalatti kan hin mul'anne, salphaatti kan sirreeffamu fi hargansuuf mijataa ta'e.",
        en: "Ergonomic compression vest designed to pull shoulders back and align the spine. Breathable, discreet under clothing, and fully adjustable for all-day posture relief."
      },
      badge: { am: "ተወዳጅ", om: "Filatamaa", en: "Best Seller" }
    },
    {
      id: "prod-3",
      category: "kitchen",
      secondaryCategory: "home",
      price: 2850,
      inStock: true,
      images: ["public/images/blender1.jpg", "public/images/blender2.jpg"],
      name: {
        am: "ሳቺ 2-በ-1 ፈጪ እና መፍጫ",
        om: "Saachhi 2-in-1 Blenders (Makiinaa Harcaatuu)",
        en: "Saachhi 2-in-1 Blender"
      },
      spec: {
        am: "350W ኃይለኛ ሞተር፣ ሁለት ጃር እና ተጨማሪ መፍጫ ያለው ጥራት ያለው ማደባለቂያ።",
        om: "Motora humna 350W qabu, qodaa lama fi meeshaa daakuu wajjin.",
        en: "350W motor, two jars plus grinder attachment."
      },
      fullDesc: {
        am: "የሳቺ ኦሪጅናል 2-በ-1 ፈጪ። ፍራፍሬዎችን፣ ጁሶችን እና አትክልቶችን በቀላሉ የሚፈጭ ትልቅ ጃር እንዲሁም ቡና፣ ቅመማቅመም እና ደረቅ ነገሮችን የሚፈጭ ተጨማሪ ማያያዣ አለው።",
        om: "Saachhi 2-in-1 kan buna, mi'eessituu fi muduraa daakuuf gargaaru. Motora 350W jabaa, qodaa lama fi haaduu sibiila hin danda'amne qaba.",
        en: "Powerful 350W Saachhi blender featuring a large blending jug for juices/smoothies and a specialized stainless steel milling grinder for coffee, grains, and spices."
      },
      badge: { am: "ኃይለኛ", om: "Cimaa", en: "350W Power" }
    },
    {
      id: "prod-4",
      category: "beauty",
      price: 950,
      inStock: true,
      images: ["public/images/melanix.jpg"],
      name: {
        am: "ሜላኒክስ የፀጉር ቅባት",
        om: "Qoricha Rifeensaa Melanix",
        en: "Melanix Anti-Gray Hair Lotion"
      },
      spec: {
        am: "ከተፈጥሮ ንጥረነገሮች የተዘጋጀ፣ ሽበትን የሚከላከልና ተፈጥሮአዊ የፀጉር ቀለምን የሚመልስ ቅባት።",
        om: "Qoricha uumamaa rifeensa arrii ittisuu fi bifa uumamaa deebisu.",
        en: "All-natural botanical formula restores youthful natural hair."
      },
      fullDesc: {
        am: "ሜላኒክስ የጸጉርን ተፈጥሯዊ ሜላኒን በማነቃቃት የነጣ ፀጉርን ደረጃ በደረጃ ወደ ቀደመው ጥቁር ቀለም ይመልሳል። ምንም ዓይነት ጎጂ ኬሚካል የሌለው።",
        om: "Melanix rifeensa arrii gara bifa uumamaatti deebisuuf kan gargaaru. Kemikaala miidhaa qabu kan hin qabne, dhiiraafis dubartootaafis kan ta'u.",
        en: "Formulated with plant-derived actives to gently revitalize natural melanin synthesis in graying roots. Chemical dye-free, nourishing and suitable for both men and women."
      },
      badge: { am: "ተፈጥሯዊ", om: "Uumamaa", en: "Natural" }
    }
  ];

  // Safe Storage & Modal Helpers
  function getStorage(type, key, fallback = null) {
    try {
      if (typeof window === 'undefined') return fallback;
      const store = type === 'session' ? window.sessionStorage : window.localStorage;
      return store ? store.getItem(key) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function setStorage(type, key, value) {
    try {
      if (typeof window === 'undefined') return;
      const store = type === 'session' ? window.sessionStorage : window.localStorage;
      if (store) store.setItem(key, value);
    } catch (e) {}
  }

  function removeStorage(type, key) {
    try {
      if (typeof window === 'undefined') return;
      const store = type === 'session' ? window.sessionStorage : window.localStorage;
      if (store) store.removeItem(key);
    } catch (e) {}
  }

  function openElement(el) {
    if (!el) return;
    el.classList.add('active', 'open');
    el.setAttribute('aria-hidden', 'false');
  }

  function closeElement(el) {
    if (!el) return;
    el.classList.remove('active', 'open');
    el.setAttribute('aria-hidden', 'true');
  }

  // Neutral Husen Logo SVG Placeholder (zero-network permanent fallback, quote-sanitized)
  const HUSEN_FALLBACK_SVG = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23faf7f5%22/%3E%3Ccircle cx=%22200%22 cy=%22125%22 r=%2248%22 fill=%22%23d92a2a%22 opacity=%220.12%22/%3E%3Cpath d=%22M184 105 h32 v42 h-32 z M190 105 a10 10 0 0 1 20 0%22 fill=%22none%22 stroke=%22%23d92a2a%22 stroke-width=%223%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/%3E%3Ctext x=%22200%22 y=%22205%22 text-anchor=%22middle%22 fill=%22%23d92a2a%22 font-family=%22system-ui, -apple-system, sans-serif%22 font-weight=%22700%22 font-size=%2216%22%3EHUSEN ONLINE%3C/text%3E%3Ctext x=%22200%22 y=%22225%22 text-anchor=%22middle%22 fill=%22%23888888%22 font-family=%22system-ui, -apple-system, sans-serif%22 font-size=%2212%22%3EProduct Photo%3C/text%3E%3C/svg%3E";

  // Global bulletproof image error handler (never throws syntax error, handles 404/offline seamlessly)
  window.handleImgError = function(el) {
    if (!el || el.dataset.homFallbackApplied) return;
    el.dataset.homFallbackApplied = 'true';
    el.onerror = null;
    el.src = HUSEN_FALLBACK_SVG;
  };

  // Helper to safely extract image URL from either object { secure_url, public_id } or string
  function getImgSrc(img) {
    if (!img) return HUSEN_FALLBACK_SVG;
    if (typeof img === 'object' && img) {
      return img.secure_url || img.url || HUSEN_FALLBACK_SVG;
    }
    if (typeof img === 'string') {
      const trimmed = img.trim();
      if (!trimmed || trimmed === '[object Object]' || trimmed.startsWith('blob:') || trimmed.startsWith('data:image/svg+xml')) {
        return trimmed.startsWith('data:image/svg+xml') ? trimmed : HUSEN_FALLBACK_SVG;
      }
      return trimmed;
    }
    return HUSEN_FALLBACK_SVG;
  }

  // Sanitize stored products on load (normalize objects to clean string URLs)
  function sanitizeProductCatalog(prods) {
    if (!Array.isArray(prods)) return INITIAL_PRODUCTS;
    return prods.map(p => {
      let cleanImages = [];
      if (Array.isArray(p.images)) {
        cleanImages = p.images.map(img => {
          if (!img) return null;
          if (typeof img === 'object') return img.secure_url || img.url || null;
          if (typeof img === 'string') {
            const trimmed = img.trim();
            if (!trimmed || trimmed === '[object Object]' || trimmed.startsWith('blob:')) return null;
            return trimmed;
          }
          return null;
        }).filter(Boolean);
      }
      return {
        ...p,
        images: cleanImages.length > 0 ? cleanImages : ['public/images/storage1.jpg']
      };
    });
  }

  // Real-Time Multi-Device & Cross-Tab Sync Channel (< 3 Seconds Guarantee)
  const syncChannel = (typeof window !== 'undefined' && 'BroadcastChannel' in window)
    ? new BroadcastChannel('hom_sync_channel')
    : null;

  function broadcastProductSync(products, updatedAt) {
    if (syncChannel && Array.isArray(products)) {
      try {
        syncChannel.postMessage({
          type: 'SYNC_PRODUCTS',
          products: products,
          updatedAt: updatedAt || Date.now()
        });
      } catch (e) {}
    }
  }

  // ==========================================================================
  // 3. APPLICATION STATE
  // ==========================================================================
  const state = {
    lang: getStorage('session', 'hom_lang') || 'en',
    activeCategory: 'all',
    searchQuery: '',
    products: (() => {
      try {
        const stored = getStorage('local', 'hom_products');
        const parsed = stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
        const cleaned = sanitizeProductCatalog(parsed);
        try { localStorage.setItem('hom_products', JSON.stringify(cleaned)); } catch (e) {}
        return cleaned;
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    })(),
    cart: (() => {
      try {
        const stored = getStorage('local', 'hom_cart');
        return stored ? JSON.parse(stored) : [];
      } catch (e) {
        return [];
      }
    })(),
    settings: {
      cbeAccount: "1000123456789",
      cbeAccountName: "Husen Online Store",
      telebirrPhone: "0923245529",
      telebirrAccountName: "Husen Market"
    },
    categories: {},
    
    // Telegram Mini App Active Product
    tgProduct: null,
    tgProductQty: 1,
    tgImageIndex: 0,
    
    // 2-Step Checkout State
    checkoutStep: 1,
    customerData: {
      name: '',
      phone: '',
      landmark: '',
      address: ''
    },
    selectedPaymentOption: 'chapa',
    selectedManualSubMethod: 'Manual CBE',
    
    // Admin state & Cloudinary config
    adminUnlocked: localStorage.getItem('hom_admin_logged_in') === 'true',
    currentUser: (() => {
      try {
        const u = localStorage.getItem('hom_admin_user');
        return u ? JSON.parse(u) : null;
      } catch (e) {
        return null;
      }
    })(),
    cloudName: 'trkihe9m',
    uploadPreset: 'Husenonlinemarketing',
    orders: [],
    editorPhotos: [],
    failedUploads: [],
    
    // Chapa Hosted Modal state
    chapaSelectedMethod: 'telebirr',
    activeChapaTxRef: null,
    activeChapaAmount: 0,
    
    // Admin filtering state
    adminStockFilter: 'all',
    adminProdSearch: '',
    
    // Cloud sync & saving flags
    isSavingProduct: false,
    isUploadingPhotos: false,
    lastUpdatedAt: 0
  };

  // Listen to BroadcastChannel for instant < 50ms sync across tabs
  if (syncChannel) {
    syncChannel.onmessage = (event) => {
      if (event.data && event.data.type === 'SYNC_PRODUCTS' && Array.isArray(event.data.products)) {
        state.products = event.data.products;
        state.lastUpdatedAt = event.data.updatedAt || Date.now();
        try {
          localStorage.setItem('hom_products', JSON.stringify(state.products));
        } catch (e) {}
        renderCategories();
        renderProducts();
        if (state.adminUnlocked) renderAdminProducts();
      }
    };
  }

  // Listen to cross-window storage event
  window.addEventListener('storage', (e) => {
    if (e.key === 'hom_products' && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        if (Array.isArray(parsed)) {
          state.products = parsed;
          renderCategories();
          renderProducts();
          if (state.adminUnlocked) renderAdminProducts();
        }
      } catch (err) {}
    }
  });

  const crossfadeTimers = {};
  let tgCrossfadeTimer = null;

  // ==========================================================================
  // 4. DOM REFERENCES
  // ==========================================================================
  const dom = {
    languageGate: document.getElementById('languageGate'),
    appShell: document.getElementById('appShell'),
    brandHomeLink: document.getElementById('brandHomeLink'),
    
    // Header controls
    headerLangBtn: document.getElementById('headerLangBtn'),
    headerLangDropdown: document.getElementById('headerLangDropdown'),
    checkEn: document.getElementById('checkEn'),
    checkAm: document.getElementById('checkAm'),
    checkOm: document.getElementById('checkOm'),
    
    // Pinned Real-time Search
    searchBarWrap: document.getElementById('searchBarWrap'),
    productSearchInput: document.getElementById('productSearchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    searchEmptyState: document.getElementById('searchEmptyState'),
    btnResetSearch: document.getElementById('btnResetSearch'),

    openCartBtn: document.getElementById('openCartBtn'),
    cartCountBadge: document.getElementById('cartCountBadge'),
    categoryChipContainer: document.getElementById('categoryChipContainer'),
    productGrid: document.getElementById('productGrid'),
    productCountChip: document.getElementById('productCountChip'),
    
    heroBadgeText: document.getElementById('heroBadgeText'),
    heroHeadline: document.getElementById('heroHeadline'),
    heroSubtext: document.getElementById('heroSubtext'),
    statDelivery: document.getElementById('statDelivery'),
    statQuality: document.getElementById('statQuality'),
    statTelebirr: document.getElementById('statTelebirr'),
    catalogTitle: document.getElementById('catalogTitle'),
    catalogSubtitle: document.getElementById('catalogSubtitle'),
    trustDeliveryTitle: document.getElementById('trustDeliveryTitle'),
    trustDeliveryDesc: document.getElementById('trustDeliveryDesc'),
    trustSecureTitle: document.getElementById('trustSecureTitle'),
    trustSecureDesc: document.getElementById('trustSecureDesc'),
    trustContactTitle: document.getElementById('trustContactTitle'),

    // Telegram Mini App View
    tgProductView: document.getElementById('tgProductView'),
    closeTgViewBtn: document.getElementById('closeTgViewBtn'),
    tgHeaderCartBtn: document.getElementById('tgHeaderCartBtn'),
    tgHeroImageWrap: document.getElementById('tgHeroImageWrap'),
    tgProductTitle: document.getElementById('tgProductTitle'),
    tgUnitPrice: document.getElementById('tgUnitPrice'),
    tgStockPill: document.getElementById('tgStockPill'),
    tgDescHeading: document.getElementById('tgDescHeading'),
    tgProductDesc: document.getElementById('tgProductDesc'),
    tgQuantityLabel: document.getElementById('tgQuantityLabel'),
    tgQtyMinus: document.getElementById('tgQtyMinus'),
    tgQtyPlus: document.getElementById('tgQtyPlus'),
    tgQtyDisplay: document.getElementById('tgQtyDisplay'),
    tgTotalLabel: document.getElementById('tgTotalLabel'),
    tgDynamicTotalCalc: document.getElementById('tgDynamicTotalCalc'),
    tgTotalBreakdown: document.getElementById('tgTotalBreakdown'),
    tgAddToCartBtn: document.getElementById('tgAddToCartBtn'),
    tgBtnCartText: document.getElementById('tgBtnCartText'),
    tgBuyNowBtn: document.getElementById('tgBuyNowBtn'),
    tgBtnBuyText: document.getElementById('tgBtnBuyText'),
    tgBtnBuyPrice: document.getElementById('tgBtnBuyPrice'),

    // Cart Drawer
    cartBackdrop: document.getElementById('cartBackdrop'),
    cartDrawer: document.getElementById('cartDrawer'),
    closeCartBtn: document.getElementById('closeCartBtn'),
    cartDrawerTitle: document.getElementById('cartDrawerTitle'),
    cartHeaderCount: document.getElementById('cartHeaderCount'),
    cartAdamaBannerText: document.getElementById('cartAdamaBannerText'),
    cartItemsContainer: document.getElementById('cartItemsContainer'),
    cartSubtotalLabel: document.getElementById('cartSubtotalLabel'),
    cartSubtotalVal: document.getElementById('cartSubtotalVal'),
    cartDeliveryLabel: document.getElementById('cartDeliveryLabel'),
    cartDeliveryPill: document.getElementById('cartDeliveryPill'),
    cartTotalLabel: document.getElementById('cartTotalLabel'),
    cartGrandTotalVal: document.getElementById('cartGrandTotalVal'),
    proceedToCheckoutBtn: document.getElementById('proceedToCheckoutBtn'),
    btnCheckoutText: document.getElementById('btnCheckoutText'),
    btnCheckoutPrice: document.getElementById('btnCheckoutPrice'),

    // Checkout Modal (2-Step)
    checkoutBackdrop: document.getElementById('checkoutBackdrop'),
    checkoutModal: document.getElementById('checkoutModal'),
    closeCheckoutBtn: document.getElementById('closeCheckoutBtn'),
    checkoutModalTitle: document.getElementById('checkoutModalTitle'),
    checkoutModalSubtitle: document.getElementById('checkoutModalSubtitle'),
    pillStep1: document.getElementById('pillStep1'),
    pillStep2: document.getElementById('pillStep2'),
    checkoutItemsHeader: document.getElementById('checkoutItemsHeader'),
    checkoutSummaryTotal: document.getElementById('checkoutSummaryTotal'),
    checkoutSummaryItemsList: document.getElementById('checkoutSummaryItemsList'),
    
    // Step 1 Customer Info
    checkoutStep1: document.getElementById('checkoutStep1'),
    customerInfoForm: document.getElementById('customerInfoForm'),
    labelFullName: document.getElementById('labelFullName'),
    customerNameInput: document.getElementById('customerNameInput'),
    nameErrorMsg: document.getElementById('nameErrorMsg'),
    labelPhone: document.getElementById('labelPhone'),
    customerPhoneInput: document.getElementById('customerPhoneInput'),
    phoneHelperText: document.getElementById('phoneHelperText'),
    phoneErrorMsg: document.getElementById('phoneErrorMsg'),
    labelLandmark: document.getElementById('labelLandmark'),
    customerLandmarkInput: document.getElementById('customerLandmarkInput'),
    landmarkErrorMsg: document.getElementById('landmarkErrorMsg'),
    labelAddress: document.getElementById('labelAddress'),
    customerAddressInput: document.getElementById('customerAddressInput'),
    btnContinueToPayment: document.getElementById('btnContinueToPayment'),
    btnContinueText: document.getElementById('btnContinueText'),

    // Step 2 Payment Selection
    checkoutStep2: document.getElementById('checkoutStep2'),
    confirmedCustomerPill: document.getElementById('confirmedCustomerPill'),
    pillCustomerName: document.getElementById('pillCustomerName'),
    pillCustomerDetails: document.getElementById('pillCustomerDetails'),
    btnBackToStep1: document.getElementById('btnBackToStep1'),
    labelChoosePayment: document.getElementById('labelChoosePayment'),
    chapaName: document.getElementById('chapaName'),
    chapaDesc: document.getElementById('chapaDesc'),
    codName: document.getElementById('codName'),
    codDesc: document.getElementById('codDesc'),
    manualName: document.getElementById('manualName'),
    manualDesc: document.getElementById('manualDesc'),
    manualTransferDetailsBox: document.getElementById('manualTransferDetailsBox'),
    manualTotalNotice: document.getElementById('manualTotalNotice'),
    btnCopyCbe: document.getElementById('btnCopyCbe'),
    btnCopyTelebirr: document.getElementById('btnCopyTelebirr'),
    cbeAccountDisplay: document.getElementById('cbeAccountDisplay'),
    cbeNameDisplay: document.getElementById('cbeNameDisplay'),
    telebirrPhoneDisplay: document.getElementById('telebirrPhoneDisplay'),
    telebirrNameDisplay: document.getElementById('telebirrNameDisplay'),
    chapaInstruction: document.getElementById('chapaInstruction'),
    codInstruction: document.getElementById('codInstruction'),
    manualInstruction: document.getElementById('manualInstruction'),
    btnBackStep: document.getElementById('btnBackStep'),
    btnFinalizePayment: document.getElementById('btnFinalizePayment'),
    btnFinalizeText: document.getElementById('btnFinalizeText'),
    finalizeAmountVal: document.getElementById('finalizeAmountVal'),

    // Success Screen
    successBackdrop: document.getElementById('successBackdrop'),
    successTitle: document.getElementById('successTitle'),
    successSubtitle: document.getElementById('successSubtitle'),
    successOrderRefLabel: document.getElementById('successOrderRefLabel'),
    successOrderRefNumber: document.getElementById('successOrderRefNumber'),
    smsNoticeHeading: document.getElementById('smsNoticeHeading'),
    smsNoticeBody: document.getElementById('smsNoticeBody'),
    successCustomerLabel: document.getElementById('successCustomerLabel'),
    successCustomerVal: document.getElementById('successCustomerVal'),
    successPhoneLabel: document.getElementById('successPhoneLabel'),
    successPhoneVal: document.getElementById('successPhoneVal'),
    successLocationLabel: document.getElementById('successLocationLabel'),
    successLocationVal: document.getElementById('successLocationVal'),
    successPaymentLabel: document.getElementById('successPaymentLabel'),
    successPaymentVal: document.getElementById('successPaymentVal'),
    successAmountLabel: document.getElementById('successAmountLabel'),
    successAmountVal: document.getElementById('successAmountVal'),
    btnCallShopText: document.getElementById('btnCallShopText'),
    continueShoppingBtn: document.getElementById('continueShoppingBtn'),
    btnContinueShoppingText: document.getElementById('btnContinueShoppingText'),

    // Admin Portal
    adminBackdrop: document.getElementById('adminBackdrop'),
    openAdminBtn: document.getElementById('openAdminBtn'),
    closeAdminBtn: document.getElementById('closeAdminBtn'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminRefreshBtn: document.getElementById('adminRefreshBtn'),
    adminAuthView: document.getElementById('adminAuthView'),
    adminAccountSelect: document.getElementById('adminAccountSelect'),
    adminPinInput: document.getElementById('adminPinInput'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    adminDashboardView: document.getElementById('adminDashboardView'),
    adminTotalRevenue: document.getElementById('adminTotalRevenue'),
    adminOrderCount: document.getElementById('adminOrderCount'),
    adminProductsCount: document.getElementById('adminProductsCount'),
    adminProductsBadge: document.getElementById('adminProductsBadge'),
    adminTabProducts: document.getElementById('adminTabProducts'),
    adminTabOrders: document.getElementById('adminTabOrders'),
    adminTabActivity: document.getElementById('adminTabActivity'),
    adminTabSettings: document.getElementById('adminTabSettings'),
    adminTabPassword: document.getElementById('adminTabPassword'),
    adminOrdersBadge: document.getElementById('adminOrdersBadge'),
    adminPaneProducts: document.getElementById('adminPaneProducts'),
    adminPaneOrders: document.getElementById('adminPaneOrders'),
    adminPaneActivity: document.getElementById('adminPaneActivity'),
    adminPaneSettings: document.getElementById('adminPaneSettings'),
    adminPanePassword: document.getElementById('adminPanePassword'),
    adminActivityList: document.getElementById('adminActivityList'),
    btnRefreshActivityLog: document.getElementById('btnRefreshActivityLog'),
    btnExportProductsCsv: document.getElementById('btnExportProductsCsv'),
    btnExportProductsJson: document.getElementById('btnExportProductsJson'),
    adminProductList: document.getElementById('adminProductList'),
    adminOrdersList: document.getElementById('adminOrdersList'),
    openAddProductModalBtn: document.getElementById('openAddProductModalBtn'),
    adminCurrentUsername: document.getElementById('adminCurrentUsername'),
    adminCurrentRole: document.getElementById('adminCurrentRole'),

    // Change Password & Staff Reset
    changePasswordForm: document.getElementById('changePasswordForm'),
    currentPasswordInput: document.getElementById('currentPasswordInput'),
    newPasswordInput: document.getElementById('newPasswordInput'),
    confirmPasswordInput: document.getElementById('confirmPasswordInput'),
    btnSubmitChangePassword: document.getElementById('btnSubmitChangePassword'),
    ownerStaffResetSection: document.getElementById('ownerStaffResetSection'),
    ownerStaffResetForm: document.getElementById('ownerStaffResetForm'),
    resetStaffSelect: document.getElementById('resetStaffSelect'),
    ownerAuthPasswordInput: document.getElementById('ownerAuthPasswordInput'),
    newStaffPasswordInput: document.getElementById('newStaffPasswordInput'),
    confirmStaffPasswordInput: document.getElementById('confirmStaffPasswordInput'),
    btnSubmitStaffReset: document.getElementById('btnSubmitStaffReset'),

    // Admin Settings
    paymentSettingsForm: document.getElementById('paymentSettingsForm'),
    settingCbeAccount: document.getElementById('settingCbeAccount'),
    settingCbeName: document.getElementById('settingCbeName'),
    settingTelebirrPhone: document.getElementById('settingTelebirrPhone'),
    settingTelebirrName: document.getElementById('settingTelebirrName'),
    settingChapaKey: document.getElementById('settingChapaKey'),
    btnSaveSettings: document.getElementById('btnSaveSettings'),

    // Product CRUD Editor Modal
    productEditorBackdrop: document.getElementById('productEditorBackdrop'),
    productEditorForm: document.getElementById('productEditorForm'),
    closeEditorBtn: document.getElementById('closeEditorBtn'),
    cancelEditorBtn: document.getElementById('cancelEditorBtn'),
    editorModalTitle: document.getElementById('editorModalTitle'),
    editProductId: document.getElementById('editProductId'),
    editorProdName: document.getElementById('editorProdName'),
    editorProdCategory: document.getElementById('editorProdCategory'),
    categorySuggestions: document.getElementById('categorySuggestions'),
    btnToggleCatTrans: document.getElementById('btnToggleCatTrans'),
    catTranslationsCard: document.getElementById('catTranslationsCard'),
    editorCatAm: document.getElementById('editorCatAm'),
    editorCatOm: document.getElementById('editorCatOm'),
    editorCatEn: document.getElementById('editorCatEn'),
    editorProdPrice: document.getElementById('editorProdPrice'),
    editorProdDesc: document.getElementById('editorProdDesc'),
    editorProdInStock: document.getElementById('editorProdInStock'),
    editorFileInput: document.getElementById('editorFileInput'),
    btnDeviceUpload: document.getElementById('btnDeviceUpload'),
    uploadProgressList: document.getElementById('uploadProgressList'),
    uploadErrorBanner: document.getElementById('uploadErrorBanner'),
    editorThumbnailsGrid: document.getElementById('editorThumbnailsGrid'),
    saveProductBtn: document.getElementById('saveProductBtn'),
    saveProductBtnText: document.getElementById('saveProductBtnText'),

    // Cart Controls
    clearCartBtn: document.getElementById('clearCartBtn'),

    // Chapa Hosted Modal (Authentic PIN Popup)
    chapaModalBackdrop: document.getElementById('chapaModalBackdrop'),
    closeChapaModalBtn: document.getElementById('closeChapaModalBtn'),
    chapaModalAmount: document.getElementById('chapaModalAmount'),
    chapaModalTxRef: document.getElementById('chapaModalTxRef'),
    chapaTabTelebirr: document.getElementById('chapaTabTelebirr'),
    chapaTabCbe: document.getElementById('chapaTabCbe'),
    chapaTabCard: document.getElementById('chapaTabCard'),
    chapaFormTelebirr: document.getElementById('chapaFormTelebirr'),
    chapaFormCbe: document.getElementById('chapaFormCbe'),
    chapaFormCard: document.getElementById('chapaFormCard'),
    chapaTelebirrPhone: document.getElementById('chapaTelebirrPhone'),
    chapaTelebirrPin: document.getElementById('chapaTelebirrPin'),
    toggleTelebirrPin: document.getElementById('toggleTelebirrPin'),
    chapaCbeAccount: document.getElementById('chapaCbeAccount'),
    chapaCbePin: document.getElementById('chapaCbePin'),
    toggleCbePin: document.getElementById('toggleCbePin'),
    chapaCardNum: document.getElementById('chapaCardNum'),
    chapaCardExpiry: document.getElementById('chapaCardExpiry'),
    chapaCardCvv: document.getElementById('chapaCardCvv'),
    chapaProcessingStatus: document.getElementById('chapaProcessingStatus'),
    chapaStatusMsg: document.getElementById('chapaStatusMsg'),
    btnChapaAuthorizePay: document.getElementById('btnChapaAuthorizePay'),
    chapaBtnPayAmount: document.getElementById('chapaBtnPayAmount'),

    // Admin Controls
    btnTestSms: document.getElementById('btnTestSms'),
    adminProdSearchInput: document.getElementById('adminProdSearchInput'),
    linkToAdminApp: document.getElementById('linkToAdminApp'),

    // PWA Install UI Elements
    headerInstallBtn: document.getElementById('headerInstallBtn'),
    headerInstallBadge: document.getElementById('headerInstallBadge'),
    installBanner: document.getElementById('installBanner'),
    closeInstallBannerBtn: document.getElementById('closeInstallBannerBtn'),
    bannerInstallBtn: document.getElementById('bannerInstallBtn'),
    installBannerTitle: document.getElementById('installBannerTitle'),
    installBannerSub: document.getElementById('installBannerSub'),
    installBannerBtnText: document.getElementById('installBannerBtnText'),

    // iOS Safari Add to Home Screen Sheet
    iosInstallSheet: document.getElementById('iosInstallSheet'),
    closeIosSheetBtn: document.getElementById('closeIosSheetBtn'),
    iosGotItBtn: document.getElementById('iosGotItBtn'),
    iosSheetTitle: document.getElementById('iosSheetTitle'),
    iosStep1Text: document.getElementById('iosStep1Text'),
    iosStep2Text: document.getElementById('iosStep2Text'),
    iosStep3Text: document.getElementById('iosStep3Text'),
    iosToolbarHintText: document.getElementById('iosToolbarHintText'),

    // In-App Browser (TikTok / Telegram / IG) Modal
    inAppBrowserModal: document.getElementById('inAppBrowserModal'),
    closeInAppModalBtn: document.getElementById('closeInAppModalBtn'),
    inAppModalTitle: document.getElementById('inAppModalTitle'),
    inAppMessageText: document.getElementById('inAppMessageText'),
    inAppTipText: document.getElementById('inAppTipText'),
    btnCopyStoreLink: document.getElementById('btnCopyStoreLink'),
    btnCopyStoreLinkText: document.getElementById('btnCopyStoreLinkText'),
    btnOpenInBrowser: document.getElementById('btnOpenInBrowser'),
    btnOpenInBrowserText: document.getElementById('btnOpenInBrowserText'),

    toastContainer: document.getElementById('toastContainer')
  };

  function t() {
    return I18N[state.lang] || I18N.en;
  }

  function formatETB(val) {
    return Number(val).toLocaleString() + " ETB";
  }

  function showToast(message, icon = '✓') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    dom.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 3000);
  }

  // ==========================================================================
  // 5. BACKEND PERSISTENCE SYNC (/api/products & /api/settings)
  // ==========================================================================
  async function syncProductsFromBackend(force = false) {
    if (state.isSavingProduct && !force) return;
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          const serverUpdated = data.updatedAt || 0;
          const currentJson = JSON.stringify(state.products);
          const newJson = JSON.stringify(data.products);
          
          const isServerNewer = serverUpdated && serverUpdated > (state.lastUpdatedAt || 0);
          if (force || isServerNewer) {
            state.products = data.products;
            state.lastUpdatedAt = serverUpdated || Date.now();
            try {
              localStorage.setItem('hom_products', JSON.stringify(state.products));
            } catch (e) {}
            broadcastProductSync(state.products, state.lastUpdatedAt);
            renderCategories();
            renderProducts();
            if (state.adminUnlocked) renderAdminProducts();
          }
        }
      }
    } catch (e) {
      console.warn('[BACKEND NOTICE] Offline or local fallback active:', e.message);
    }
  }

  async function syncSettingsFromBackend() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.settings) {
          state.settings = { ...state.settings, ...data.settings };
          updateAccountDisplays();
        }
      }
    } catch (e) {
      console.warn('[BACKEND NOTICE] Settings sync notice:', e.message);
    }

    try {
      const configRes = await fetch('/api/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        if (configData.cloudName) state.cloudName = String(configData.cloudName).trim();
        if (configData.uploadPreset) state.uploadPreset = String(configData.uploadPreset).trim();
      }
    } catch (e) {}
  }

  function updateAccountDisplays() {
    if (dom.cbeAccountDisplay) dom.cbeAccountDisplay.textContent = state.settings.cbeAccount;
    if (dom.cbeNameDisplay) dom.cbeNameDisplay.textContent = state.settings.cbeAccountName;
    if (dom.telebirrPhoneDisplay) dom.telebirrPhoneDisplay.textContent = state.settings.telebirrPhone;
    if (dom.telebirrNameDisplay) dom.telebirrNameDisplay.textContent = state.settings.telebirrAccountName;
    if (dom.btnCopyCbe) dom.btnCopyCbe.setAttribute('data-copy', state.settings.cbeAccount);
    if (dom.btnCopyTelebirr) dom.btnCopyTelebirr.setAttribute('data-copy', state.settings.telebirrPhone);
    if (dom.settingCbeAccount) dom.settingCbeAccount.value = state.settings.cbeAccount || '';
    if (dom.settingCbeName) dom.settingCbeName.value = state.settings.cbeAccountName || '';
    if (dom.settingTelebirrPhone) dom.settingTelebirrPhone.value = state.settings.telebirrPhone || '';
    if (dom.settingTelebirrName) dom.settingTelebirrName.value = state.settings.telebirrAccountName || '';
    if (dom.settingChapaKey && state.settings.chapaSecretKey) dom.settingChapaKey.value = state.settings.chapaSecretKey;
  }

  // ==========================================================================
  // 6. LANGUAGE SYSTEM & HEADER DROPDOWN
  // ==========================================================================
  function initLanguageSystem() {
    const savedLang = getStorage('session', 'hom_lang');
    if (!savedLang) {
      if (dom.languageGate) {
        dom.languageGate.classList.remove('hidden');
        dom.languageGate.style.display = 'flex';
      }
    } else {
      state.lang = savedLang;
      if (dom.languageGate) {
        dom.languageGate.classList.add('hidden');
        dom.languageGate.style.display = 'none';
      }
    }

    document.querySelectorAll('.gate-lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-lang');
        if (dom.languageGate) {
          dom.languageGate.classList.add('hidden');
          dom.languageGate.style.display = 'none';
        }
        try {
          setLanguage(selected);
        } catch (err) {
          console.error('[Language select notice]', err);
        }
      });
    });

    if (dom.headerLangBtn) {
      dom.headerLangBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (dom.headerLangDropdown) {
          const isHidden = dom.headerLangDropdown.getAttribute('aria-hidden') !== 'false';
          dom.headerLangDropdown.setAttribute('aria-hidden', isHidden ? 'false' : 'true');
          dom.headerLangDropdown.classList.toggle('open', isHidden);
          dom.headerLangDropdown.classList.toggle('active', isHidden);
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (dom.headerLangDropdown && !dom.headerLangDropdown.contains(e.target) && e.target !== dom.headerLangBtn) {
        closeElement(dom.headerLangDropdown);
      }
    });

    document.querySelectorAll('.lang-dropdown-item').forEach(item => {
      item.addEventListener('click', () => {
        const selected = item.getAttribute('data-lang');
        setLanguage(selected);
        closeElement(dom.headerLangDropdown);
      });
    });

    applyLanguage();
  }

  function setLanguage(newLang) {
    if (!I18N[newLang]) return;
    state.lang = newLang;
    setStorage('session', 'hom_lang', newLang);
    applyLanguage();
  }

  function applyLanguage() {
    const strings = t();
    if (document.documentElement) document.documentElement.lang = state.lang;

    if (dom.checkEn) dom.checkEn.style.visibility = state.lang === 'en' ? 'visible' : 'hidden';
    if (dom.checkAm) dom.checkAm.style.visibility = state.lang === 'am' ? 'visible' : 'hidden';
    if (dom.checkOm) dom.checkOm.style.visibility = state.lang === 'om' ? 'visible' : 'hidden';

    // Update Hero
    if (dom.heroBadgeText) dom.heroBadgeText.textContent = strings.heroBadge;
    if (dom.heroHeadline) dom.heroHeadline.textContent = strings.heroHeadline;
    if (dom.heroSubtext) dom.heroSubtext.textContent = strings.heroSubtext;
    if (dom.statDelivery) dom.statDelivery.textContent = strings.statDelivery;
    if (dom.statQuality) dom.statQuality.textContent = strings.statQuality;
    if (dom.statTelebirr) dom.statTelebirr.textContent = strings.statTelebirr;

    // Catalog & Trust
    if (dom.catalogTitle) dom.catalogTitle.textContent = strings.catalogTitle;
    if (dom.catalogSubtitle) dom.catalogSubtitle.textContent = strings.catalogSubtitle;
    if (dom.trustDeliveryTitle) dom.trustDeliveryTitle.textContent = strings.trustDeliveryTitle;
    if (dom.trustDeliveryDesc) dom.trustDeliveryDesc.textContent = strings.trustDeliveryDesc;
    if (dom.trustSecureTitle) dom.trustSecureTitle.textContent = strings.trustSecureTitle;
    if (dom.trustSecureDesc) dom.trustSecureDesc.textContent = strings.trustSecureDesc;
    if (dom.trustContactTitle) dom.trustContactTitle.textContent = strings.trustContactTitle;

    // Cart Drawer
    if (dom.cartDrawerTitle) dom.cartDrawerTitle.textContent = strings.cartTitle;
    if (dom.cartAdamaBannerText) dom.cartAdamaBannerText.textContent = strings.cartAdamaBanner;
    if (dom.cartSubtotalLabel) dom.cartSubtotalLabel.textContent = strings.subtotal;
    if (dom.cartDeliveryLabel) dom.cartDeliveryLabel.textContent = strings.adamaDelivery;
    if (dom.cartDeliveryPill) dom.cartDeliveryPill.textContent = strings.freeDelivery;
    if (dom.cartTotalLabel) dom.cartTotalLabel.textContent = strings.grandTotal;
    if (dom.btnCheckoutText) dom.btnCheckoutText.textContent = strings.proceedCheckout;

    // Checkout
    if (dom.pillStep1) dom.pillStep1.textContent = strings.step1Pill;
    if (dom.pillStep2) dom.pillStep2.textContent = strings.step2Pill;
    if (dom.checkoutModalTitle) dom.checkoutModalTitle.textContent = strings.checkoutTitle;
    if (dom.checkoutModalSubtitle) dom.checkoutModalSubtitle.textContent = strings.checkoutSubtitle;
    if (dom.checkoutItemsHeader) dom.checkoutItemsHeader.textContent = strings.orderItems;
    if (dom.labelFullName) dom.labelFullName.textContent = strings.fullName;
    if (dom.labelPhone) dom.labelPhone.textContent = strings.phone;
    if (dom.phoneHelperText) dom.phoneHelperText.textContent = strings.phoneHelper;
    if (dom.labelLandmark) dom.labelLandmark.textContent = strings.landmarkLabel;
    if (dom.customerLandmarkInput) dom.customerLandmarkInput.placeholder = strings.landmarkPlaceholder;
    if (dom.labelAddress) dom.labelAddress.textContent = strings.addressLabel;
    if (dom.customerAddressInput) dom.customerAddressInput.placeholder = strings.addressPlaceholder;
    if (dom.btnContinueText) dom.btnContinueText.textContent = strings.continueToPayment;
    if (dom.labelChoosePayment) dom.labelChoosePayment.innerHTML = `<span>${strings.choosePaymentLabel}</span>`;
    if (dom.chapaName) dom.chapaName.textContent = strings.chapaName;
    if (dom.chapaDesc) dom.chapaDesc.textContent = strings.chapaDesc;
    if (dom.codName) dom.codName.textContent = strings.codName;
    if (dom.codDesc) dom.codDesc.textContent = strings.codDesc;
    if (dom.manualName) dom.manualName.textContent = strings.manualName;
    if (dom.manualDesc) dom.manualDesc.textContent = strings.manualDesc;

    // Success Screen
    if (dom.successTitle) dom.successTitle.textContent = strings.orderSuccessTitle;
    if (dom.successSubtitle) dom.successSubtitle.textContent = strings.orderSuccessSub;
    if (dom.successOrderRefLabel) dom.successOrderRefLabel.textContent = strings.orderRef;
    if (dom.smsNoticeHeading) dom.smsNoticeHeading.textContent = strings.smsNoticeTitle;
    if (dom.smsNoticeBody) dom.smsNoticeBody.innerHTML = strings.smsNoticeBody;
    if (dom.successCustomerLabel) dom.successCustomerLabel.textContent = strings.customer;
    if (dom.successPhoneLabel) dom.successPhoneLabel.textContent = strings.phoneLabel;
    if (dom.successLocationLabel) dom.successLocationLabel.textContent = strings.locationLabel;
    if (dom.successPaymentLabel) dom.successPaymentLabel.textContent = strings.paymentLabel;
    if (dom.successAmountLabel) dom.successAmountLabel.textContent = strings.amountLabel;
    if (dom.btnCallShopText) dom.btnCallShopText.textContent = strings.callShopBtn;
    if (dom.btnContinueShoppingText) dom.btnContinueShoppingText.textContent = strings.continueShoppingBtn;

    // Telegram view
    if (dom.tgDescHeading) dom.tgDescHeading.textContent = strings.catalogTitle;
    if (dom.tgQuantityLabel) dom.tgQuantityLabel.textContent = strings.selectQty;
    if (dom.tgTotalLabel) dom.tgTotalLabel.textContent = strings.totalAmountLabel;
    if (dom.tgBtnCartText) dom.tgBtnCartText.textContent = strings.addToCart;
    if (dom.tgBtnBuyText) dom.tgBtnBuyText.textContent = strings.buyNow;

    // PWA Install UI Language Updates
    if (dom.headerInstallBadge) dom.headerInstallBadge.textContent = strings.installBtn;
    if (dom.headerInstallBtn) dom.headerInstallBtn.setAttribute('title', strings.installBtn);
    if (dom.installBannerTitle) dom.installBannerTitle.textContent = strings.installBannerTitle;
    if (dom.installBannerSub) dom.installBannerSub.textContent = strings.installBannerSub;
    if (dom.installBannerBtnText) dom.installBannerBtnText.textContent = strings.installBannerBtn;

    // iOS Safari Sheet
    if (dom.iosSheetTitle) dom.iosSheetTitle.textContent = strings.iosInstallTitle;
    if (dom.iosStep1Text) dom.iosStep1Text.innerHTML = `${strings.iosInstallStep1}`;
    if (dom.iosStep2Text) dom.iosStep2Text.innerHTML = `${strings.iosInstallStep2}`;
    if (dom.iosStep3Text) dom.iosStep3Text.innerHTML = `${strings.iosInstallStep3}`;
    if (dom.iosToolbarHintText) dom.iosToolbarHintText.textContent = strings.iosToolbarHint;
    if (dom.iosGotItBtn) dom.iosGotItBtn.textContent = strings.gotItBtn;

    // In-App Browser Modal
    if (dom.inAppModalTitle) dom.inAppModalTitle.textContent = strings.inAppTitle;
    if (dom.inAppMessageText) dom.inAppMessageText.textContent = strings.inAppMsg;
    if (dom.inAppTipText) dom.inAppTipText.textContent = strings.inAppStepTip;
    if (dom.btnCopyStoreLinkText) dom.btnCopyStoreLinkText.textContent = strings.copyLinkBtn;
    if (dom.btnOpenInBrowserText) dom.btnOpenInBrowserText.textContent = strings.openInBrowserBtn;

    updateFinalizeButtonText();
    renderCategories();
    renderProducts();
    renderCart();
  }

  // ==========================================================================
  // 7. CATEGORY NAVIGATION CHIPS (Dynamic Free-Text Categories)
  // ==========================================================================
  function renderCategories() {
    if (!dom.categoryChipContainer) return;
    const catMap = t().categories || {};

    const defaultCategoryTrans = {
      kitchen: { en: 'Kitchen', am: 'ማብሰያ & ኩሽና', om: 'Kushiinaa', icon: '🍳' },
      home: { en: 'Home', am: 'የቤት ዕቃዎች', om: 'Meeshaa Manaa', icon: '🏠' },
      beauty: { en: 'Beauty', am: 'ውበት', om: 'Bareedina', icon: '💄' },
      health: { en: 'Health', am: 'ጤና', om: 'Fayyaa', icon: '🌿' }
    };

    // A category with no visible products disappears from the bar
    const activeCatsMap = new Map();

    state.products.forEach(p => {
      if (p.inStock === false) return; // Disappear if no visible products
      const raw = (p.category || '').trim();
      if (!raw) return;
      const key = raw.toLowerCase();

      if (!activeCatsMap.has(key)) {
        let label = raw;
        let icon = '🏷️';

        if (defaultCategoryTrans[key]) {
          label = defaultCategoryTrans[key][state.lang] || defaultCategoryTrans[key].en || raw;
          icon = defaultCategoryTrans[key].icon || '🏷️';
        } else if (p.categoryTranslations) {
          label = p.categoryTranslations[state.lang] || p.categoryTranslations.en || p.categoryTranslations.am || p.categoryTranslations.om || raw;
        } else if (state.categories && state.categories[key]) {
          label = state.categories[key][state.lang] || state.categories[key].en || raw;
        }

        activeCatsMap.set(key, {
          key: key,
          originalName: raw,
          label: label,
          icon: icon
        });
      }
    });

    const categoryList = [
      { key: 'all', label: catMap.all || 'All', icon: '✨' },
      ...Array.from(activeCatsMap.values())
    ];

    // If activeCategory is no longer in the list (unless 'all'), reset to 'all'
    if (state.activeCategory !== 'all' && !activeCatsMap.has(state.activeCategory.toLowerCase())) {
      state.activeCategory = 'all';
    }

    dom.categoryChipContainer.innerHTML = categoryList.map(c => `
      <button type="button" class="category-chip ${state.activeCategory.toLowerCase() === c.key.toLowerCase() ? 'active' : ''}" data-cat="${c.key}">
        <span>${c.icon}</span>
        <span>${c.label}</span>
      </button>
    `).join('');

    dom.categoryChipContainer.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.getAttribute('data-cat') || 'all';
        renderCategories();
        renderProducts();
      });
    });

    updateCategorySuggestions();
  }

  function updateCategorySuggestions() {
    if (!dom.categorySuggestions) return;
    const catSet = new Set();
    state.products.forEach(p => {
      const c = (p.category || '').trim();
      if (c) catSet.add(c);
    });
    ['Kitchen', 'Home', 'Beauty', 'Health'].forEach(c => catSet.add(c));
    dom.categorySuggestions.innerHTML = Array.from(catSet).map(c => `<option value="${c}">`).join('');
  }

  // Helper to extract localized text or fallback
  function getLocString(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.en || obj.am || obj.om || '';
  }

  // ==========================================================================
  // 8. STOREFRONT 2-COLUMN PRODUCT GRID (Strictly inStock === true)
  // ==========================================================================
  function getFilteredStorefrontProducts() {
    const q = (state.searchQuery || '').trim().toLowerCase();

    // STRICT SPECIFICATION: Storefront must strictly show products where inStock === true
    // Out-of-stock items are completely removed from customer view.
    return state.products.filter(p => {
      if (p.inStock === false) return false;

      // Category match: trimmed and case-insensitive
      if (state.activeCategory !== 'all') {
        const prodCat = (p.category || '').trim().toLowerCase();
        const prodSecCat = (p.secondaryCategory || '').trim().toLowerCase();
        const targetCat = state.activeCategory.trim().toLowerCase();
        const matchesCategory = (prodCat === targetCat) || (prodSecCat === targetCat);
        if (!matchesCategory) return false;
      }

      // Live search query matching across title, category, description/spec
      if (q) {
        const titleEn = getLocString(p.name, 'en').toLowerCase();
        const titleAm = getLocString(p.name, 'am').toLowerCase();
        const titleOm = getLocString(p.name, 'om').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        const descEn = getLocString(p.fullDesc || p.spec, 'en').toLowerCase();
        const descAm = getLocString(p.fullDesc || p.spec, 'am').toLowerCase();
        const descOm = getLocString(p.fullDesc || p.spec, 'om').toLowerCase();

        const match = titleEn.includes(q) || titleAm.includes(q) || titleOm.includes(q) ||
                      cat.includes(q) || descEn.includes(q) || descAm.includes(q) || descOm.includes(q);
        if (!match) return false;
      }

      return true;
    });
  }

  function renderProducts() {
    if (!dom.productGrid) return;
    Object.values(crossfadeTimers).forEach(clearInterval);

    const visibleProducts = getFilteredStorefrontProducts();

    if (dom.productCountChip) {
      dom.productCountChip.textContent = `${visibleProducts.length} ${t().itemsCount}`;
    }

    if (visibleProducts.length === 0) {
      dom.productGrid.style.display = 'none';
      if (dom.searchEmptyState) dom.searchEmptyState.style.display = 'block';
      return;
    }

    dom.productGrid.style.display = 'grid';
    if (dom.searchEmptyState) dom.searchEmptyState.style.display = 'none';

    dom.productGrid.innerHTML = visibleProducts.map(p => {
      const name = getLocString(p.name, state.lang);
      const spec = getLocString(p.spec, state.lang);
      const badge = getLocString(p.badge, state.lang);
      const images = p.images && p.images.length > 0 ? p.images : ['public/images/storage1.jpg'];
      const hasMulti = images.length > 1;

      return `
        <article class="product-card" data-id="${p.id}" tabindex="0" role="button" aria-label="${name}">
          <div class="product-image-container">
            ${badge ? `<span class="card-badge">${badge}</span>` : ''}
            ${hasMulti ? `
              <div class="multi-photo-indicator">
                <span>📸</span>
                ${images.map((_, i) => `<span class="multi-photo-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></span>`).join('')}
              </div>
            ` : ''}
            <div class="product-crossfade-wrap" id="crossfade-${p.id}">
              ${images.map((img, i) => `
                <img src="${getImgSrc(img)}" alt="${name}" class="product-img ${i === 0 ? 'active' : 'inactive'}" data-index="${i}" loading="lazy" onerror="window.handleImgError(this);">
              `).join('')}
            </div>
          </div>

          <div class="product-card-body">
            <span class="product-category-tag">${p.category}</span>
            <h3 class="product-title">${name}</h3>
            <p class="product-spec-bullet">${spec}</p>

            <div class="product-card-footer">
              <div class="product-price-wrap">
                <span class="product-price-val">${formatETB(p.price)}</span>
              </div>
              <button type="button" class="btn-buy-now btn-quick-buy" data-id="${p.id}">
                ${t().buyNow}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Setup Crossfade Animation for multi-photo cards (Auto-rotate every 5 seconds)
    visibleProducts.forEach(p => {
      const images = p.images && p.images.length > 0 ? p.images : [];
      if (images.length > 1) {
        let currentIdx = 0;
        crossfadeTimers[p.id] = setInterval(() => {
          const wrap = document.getElementById(`crossfade-${p.id}`);
          if (!wrap) return;
          const imgElements = wrap.querySelectorAll('.product-img');
          const card = wrap.closest ? wrap.closest('.product-card') : null;
          const dots = card ? card.querySelectorAll('.multi-photo-dot') : [];
          
          if (imgElements.length > 0) {
            imgElements[currentIdx].classList.remove('active');
            imgElements[currentIdx].classList.add('inactive');
            if (dots[currentIdx]) dots[currentIdx].classList.remove('active');

            currentIdx = (currentIdx + 1) % imgElements.length;

            imgElements[currentIdx].classList.remove('inactive');
            imgElements[currentIdx].classList.add('active');
            if (dots[currentIdx]) dots[currentIdx].classList.add('active');
          }
        }, 5000);
      }
    });

    // Wire Card Clicks & Quick Buy buttons
    dom.productGrid.querySelectorAll('.product-card').forEach(card => {
      const id = card.getAttribute('data-id');
      card.addEventListener('click', (e) => {
        if (e.target.closest('.btn-quick-buy')) {
          e.stopPropagation();
          const prod = state.products.find(item => item.id === id);
          if (prod) openDirectCheckout(prod);
          return;
        }
        openTelegramProductView(id);
      });
    });
  }

  // ==========================================================================
  // 9. PINNED REAL-TIME SEARCH BAR LOGIC
  // ==========================================================================
  function initSearchBar() {
    if (!dom.productSearchInput) return;

    dom.productSearchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      if (dom.searchClearBtn) {
        dom.searchClearBtn.style.display = state.searchQuery ? 'flex' : 'none';
      }
      renderProducts();
    });

    if (dom.searchClearBtn) {
      dom.searchClearBtn.addEventListener('click', () => {
        dom.productSearchInput.value = '';
        state.searchQuery = '';
        dom.searchClearBtn.style.display = 'none';
        dom.productSearchInput.focus();
        renderProducts();
      });
    }

    if (dom.btnResetSearch) {
      dom.btnResetSearch.addEventListener('click', () => {
        if (dom.productSearchInput) dom.productSearchInput.value = '';
        state.searchQuery = '';
        state.activeCategory = 'all';
        if (dom.searchClearBtn) dom.searchClearBtn.style.display = 'none';
        renderCategories();
        renderProducts();
      });
    }
  }

  // ==========================================================================
  // 10. TELEGRAM MINI APP PRODUCT DETAIL VIEW
  // ==========================================================================
  function openTelegramProductView(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    state.tgProduct = product;
    state.tgProductQty = 1;
    state.tgImageIndex = 0;

    // Telegram WebApp expand
    if (window.Telegram && window.Telegram.WebApp) {
      try {
        window.Telegram.WebApp.expand();
      } catch (e) {}
    }

    const name = getLocString(product.name, state.lang);
    const desc = getLocString(product.fullDesc || product.spec, state.lang);
    const images = product.images && product.images.length > 0 ? product.images : ['public/images/storage1.jpg'];

    if (dom.tgProductTitle) dom.tgProductTitle.textContent = name;
    if (dom.tgUnitPrice) dom.tgUnitPrice.textContent = formatETB(product.price);
    if (dom.tgProductDesc) dom.tgProductDesc.textContent = desc;

    // Stock indicator
    if (dom.tgStockPill) {
      dom.tgStockPill.textContent = product.inStock ? `✓ ${t().inStock}` : `✕ ${t().outOfStock}`;
      dom.tgStockPill.className = product.inStock ? 'tg-stock-pill' : 'tg-stock-pill out';
    }

    // Render Hero Images
    if (dom.tgHeroImageWrap) {
      dom.tgHeroImageWrap.innerHTML = `
        <div class="tg-crossfade-container" id="tgHeroCrossfade">
          ${images.map((img, i) => `
            <img src="${getImgSrc(img)}" alt="${name}" class="tg-hero-img ${i === 0 ? 'active' : 'inactive'}" data-index="${i}" onerror="window.handleImgError(this);">
          `).join('')}
        </div>
        ${images.length > 1 ? `
          <div class="tg-hero-dots">
            ${images.map((_, i) => `<span class="tg-dot ${i === 0 ? 'active' : ''}"></span>`).join('')}
          </div>
        ` : ''}
      `;
    }

    if (tgCrossfadeTimer) clearInterval(tgCrossfadeTimer);
    if (images.length > 1) {
      tgCrossfadeTimer = setInterval(() => {
        const wrap = document.getElementById('tgHeroCrossfade');
        if (!wrap) return;
        const imgs = wrap.querySelectorAll('.tg-hero-img');
        const dots = dom.tgHeroImageWrap.querySelectorAll('.tg-dot');
        if (imgs.length > 0) {
          imgs[state.tgImageIndex].classList.remove('active');
          imgs[state.tgImageIndex].classList.add('inactive');
          if (dots[state.tgImageIndex]) dots[state.tgImageIndex].classList.remove('active');

          state.tgImageIndex = (state.tgImageIndex + 1) % imgs.length;

          imgs[state.tgImageIndex].classList.remove('inactive');
          imgs[state.tgImageIndex].classList.add('active');
          if (dots[state.tgImageIndex]) dots[state.tgImageIndex].classList.add('active');
        }
      }, 4000);
    }

    updateTgTotals();

    openElement(dom.tgProductView);

    // Trigger PWA Install Banner when visitor views a product
    if (typeof window.triggerInstallBanner === 'function') {
      window.triggerInstallBanner();
    }
  }

  function closeTelegramProductView() {
    if (tgCrossfadeTimer) clearInterval(tgCrossfadeTimer);
    closeElement(dom.tgProductView);
  }

  function updateTgTotals() {
    if (!state.tgProduct) return;
    const total = state.tgProduct.price * state.tgProductQty;
    if (dom.tgQtyDisplay) dom.tgQtyDisplay.textContent = state.tgProductQty;
    if (dom.tgDynamicTotalCalc) dom.tgDynamicTotalCalc.textContent = formatETB(total);
    if (dom.tgTotalBreakdown) {
      dom.tgTotalBreakdown.textContent = `(${formatETB(state.tgProduct.price)} × ${state.tgProductQty})`;
    }
    if (dom.tgBtnBuyPrice) dom.tgBtnBuyPrice.textContent = formatETB(total);
  }

  // ==========================================================================
  // 11. CART DRAWER MANAGEMENT
  // ==========================================================================
  function addToCart(product, qty = 1) {
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images && product.images[0] ? getImgSrc(product.images[0]) : 'public/images/storage1.jpg',
        qty: qty
      });
    }
    localStorage.setItem('hom_cart', JSON.stringify(state.cart));
    renderCart();
    showToast(t().addedToCartToast, '🛒');
  }

  function renderCart() {
    const count = state.cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (dom.cartCountBadge) {
      dom.cartCountBadge.textContent = count;
      dom.cartCountBadge.style.display = count > 0 ? 'inline-flex' : 'none';
    }
    if (dom.cartHeaderCount) dom.cartHeaderCount.textContent = `(${count} ${t().itemsCount})`;
    if (dom.cartSubtotalVal) dom.cartSubtotalVal.textContent = formatETB(subtotal);
    if (dom.cartGrandTotalVal) dom.cartGrandTotalVal.textContent = formatETB(subtotal);
    if (dom.btnCheckoutPrice) dom.btnCheckoutPrice.textContent = formatETB(subtotal);

    if (dom.clearCartBtn) {
      dom.clearCartBtn.style.display = state.cart.length > 0 ? 'inline-flex' : 'none';
    }

    if (!dom.cartItemsContainer) return;

    if (state.cart.length === 0) {
      dom.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <span class="empty-icon" style="font-size: 2.5rem; display: block; margin-bottom: 8px;">🛒</span>
          <h3 style="font-size: 1.05rem; font-weight: 700; color: var(--text-main); margin-bottom: 4px;">${t().cartEmpty}</h3>
          <p style="font-size: 0.8rem; color: var(--text-muted);">${t().cartEmptySub}</p>
        </div>
      `;
      if (dom.proceedToCheckoutBtn) dom.proceedToCheckoutBtn.disabled = true;
      return;
    }

    if (dom.proceedToCheckoutBtn) dom.proceedToCheckoutBtn.disabled = false;

    dom.cartItemsContainer.innerHTML = state.cart.map(item => {
      const lineTotal = item.price * item.qty;
      return `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${getImgSrc(item.image)}" alt="${getLocString(item.name, state.lang)}" class="cart-item-img" onerror="window.handleImgError(this);">
          
          <div class="cart-item-info">
            <h4 class="cart-item-name">${getLocString(item.name, state.lang)}</h4>
            <div style="display: flex; align-items: baseline; gap: 8px;">
              <span class="cart-item-price">${formatETB(lineTotal)}</span>
              ${item.qty > 1 ? `<small style="font-size: 0.7rem; color: var(--text-muted);">(${formatETB(item.price)} ea)</small>` : ''}
            </div>
            
            <div class="cart-item-stepper">
              <button type="button" class="btn-cart-minus" data-id="${item.id}" title="Decrease quantity">−</button>
              <span class="cart-item-qty">${item.qty}</span>
              <button type="button" class="btn-cart-plus" data-id="${item.id}" title="Increase quantity">+</button>
            </div>
          </div>
          
          <button type="button" class="btn-cart-remove" data-id="${item.id}" title="Remove item">✕</button>
        </div>
      `;
    }).join('');

    dom.cartItemsContainer.querySelectorAll('.btn-cart-minus').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.getAttribute('data-id'), -1));
    });
    dom.cartItemsContainer.querySelectorAll('.btn-cart-plus').forEach(btn => {
      btn.addEventListener('click', () => updateCartItemQty(btn.getAttribute('data-id'), 1));
    });
    dom.cartItemsContainer.querySelectorAll('.btn-cart-remove').forEach(btn => {
      btn.addEventListener('click', () => removeCartItem(btn.getAttribute('data-id')));
    });
  }

  function clearEntireCart() {
    if (state.cart.length === 0) return;
    state.cart = [];
    localStorage.removeItem('hom_cart');
    renderCart();
    showToast('Cart cleared');
  }

  function updateCartItemQty(id, delta) {
    const item = state.cart.find(p => p.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeCartItem(id);
      return;
    }
    localStorage.setItem('hom_cart', JSON.stringify(state.cart));
    renderCart();
  }

  function removeCartItem(id) {
    state.cart = state.cart.filter(p => p.id !== id);
    localStorage.setItem('hom_cart', JSON.stringify(state.cart));
    renderCart();
  }

  function openCart() {
    openElement(dom.cartBackdrop);
  }

  function closeCart() {
    closeElement(dom.cartBackdrop);
  }

  // ==========================================================================
  // 12. CHECKOUT SYSTEM & STRICT PHONE VALIDATION (Specification Section 3 & 4)
  // ==========================================================================
  function openDirectCheckout(product) {
    state.cart = [{
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images && product.images[0] ? getImgSrc(product.images[0]) : 'public/images/storage1.jpg',
      qty: 1
    }];
    renderCart();
    openCheckout();
  }

  function openCheckout() {
    closeCart();
    closeTelegramProductView();
    state.checkoutStep = 1;

    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    if (dom.checkoutSummaryTotal) dom.checkoutSummaryTotal.textContent = formatETB(subtotal);
    if (dom.finalizeAmountVal) dom.finalizeAmountVal.textContent = formatETB(subtotal);
    if (dom.manualTotalNotice) dom.manualTotalNotice.textContent = formatETB(subtotal);

    if (dom.checkoutSummaryItemsList) {
      dom.checkoutSummaryItemsList.innerHTML = state.cart.map(item => `
        <span class="summary-pill">${getLocString(item.name, state.lang)} × ${item.qty}</span>
      `).join('');
    }

    setCheckoutStep(1);

    openElement(dom.checkoutBackdrop);
  }

  function closeCheckout() {
    closeElement(dom.checkoutBackdrop);
  }

  function setCheckoutStep(step) {
    state.checkoutStep = step;
    if (step === 1) {
      if (dom.pillStep1) { dom.pillStep1.classList.add('active'); dom.pillStep1.classList.remove('completed'); }
      if (dom.pillStep2) { dom.pillStep2.classList.remove('active'); }
      if (dom.checkoutStep1) dom.checkoutStep1.style.display = 'block';
      if (dom.checkoutStep2) dom.checkoutStep2.style.display = 'none';
      if (dom.checkoutModalTitle) dom.checkoutModalTitle.textContent = t().checkoutTitle;
    } else {
      if (dom.pillStep1) { dom.pillStep1.classList.remove('active'); dom.pillStep1.classList.add('completed'); }
      if (dom.pillStep2) { dom.pillStep2.classList.add('active'); }
      if (dom.checkoutStep1) dom.checkoutStep1.style.display = 'none';
      if (dom.checkoutStep2) dom.checkoutStep2.style.display = 'block';
      if (dom.checkoutModalTitle) dom.checkoutModalTitle.textContent = t().choosePaymentLabel;

      if (dom.pillCustomerName) dom.pillCustomerName.textContent = state.customerData.name;
      if (dom.pillCustomerDetails) {
        dom.pillCustomerDetails.textContent = `+251${state.customerData.phone} • ${state.customerData.landmark}`;
      }
      updateFinalizeButtonText();
    }
  }

  /**
   * Ethiopian Mobile Phone Number Validation:
   * Remove leading 0 if user enters it.
   * Regex: ^[97]\d{8}$ (accepts 9 digits starting with 9 or 7).
   */
  function cleanPhoneNumberInput(val) {
    let raw = (val || '').toString().replace(/[^0-9]/g, '');
    // Automatically strip leading 0
    if (raw.startsWith('0')) {
      raw = raw.substring(1);
    }
    // Limit to 9 digits
    if (raw.length > 9) {
      raw = raw.substring(0, 9);
    }
    return raw;
  }

  function isValidEthiopianMobile(phoneDigits) {
    return /^[97]\d{8}$/.test(phoneDigits);
  }

  function initCheckoutForm() {
    // Live strip leading 0 from phone input
    if (dom.customerPhoneInput) {
      dom.customerPhoneInput.addEventListener('input', (e) => {
        const cleaned = cleanPhoneNumberInput(e.target.value);
        if (e.target.value !== cleaned) {
          e.target.value = cleaned;
        }
        if (dom.phoneErrorMsg) dom.phoneErrorMsg.style.display = 'none';
      });
    }

    // Landmark Quick Hood Chips
    document.querySelectorAll('.quick-hood-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hood = btn.getAttribute('data-hood');
        if (dom.customerLandmarkInput) {
          dom.customerLandmarkInput.value = hood;
          if (dom.landmarkErrorMsg) dom.landmarkErrorMsg.style.display = 'none';
        }
      });
    });

    // Step 1 Submission
    if (dom.customerInfoForm) {
      dom.customerInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;

        const name = (dom.customerNameInput ? dom.customerNameInput.value : '').trim();
        const rawPhone = dom.customerPhoneInput ? dom.customerPhoneInput.value : '';
        const cleanedPhone = cleanPhoneNumberInput(rawPhone);
        const landmark = (dom.customerLandmarkInput ? dom.customerLandmarkInput.value : '').trim();
        const address = (dom.customerAddressInput ? dom.customerAddressInput.value : '').trim();

        if (!name) {
          if (dom.nameErrorMsg) dom.nameErrorMsg.style.display = 'block';
          valid = false;
        } else {
          if (dom.nameErrorMsg) dom.nameErrorMsg.style.display = 'none';
        }

        if (!isValidEthiopianMobile(cleanedPhone)) {
          if (dom.phoneErrorMsg) dom.phoneErrorMsg.style.display = 'block';
          valid = false;
        } else {
          if (dom.phoneErrorMsg) dom.phoneErrorMsg.style.display = 'none';
        }

        if (!landmark) {
          if (dom.landmarkErrorMsg) dom.landmarkErrorMsg.style.display = 'block';
          valid = false;
        } else {
          if (dom.landmarkErrorMsg) dom.landmarkErrorMsg.style.display = 'none';
        }

        if (!valid) return;

        state.customerData = {
          name: name,
          phone: cleanedPhone, // 9 digits, e.g. 912345678
          landmark: landmark,
          address: address
        };

        setCheckoutStep(2);
      });
    }

    if (dom.btnBackToStep1) {
      dom.btnBackToStep1.addEventListener('click', () => setCheckoutStep(1));
    }
    if (dom.btnBackStep) {
      dom.btnBackStep.addEventListener('click', () => setCheckoutStep(1));
    }

    // Payment method radio listeners
    document.querySelectorAll('input[name="paymentOption"]').forEach(radio => {
      radio.addEventListener('change', () => {
        state.selectedPaymentOption = radio.value;
        document.querySelectorAll('.payment-card').forEach(card => card.classList.remove('selected'));
        const parentCard = radio.closest('.payment-card');
        if (parentCard) parentCard.classList.add('selected');

        if (dom.chapaInstruction) dom.chapaInstruction.style.display = radio.value === 'chapa' ? 'flex' : 'none';
        if (dom.codInstruction) dom.codInstruction.style.display = radio.value === 'cod' ? 'flex' : 'none';
        if (dom.manualInstruction) dom.manualInstruction.style.display = radio.value === 'manual' ? 'flex' : 'none';
        if (dom.manualTransferDetailsBox) dom.manualTransferDetailsBox.style.display = radio.value === 'manual' ? 'block' : 'none';

        updateFinalizeButtonText();
      });
    });

    document.querySelectorAll('input[name="manualSubMethod"]').forEach(subRadio => {
      subRadio.addEventListener('change', () => {
        state.selectedManualSubMethod = subRadio.value;
      });
    });

    // Copy buttons for CBE and Telebirr
    if (dom.btnCopyCbe) {
      dom.btnCopyCbe.addEventListener('click', () => {
        const text = dom.btnCopyCbe.getAttribute('data-copy') || state.settings.cbeAccount;
        copyToClipboard(text, dom.btnCopyCbe);
      });
    }
    if (dom.btnCopyTelebirr) {
      dom.btnCopyTelebirr.addEventListener('click', () => {
        const text = dom.btnCopyTelebirr.getAttribute('data-copy') || state.settings.telebirrPhone;
        copyToClipboard(text, dom.btnCopyTelebirr);
      });
    }

    // Finalize Payment Button
    if (dom.btnFinalizePayment) {
      dom.btnFinalizePayment.addEventListener('click', handlePaymentExecution);
    }
  }

  function copyToClipboard(text, btnElement) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerCopyFeedback(btnElement);
      }).catch(() => fallbackCopy(text, btnElement));
    } else {
      fallbackCopy(text, btnElement);
    }
  }

  function fallbackCopy(text, btnElement) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    triggerCopyFeedback(btnElement);
  }

  function triggerCopyFeedback(btnElement) {
    const textSpan = btnElement.querySelector('.copy-text');
    const originalText = textSpan ? textSpan.textContent : 'Copy';
    btnElement.classList.add('copied');
    if (textSpan) textSpan.textContent = 'Copied! ✓';
    showToast(`Copied ${btnElement.getAttribute('data-copy')} to clipboard`);
    setTimeout(() => {
      btnElement.classList.remove('copied');
      if (textSpan) textSpan.textContent = originalText;
    }, 2000);
  }

  function updateFinalizeButtonText() {
    if (!dom.btnFinalizeText) return;
    if (state.selectedPaymentOption === 'chapa') {
      dom.btnFinalizeText.textContent = t().btnFinalizeChapa;
    } else if (state.selectedPaymentOption === 'cod') {
      dom.btnFinalizeText.textContent = t().btnFinalizeCod;
    } else {
      dom.btnFinalizeText.textContent = t().btnFinalizeManual;
    }
  }

  // ==========================================================================
  // 13. PAYMENT EXECUTION LOGIC (COD, Chapa, Manual Direct Transfer)
  // ==========================================================================
  async function handlePaymentExecution() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const itemsSummary = state.cart.map(item => `${getLocString(item.name, 'en')} (Qty: ${item.qty})`).join(', ');
    const formattedPhone = `+251${state.customerData.phone}`;

    dom.btnFinalizePayment.disabled = true;
    dom.btnFinalizePayment.classList.add('loading');

    // 1. CASH ON DELIVERY
    if (state.selectedPaymentOption === 'cod') {
      try {
        const res = await fetch('/api/orders/cod', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: state.customerData.name,
            phone: formattedPhone,
            location: state.customerData.landmark,
            address: state.customerData.address,
            total: subtotal,
            itemsSummary: itemsSummary
          })
        });

        const data = await res.json();
        if (data.success && data.order) {
          showOrderSuccess(data.order);
        } else {
          throw new Error(data.error || 'Failed to place COD order');
        }
      } catch (err) {
        console.warn('[ORDER NOTICE] Local fallback order generated:', err.message);
        const fallbackOrder = {
          id: 'HOM-AD-' + Math.floor(1000 + Math.random() * 9000),
          customer: state.customerData.name,
          phone: formattedPhone,
          location: state.customerData.landmark,
          method: 'COD',
          total: subtotal,
          itemsSummary: itemsSummary,
          status: 'Pending - Cash on Delivery'
        };
        showOrderSuccess(fallbackOrder);
      } finally {
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.classList.remove('loading');
      }
      return;
    }

    // 2. MANUAL DIRECT TRANSFER (CBE / Telebirr)
    if (state.selectedPaymentOption === 'manual') {
      try {
        const res = await fetch('/api/orders/manual', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer: state.customerData.name,
            phone: formattedPhone,
            location: state.customerData.landmark,
            address: state.customerData.address,
            method: state.selectedManualSubMethod || 'Manual CBE',
            total: subtotal,
            itemsSummary: itemsSummary
          })
        });

        const data = await res.json();
        if (data.success && data.order) {
          showOrderSuccess(data.order);
        } else {
          throw new Error(data.error || 'Failed to place manual transfer order');
        }
      } catch (err) {
        console.warn('[ORDER NOTICE] Local fallback manual order generated:', err.message);
        const fallbackOrder = {
          id: 'HOM-MN-' + Math.floor(1000 + Math.random() * 9000),
          customer: state.customerData.name,
          phone: formattedPhone,
          location: state.customerData.landmark,
          method: state.selectedManualSubMethod || 'Manual CBE',
          total: subtotal,
          itemsSummary: itemsSummary,
          status: 'Pending - Manual Transfer Verification'
        };
        showOrderSuccess(fallbackOrder);
      } finally {
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.classList.remove('loading');
      }
      return;
    }

    // 3. AUTOMATED CHAPA PAYMENT
    if (state.selectedPaymentOption === 'chapa') {
      try {
        const txRef = 'HOM-tx-' + Date.now();
        const res = await fetch('/api/chapa/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: subtotal,
            currency: "ETB",
            first_name: state.customerData.name,
            phone_number: formattedPhone,
            location: state.customerData.landmark,
            address: state.customerData.address,
            tx_ref: txRef,
            itemsSummary: itemsSummary
          })
        });

        const data = await res.json();

        if (data.status === 'success' && data.checkout_url) {
          showToast('Connecting directly to official Chapa Gateway...', '🔒');
          if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === 'function') {
            window.Telegram.WebApp.openLink(data.checkout_url);
          } else {
            window.location.href = data.checkout_url;
          }
        } else {
          showToast(data.message || 'Chapa payment gateway initialization failed. Please try again or select Cash on Delivery.', '⚠️');
        }
      } catch (err) {
        console.error('[CHAPA INITIALIZE ERROR]', err);
        showToast('Network error connecting to Chapa payment server. Please try again.', '⚠️');
      } finally {
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.classList.remove('loading');
      }
      return;
    }
  }

  function showOrderSuccess(order) {
    closeCheckout();
    state.cart = [];
    localStorage.removeItem('hom_cart');
    renderCart();

    if (dom.successOrderRefNumber) dom.successOrderRefNumber.textContent = order.id;
    if (dom.successCustomerVal) dom.successCustomerVal.textContent = order.customer;
    if (dom.successPhoneVal) dom.successPhoneVal.textContent = order.phone;
    if (dom.successLocationVal) {
      dom.successLocationVal.textContent = `${order.location}${order.address ? ', ' + order.address : ''}`;
    }
    if (dom.successPaymentVal) dom.successPaymentVal.textContent = order.status || order.method;
    if (dom.successAmountVal) dom.successAmountVal.textContent = formatETB(order.total);

    openElement(dom.successBackdrop);
  }

  // ==========================================================================
  // 13B. CHAPA AUTHENTIC HOSTED MODAL & SECURE REDIRECT
  // ==========================================================================
  function openChapaHostedModal(amount, txRef) {
    state.activeChapaTxRef = txRef;
    state.activeChapaAmount = amount;
    state.chapaSelectedMethod = 'telebirr';

    if (dom.chapaModalAmount) dom.chapaModalAmount.textContent = Number(amount).toLocaleString() + '.00';
    if (dom.chapaBtnPayAmount) dom.chapaBtnPayAmount.textContent = formatETB(amount);
    if (dom.chapaModalTxRef) dom.chapaModalTxRef.textContent = txRef;

    // Pre-fill phone if available from customer info
    if (dom.chapaTelebirrPhone && state.customerData.phone) {
      dom.chapaTelebirrPhone.value = state.customerData.phone;
    }
    if (dom.chapaTelebirrPin) dom.chapaTelebirrPin.value = '';
    if (dom.chapaCbePin) dom.chapaCbePin.value = '';
    if (dom.chapaProcessingStatus) dom.chapaProcessingStatus.style.display = 'none';

    setChapaMethod('telebirr');
    closeCheckout();
    openElement(dom.chapaModalBackdrop);
  }

  function closeChapaHostedModal() {
    closeElement(dom.chapaModalBackdrop);
  }

  function setChapaMethod(method) {
    state.chapaSelectedMethod = method;
    [dom.chapaTabTelebirr, dom.chapaTabCbe, dom.chapaTabCard].forEach(tab => {
      if (tab) tab.classList.remove('active');
    });

    if (dom.chapaFormTelebirr) dom.chapaFormTelebirr.style.display = method === 'telebirr' ? 'block' : 'none';
    if (dom.chapaFormCbe) dom.chapaFormCbe.style.display = method === 'cbe' ? 'block' : 'none';
    if (dom.chapaFormCard) dom.chapaFormCard.style.display = method === 'card' ? 'block' : 'none';

    if (method === 'telebirr' && dom.chapaTabTelebirr) dom.chapaTabTelebirr.classList.add('active');
    if (method === 'cbe' && dom.chapaTabCbe) dom.chapaTabCbe.classList.add('active');
    if (method === 'card' && dom.chapaTabCard) dom.chapaTabCard.classList.add('active');
  }

  function initChapaModal() {
    if (dom.closeChapaModalBtn) {
      dom.closeChapaModalBtn.addEventListener('click', closeChapaHostedModal);
    }
    if (dom.chapaModalBackdrop) {
      dom.chapaModalBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.chapaModalBackdrop) closeChapaHostedModal();
      });
    }

    if (dom.chapaTabTelebirr) dom.chapaTabTelebirr.addEventListener('click', () => setChapaMethod('telebirr'));
    if (dom.chapaTabCbe) dom.chapaTabCbe.addEventListener('click', () => setChapaMethod('cbe'));
    if (dom.chapaTabCard) dom.chapaTabCard.addEventListener('click', () => setChapaMethod('card'));

    // Toggle PIN Visibilities
    if (dom.toggleTelebirrPin && dom.chapaTelebirrPin) {
      dom.toggleTelebirrPin.addEventListener('click', () => {
        const isPass = dom.chapaTelebirrPin.type === 'password';
        dom.chapaTelebirrPin.type = isPass ? 'text' : 'password';
        dom.toggleTelebirrPin.textContent = isPass ? '🙈' : '👁️';
      });
    }
    if (dom.toggleCbePin && dom.chapaCbePin) {
      dom.toggleCbePin.addEventListener('click', () => {
        const isPass = dom.chapaCbePin.type === 'password';
        dom.chapaCbePin.type = isPass ? 'text' : 'password';
        dom.toggleCbePin.textContent = isPass ? '🙈' : '👁️';
      });
    }

    // Authorize & Pay Button -> Connects directly to Chapa Hosted Checkout
    if (dom.btnChapaAuthorizePay) {
      dom.btnChapaAuthorizePay.addEventListener('click', async () => {
        dom.btnChapaAuthorizePay.disabled = true;
        if (dom.chapaProcessingStatus) {
          dom.chapaProcessingStatus.style.display = 'flex';
          if (dom.chapaStatusMsg) dom.chapaStatusMsg.textContent = 'Connecting to official Chapa gateway...';
        }

        try {
          const res = await fetch('/api/chapa/initialize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: state.activeChapaAmount || 100,
              currency: "ETB",
              first_name: state.customerData.name || 'Valued Customer',
              phone_number: state.customerData.phone || '',
              location: state.customerData.landmark || 'Adama',
              address: state.customerData.address || '',
              tx_ref: state.activeChapaTxRef || ('HOM-tx-' + Date.now()),
              itemsSummary: 'Husen Online Order'
            })
          });

          const data = await res.json();
          closeChapaHostedModal();

          if (data.status === 'success' && data.checkout_url) {
            showToast('Opening Chapa Payment Screen...', '🔒');
            if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.openLink === 'function') {
              window.Telegram.WebApp.openLink(data.checkout_url);
            } else {
              window.location.href = data.checkout_url;
            }
          } else {
            showToast(data.message || 'Could not connect to Chapa payment gateway. Please try again.', '⚠️');
          }
        } catch (err) {
          console.error('[CHAPA VERIFY ERROR]', err);
          closeChapaHostedModal();
          showToast('Network error connecting to Chapa. Please try again.', '⚠️');
        } finally {
          dom.btnChapaAuthorizePay.disabled = false;
          if (dom.chapaProcessingStatus) dom.chapaProcessingStatus.style.display = 'none';
        }
      });
    }
  }

  // Check URL params for Chapa return success
  function checkUrlPaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const txRef = urlParams.get('tx_ref');
    const isPaymentCallback = urlParams.get('payment') === 'success' || urlParams.get('status') === 'success' || window.location.pathname.includes('payment-success');

    if (txRef && isPaymentCallback) {
      showToast('Verifying payment with Chapa...', '⏳');
      fetch(`/api/chapa/verify/${txRef}`)
        .then(r => r.json())
        .then(data => {
          if (data && data.order && data.order.status && data.order.status.includes('Paid')) {
            showOrderSuccess(data.order);
            showToast('Chapa Payment Confirmed! SMS Dispatched. ✓');
          } else {
            showToast('Chapa payment was not completed or pending.', '⚠️');
          }
        })
        .catch(err => {
          console.error('[CHAPA VERIFY ERROR]', err);
        });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // ==========================================================================
  // 13C. CLOUDINARY DEVICE PHOTO UPLOADER & ERROR RESILIENCE HELPERS
  // ==========================================================================

  // Safe save button state restorer (never leaves button stuck or disabled)
  function restoreSaveProductButtonState() {
    if (!dom.saveProductBtn) return;
    if (state.isUploadingPhotos) {
      dom.saveProductBtn.disabled = true;
      if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = 'Uploading photos...';
    } else if (state.failedUploads && state.failedUploads.length > 0) {
      if (state.editorPhotos && state.editorPhotos.length > 0) {
        dom.saveProductBtn.disabled = false;
        if (dom.saveProductBtnText) {
          dom.saveProductBtnText.textContent = (dom.editProductId && dom.editProductId.value) ? 'Save (Skip Failed)' : 'Publish (Skip Failed)';
        }
      } else {
        dom.saveProductBtn.disabled = true;
        if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = 'Add at least 1 photo';
      }
    } else {
      dom.saveProductBtn.disabled = false;
      if (dom.saveProductBtnText) {
        dom.saveProductBtnText.textContent = (dom.editProductId && dom.editProductId.value) ? 'Save Changes' : 'Publish Product';
      }
    }
  }

  // Memory-safe client image compressor (handles 12-50MP phone camera photos without heap overflow)
  async function compressImageForUpload(file, maxDimension = 1600, quality = 0.8) {
    if (!file) throw new Error('No file provided');
    if (!file.type || !file.type.startsWith('image/')) {
      throw new Error(`"${file.name || 'File'}" is not a valid image. Only JPG, PNG, WebP are supported.`);
    }

    // Skip compression if already under 800KB
    if (file.size && file.size < 800 * 1024) {
      return { blob: file, name: file.name, isOriginal: true };
    }

    // Attempt Method 1: Off-thread createImageBitmap (zero base64 allocation, fastest on modern mobile)
    if (typeof window.createImageBitmap === 'function') {
      try {
        const bmp = await createImageBitmap(file);
        let width = bmp.width;
        let height = bmp.height;

        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(bmp, 0, 0, width, height);
          if (typeof bmp.close === 'function') bmp.close();
          const blob = await new Promise((res) => canvas.toBlob(res, 'image/jpeg', quality));
          if (blob && blob.size > 0) {
            return { blob, name: file.name };
          }
        }
      } catch (bmpErr) {
        console.warn('[COMPRESS] createImageBitmap failed, trying ObjectURL fallback:', bmpErr);
      }
    }

    // Attempt Method 2: URL.createObjectURL (direct blob pointer, avoids huge string in memory)
    if (typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
      try {
        const blobResult = await new Promise((resolve) => {
          const blobUrl = URL.createObjectURL(file);
          const img = new Image();
          img.onload = () => {
            try {
              let width = img.naturalWidth || img.width;
              let height = img.naturalHeight || img.height;
              URL.revokeObjectURL(blobUrl);

              if (width > maxDimension || height > maxDimension) {
                if (width >= height) {
                  height = Math.round((height * maxDimension) / width);
                  width = maxDimension;
                } else {
                  width = Math.round((width * maxDimension) / height);
                  height = maxDimension;
                }
              }

              const canvas = document.createElement('canvas');
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              if (!ctx) return resolve(null);
              ctx.drawImage(img, 0, 0, width, height);
              canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
            } catch (canvasErr) {
              resolve(null);
            }
          };
          img.onerror = () => {
            URL.revokeObjectURL(blobUrl);
            resolve(null);
          };
          img.src = blobUrl;
        });

        if (blobResult && blobResult.size > 0) {
          return { blob: blobResult, name: file.name };
        }
      } catch (objErr) {
        console.warn('[COMPRESS] ObjectURL compression failed:', objErr);
      }
    }

    // Root safety fallback: return original file intact so Cloudinary upload never fails on reading
    return { blob: file, name: file.name, isOriginal: true };
  }

  // Upload single photo with progress tracking and transparent fallback to raw file
  function uploadSinglePhoto(file, onProgress) {
    return new Promise(async (resolve, reject) => {
      try {
        let blobToUpload = file;
        try {
          const compResult = await compressImageForUpload(file, 1600, 0.8);
          if (compResult && compResult.blob) {
            blobToUpload = compResult.blob;
          }
        } catch (compErr) {
          console.warn('[UPLOAD] Compression skipped, uploading raw file to Cloudinary:', compErr);
          blobToUpload = file;
        }

        const cloud = String(state.cloudName || 'trkihe9m').trim();
        const preset = String(state.uploadPreset || 'Husenonlinemarketing').trim();
        const formData = new FormData();
        const sanitizedName = (file.name || 'image').replace(/\.[^/.]+$/, "") + ".jpg";
        formData.append('file', blobToUpload, sanitizedName);
        formData.append('upload_preset', preset);

        const endpoint = `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);

        xhr.upload.onprogress = (evt) => {
          if (evt.lengthComputable && onProgress) {
            const pct = Math.round((evt.loaded / evt.total) * 100);
            onProgress(pct);
          }
        };

        xhr.onload = () => {
          let parsed = null;
          try {
            parsed = JSON.parse(xhr.responseText);
          } catch (e) {
            parsed = null;
          }

          if (xhr.status >= 200 && xhr.status < 300 && parsed && parsed.secure_url) {
            resolve({
              secure_url: parsed.secure_url,
              public_id: parsed.public_id || ''
            });
          } else {
            console.error(`[CLOUDINARY UPLOAD ERROR] HTTP ${xhr.status}:`, xhr.responseText);
            const errMsg = (parsed && parsed.error && parsed.error.message)
              ? parsed.error.message
              : `Upload rejected (Status ${xhr.status}): ${xhr.statusText || 'Unknown error'}`;
            reject(new Error(errMsg));
          }
        };

        xhr.onerror = () => {
          console.error('[CLOUDINARY NETWORK ERROR]');
          reject(new Error('Network error connecting to Cloudinary. Check internet connection.'));
        };

        xhr.ontimeout = () => {
          console.error('[CLOUDINARY TIMEOUT ERROR]');
          reject(new Error('Upload timed out after 45 seconds.'));
        };

        xhr.timeout = 45000;
        xhr.send(formData);
      } catch (err) {
        reject(err);
      }
    });
  }

  function showUploadErrorBanner(msg, fileToRetry = null) {
    if (!dom.uploadErrorBanner) return;
    dom.uploadErrorBanner.style.display = 'flex';
    dom.uploadErrorBanner.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; flex:1; min-width:0;">
        <span style="font-size:1.1rem; flex-shrink:0;">⚠️</span>
        <span style="font-size:0.82rem; line-height:1.3; overflow:hidden; text-overflow:ellipsis;">
          <strong>Cloudinary Upload:</strong> ${msg}
        </span>
      </div>
      <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
        ${fileToRetry ? `<button type="button" class="btn-retry-upload" id="btnRetryFailedPhoto">Retry</button>` : ''}
        <button type="button" class="btn-dismiss-upload-error" id="btnDismissUploadError" title="Dismiss error" aria-label="Dismiss">✕</button>
      </div>
    `;

    const retryBtn = dom.uploadErrorBanner.querySelector('#btnRetryFailedPhoto');
    if (retryBtn && fileToRetry) {
      retryBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await retryFailedPhoto(fileToRetry);
      });
    }

    const dismissBtn = dom.uploadErrorBanner.querySelector('#btnDismissUploadError');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        state.failedUploads = [];
        hideUploadErrorBanner();
        restoreSaveProductButtonState();
        showToast('Upload error dismissed', 'ℹ️');
      });
    }
  }

  function hideUploadErrorBanner() {
    if (dom.uploadErrorBanner) dom.uploadErrorBanner.style.display = 'none';
  }

  function updateProgressUI(activeUploads) {
    if (!dom.uploadProgressList) return;
    if (!activeUploads || activeUploads.length === 0) {
      dom.uploadProgressList.style.display = 'none';
      dom.uploadProgressList.innerHTML = '';
      return;
    }
    dom.uploadProgressList.style.display = 'flex';
    dom.uploadProgressList.innerHTML = activeUploads.map(item => `
      <div class="upload-progress-item">
        <div style="display:flex; justify-content:space-between;">
          <span>${item.name}</span>
          <span>${item.pct}%</span>
        </div>
        <div class="progress-bar-wrap">
          <div class="progress-bar-fill" style="width: ${item.pct}%;"></div>
        </div>
      </div>
    `).join('');
  }

  async function retryFailedPhoto(failedItem) {
    state.isUploadingPhotos = true;
    if (dom.saveProductBtn) dom.saveProductBtn.disabled = true;
    if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = `Retrying upload for ${failedItem.name}...`;
    hideUploadErrorBanner();

    const activeUploads = [{ name: failedItem.name, pct: 10 }];
    updateProgressUI(activeUploads);

    try {
      const result = await uploadSinglePhoto(failedItem.file, (pct) => {
        activeUploads[0].pct = pct;
        updateProgressUI(activeUploads);
      });

      state.editorPhotos.push({
        secure_url: result.secure_url,
        public_id: result.public_id
      });
      state.failedUploads = state.failedUploads.filter(f => f !== failedItem);
      renderEditorThumbnails();
      showToast(`"${failedItem.name}" uploaded successfully! ✓`);
      hideUploadErrorBanner();
    } catch (err) {
      showUploadErrorBanner(err.message, failedItem);
      showToast(`Retry failed: ${err.message}`, '⚠️');
    } finally {
      updateProgressUI([]);
      state.isUploadingPhotos = false;
      restoreSaveProductButtonState();
    }
  }




  // ==========================================================================
  // 14. ADMIN PORTAL (Product CRUD, Device Multi-Photo & Payment Settings)
  // ==========================================================================
  function initAdminPortal() {
    if (dom.openAdminBtn) {
      dom.openAdminBtn.addEventListener('click', () => {
        if (dom.installBanner) dom.installBanner.style.display = 'none';
        openElement(dom.adminBackdrop);
      });
    }

    if (dom.closeAdminBtn) {
      dom.closeAdminBtn.addEventListener('click', () => {
        closeElement(dom.adminBackdrop);
      });
    }

    if (dom.adminBackdrop) {
      dom.adminBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.adminBackdrop) closeElement(dom.adminBackdrop);
      });
    }

    // Check Persistent Admin Login State (Stay Logged In)
    // Default owner admin password reference: husenonlinemarketing1234
    const isAuthed = (localStorage.getItem('hom_admin_logged_in') === 'true' || localStorage.getItem('husen_admin_auth') === 'true');
    const savedUserStr = localStorage.getItem('hom_admin_user');
    if (isAuthed) {
      state.adminUnlocked = true;
      try {
        state.currentUser = savedUserStr ? JSON.parse(savedUserStr) : { username: 'owner', role: 'owner', name: 'Store Owner' };
      } catch (e) {
        state.currentUser = { username: 'owner', role: 'owner', name: 'Store Owner' };
      }
      if (dom.adminAuthView) dom.adminAuthView.style.display = 'none';
      if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'block';
      if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'inline-flex';
      if (dom.adminRefreshBtn) dom.adminRefreshBtn.style.display = 'inline-flex';
      if (dom.linkToAdminApp) dom.linkToAdminApp.style.display = 'inline-flex';
      if (dom.adminCurrentUsername) dom.adminCurrentUsername.textContent = state.currentUser.username;
      if (dom.adminCurrentRole) dom.adminCurrentRole.textContent = state.currentUser.role === 'owner' ? 'Owner (ሁሴን)' : 'Staff Member';
      if (dom.ownerStaffResetSection) {
        dom.ownerStaffResetSection.style.display = state.currentUser.role === 'owner' ? 'block' : 'none';
      }
      renderAdminProducts();
      fetchAdminOrders();
      updateAccountDisplays();
    }

    // Admin Authentication Login Handler (Server Verified with Hashed Passwords)
    async function performAdminLogin() {
      const username = dom.adminAccountSelect ? dom.adminAccountSelect.value : 'owner';
      const password = dom.adminPinInput ? dom.adminPinInput.value.trim() : '';
      if (!password) {
        showToast('Please enter your password', '⚠️');
        return;
      }

      showToast('Verifying credentials on server...', '⏳');
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          state.adminUnlocked = true;
          state.currentUser = data.user;
          localStorage.setItem('hom_admin_logged_in', 'true');
          localStorage.setItem('hom_admin_user', JSON.stringify(data.user));
          localStorage.setItem('husen_admin_auth', 'true');

          if (dom.adminAuthView) dom.adminAuthView.style.display = 'none';
          if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'block';
          if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'inline-flex';
          if (dom.adminRefreshBtn) dom.adminRefreshBtn.style.display = 'inline-flex';
          if (dom.linkToAdminApp) dom.linkToAdminApp.style.display = 'inline-flex';
          if (dom.adminPinInput) dom.adminPinInput.value = '';

          if (dom.adminCurrentUsername) dom.adminCurrentUsername.textContent = data.user.username;
          if (dom.adminCurrentRole) dom.adminCurrentRole.textContent = data.user.role === 'owner' ? 'Owner (ሁሴን)' : 'Staff Member';
          if (dom.ownerStaffResetSection) {
            dom.ownerStaffResetSection.style.display = data.user.role === 'owner' ? 'block' : 'none';
          }

          renderAdminProducts();
          fetchAdminOrders();
          updateAccountDisplays();
          showToast(`Welcome, ${data.user.name || data.user.username}! Admin Portal unlocked.`, '🔓');
        } else {
          showToast(data.error || 'Incorrect username or password. Please try again.', '⚠️');
        }
      } catch (err) {
        showToast('Login network error: ' + err.message, '⚠️');
      }
    }

    if (dom.adminLoginBtn) {
      dom.adminLoginBtn.addEventListener('click', performAdminLogin);
    }
    if (dom.adminPinInput) {
      dom.adminPinInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performAdminLogin();
        }
      });
    }

    // Admin Refresh Data Button
    if (dom.adminRefreshBtn) {
      dom.adminRefreshBtn.addEventListener('click', async () => {
        dom.adminRefreshBtn.disabled = true;
        showToast('Refreshing inventory and orders...', '🔄');
        await Promise.all([
          syncProductsFromBackend(true),
          syncSettingsFromBackend(),
          fetchAdminOrders()
        ]);
        renderAdminProducts();
        dom.adminRefreshBtn.disabled = false;
        showToast('Data synced from cloud! ✓');
      });
    }

    // Admin Logout Function
    function logoutAdmin(msg = 'Logged out of Admin Portal') {
      removeStorage('local', 'husen_admin_auth');
      removeStorage('local', 'hom_admin_logged_in');
      try {
        localStorage.removeItem('husen_admin_auth');
        localStorage.removeItem('hom_admin_logged_in');
        localStorage.removeItem('hom_admin_user');
      } catch (e) {}
      state.adminUnlocked = false;
      state.currentUser = null;
      if (dom.adminAuthView) dom.adminAuthView.style.display = 'block';
      if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'none';
      if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'none';
      if (dom.adminRefreshBtn) dom.adminRefreshBtn.style.display = 'none';
      if (dom.linkToAdminApp) dom.linkToAdminApp.style.display = 'none';
      if (dom.adminPinInput) dom.adminPinInput.value = '';
      showToast(msg);
    }

    if (dom.adminLogoutBtn) {
      dom.adminLogoutBtn.addEventListener('click', () => logoutAdmin());
    }

    // Admin Tabs (Products, Orders, Activity Log, Payment Accounts, Change Password)
    const tabs = [
      { btn: dom.adminTabProducts, pane: dom.adminPaneProducts },
      { btn: dom.adminTabOrders, pane: dom.adminPaneOrders },
      { btn: dom.adminTabActivity, pane: dom.adminPaneActivity, onShow: () => fetchAndRenderActivityLogs() },
      { btn: dom.adminTabSettings, pane: dom.adminPaneSettings },
      { btn: dom.adminTabPassword, pane: dom.adminPanePassword }
    ];

    tabs.forEach(({ btn, pane, onShow }) => {
      if (btn && pane) {
        btn.addEventListener('click', () => {
          tabs.forEach(t => {
            if (t.btn) t.btn.classList.remove('active');
            if (t.pane) t.pane.style.display = 'none';
          });
          btn.classList.add('active');
          pane.style.display = 'block';
          if (typeof onShow === 'function') onShow();
        });
      }
    });

    if (dom.btnRefreshActivityLog) {
      dom.btnRefreshActivityLog.addEventListener('click', () => fetchAndRenderActivityLogs());
    }

    if (dom.btnExportProductsCsv) {
      dom.btnExportProductsCsv.addEventListener('click', () => triggerExport('csv'));
    }

    if (dom.btnExportProductsJson) {
      dom.btnExportProductsJson.addEventListener('click', () => triggerExport('json'));
    }

    // Password Show/Hide Toggles
    document.querySelectorAll('.btn-toggle-password').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        const input = targetId ? document.getElementById(targetId) : btn.previousElementSibling;
        if (!input) return;
        if (input.type === 'password') {
          input.type = 'text';
          btn.textContent = '🙈';
        } else {
          input.type = 'password';
          btn.textContent = '👁️';
        }
      });
    });

    // Change Password Form Submission
    if (dom.changePasswordForm) {
      dom.changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = dom.currentPasswordInput ? dom.currentPasswordInput.value.trim() : '';
        const newPassword = dom.newPasswordInput ? dom.newPasswordInput.value.trim() : '';
        const confirmPassword = dom.confirmPasswordInput ? dom.confirmPasswordInput.value.trim() : '';

        if (!currentPassword) {
          showToast('Please enter your current password', '⚠️');
          if (dom.currentPasswordInput) dom.currentPasswordInput.focus();
          return;
        }
        if (newPassword.length < 8) {
          showToast('New password must be at least 8 characters long', '⚠️');
          if (dom.newPasswordInput) dom.newPasswordInput.focus();
          return;
        }
        if (newPassword !== confirmPassword) {
          showToast('New password and confirmation do not match', '⚠️');
          if (dom.confirmPasswordInput) dom.confirmPasswordInput.focus();
          return;
        }
        if (newPassword === currentPassword) {
          showToast('New password must differ from current password', '⚠️');
          if (dom.newPasswordInput) dom.newPasswordInput.focus();
          return;
        }

        const username = state.currentUser ? state.currentUser.username : 'owner';
        showToast('Verifying and updating password on server...', '⏳');

        try {
          const res = await fetch('/api/admin/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username,
              currentPassword,
              newPassword,
              confirmPassword
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast('Password changed successfully! Please log in with your new password.', '✓');
            dom.changePasswordForm.reset();
            setTimeout(() => {
              logoutAdmin('Please log in with your new password.');
            }, 1200);
          } else {
            showToast(data.error || 'Failed to update password. Please check your current password.', '⚠️');
          }
        } catch (err) {
          showToast('Error updating password: ' + err.message, '⚠️');
        }
      });
    }

    // Owner Reset Staff Password Form Submission
    if (dom.ownerStaffResetForm) {
      dom.ownerStaffResetForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const staffUsername = dom.resetStaffSelect ? dom.resetStaffSelect.value : 'staff';
        const ownerPassword = dom.ownerAuthPasswordInput ? dom.ownerAuthPasswordInput.value.trim() : '';
        const newPassword = dom.newStaffPasswordInput ? dom.newStaffPasswordInput.value.trim() : '';
        const confirmPassword = dom.confirmStaffPasswordInput ? dom.confirmStaffPasswordInput.value.trim() : '';

        if (!ownerPassword) {
          showToast('Please enter your owner password to authorize staff reset', '⚠️');
          if (dom.ownerAuthPasswordInput) dom.ownerAuthPasswordInput.focus();
          return;
        }
        if (newPassword.length < 8) {
          showToast('New staff password must be at least 8 characters long', '⚠️');
          if (dom.newStaffPasswordInput) dom.newStaffPasswordInput.focus();
          return;
        }
        if (newPassword !== confirmPassword) {
          showToast('Password confirmation does not match', '⚠️');
          if (dom.confirmStaffPasswordInput) dom.confirmStaffPasswordInput.focus();
          return;
        }

        showToast(`Resetting password for "${staffUsername}"...`, '⏳');
        try {
          const res = await fetch('/api/admin/reset-staff-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ownerUsername: state.currentUser ? state.currentUser.username : 'owner',
              ownerPassword,
              staffUsername,
              newPassword,
              confirmPassword
            })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            showToast(data.message || `Password for ${staffUsername} was reset successfully! ✓`);
            dom.ownerStaffResetForm.reset();
          } else {
            showToast(data.error || 'Failed to reset staff password. Check your owner password.', '⚠️');
          }
        } catch (err) {
          showToast('Error resetting staff password: ' + err.message, '⚠️');
        }
      });
    }

    // Save Payment Settings form
    if (dom.paymentSettingsForm) {
      dom.paymentSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newSettings = {
          cbeAccount: (dom.settingCbeAccount ? dom.settingCbeAccount.value : '').trim(),
          cbeAccountName: (dom.settingCbeName ? dom.settingCbeName.value : '').trim(),
          telebirrPhone: (dom.settingTelebirrPhone ? dom.settingTelebirrPhone.value : '').trim(),
          telebirrAccountName: (dom.settingTelebirrName ? dom.settingTelebirrName.value : '').trim(),
          chapaSecretKey: (dom.settingChapaKey ? dom.settingChapaKey.value : '').trim()
        };

        state.settings = { ...state.settings, ...newSettings };
        updateAccountDisplays();

        try {
          await fetch('/api/settings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newSettings)
          });
        } catch (err) {
          console.warn('[SETTINGS NOTICE] Saved locally:', err.message);
        }

        showToast('Payment settings and Chapa key saved successfully!');
      });
    }

    // Toggle Category Translations in Editor
    if (dom.btnToggleCatTrans && dom.catTranslationsCard) {
      dom.btnToggleCatTrans.addEventListener('click', () => {
        const isHidden = dom.catTranslationsCard.style.display === 'none';
        dom.catTranslationsCard.style.display = isHidden ? 'block' : 'none';
        dom.btnToggleCatTrans.textContent = isHidden ? '− Hide Category Translations' : '+ Add Category Translations (Optional)';
      });
    }

    // Admin Add New Product Button
    if (dom.openAddProductModalBtn) {
      dom.openAddProductModalBtn.addEventListener('click', () => {
        openProductEditor(null);
      });
    }

    // Admin Photo Uploader with Multi-file Selection, Parallel Upload & Retry
    if (dom.btnDeviceUpload && dom.editorFileInput) {
      dom.btnDeviceUpload.addEventListener('click', () => {
        dom.editorFileInput.click();
      });

      dom.editorFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate formats
        const validFiles = [];
        for (const file of files) {
          if (!file.type.startsWith('image/')) {
            showToast(`"${file.name}" is not a valid image file.`, '⚠️');
            showUploadErrorBanner(`"${file.name}" is not a supported image format. Please select JPG, PNG, or WebP.`);
            continue;
          }
          validFiles.push(file);
        }

        if (validFiles.length === 0) {
          dom.editorFileInput.value = '';
          return;
        }

        state.isUploadingPhotos = true;
        state.failedUploads = [];
        hideUploadErrorBanner();
        if (dom.saveProductBtn) dom.saveProductBtn.disabled = true;
        if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = `Uploading photos (0/${validFiles.length})...`;
        showToast(`Compressing & uploading ${validFiles.length} photo(s) in parallel...`, '⏳');

        const activeUploads = validFiles.map((f, idx) => ({ id: idx, name: f.name, pct: 0 }));
        updateProgressUI(activeUploads);

        let completedCount = 0;
        const uploadTasks = validFiles.map((file, idx) => {
          return uploadSinglePhoto(file, (pct) => {
            activeUploads[idx].pct = pct;
            updateProgressUI(activeUploads);
          }).then(result => {
            completedCount++;
            if (dom.saveProductBtnText) {
              dom.saveProductBtnText.textContent = `Uploading photos (${completedCount}/${validFiles.length})...`;
            }
            state.editorPhotos.push({
              secure_url: result.secure_url,
              public_id: result.public_id
            });
            renderEditorThumbnails();
          }).catch(err => {
            const failedItem = { file, name: file.name, error: err.message };
            state.failedUploads.push(failedItem);
            showUploadErrorBanner(err.message, failedItem);
          });
        });

        await Promise.allSettled(uploadTasks);

        updateProgressUI([]);
        state.isUploadingPhotos = false;
        dom.editorFileInput.value = '';
        restoreSaveProductButtonState();

        if (state.failedUploads.length > 0) {
          showToast(`Upload failed for ${state.failedUploads.length} photo(s). Click Retry or Dismiss (✕) to continue.`, '⚠️');
        } else {
          showToast('All photos uploaded successfully to Cloudinary! ✓');
        }
      });
    }

    // Admin product live search input
    if (dom.adminProdSearchInput) {
      dom.adminProdSearchInput.addEventListener('input', (e) => {
        state.adminProdSearch = e.target.value;
        renderAdminProducts();
      });
    }

    // Admin stock filter chips
    document.querySelectorAll('.admin-filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.admin-filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.adminStockFilter = chip.getAttribute('data-stock-filter') || 'all';
        renderAdminProducts();
      });
    });

    // Admin Test SMS Alert button
    if (dom.btnTestSms) {
      dom.btnTestSms.addEventListener('click', async () => {
        dom.btnTestSms.disabled = true;
        showToast('Testing SMS alert to 0907173634...', '📱');
        try {
          const res = await fetch('/api/admin/test-sms', { method: 'POST' });
          const data = await res.json();
          if (data.success) {
            showToast('Test SMS delivered successfully to 0907173634! ✓');
          } else {
            showToast(`SMS Gateway Response (${data.statusCode || 401}): See server logs`, 'ℹ️');
          }
        } catch (err) {
          showToast('Network notice testing SMS: ' + err.message, '⚠️');
        } finally {
          dom.btnTestSms.disabled = false;
        }
      });
    }

    // Quick Preset Photos
    document.querySelectorAll('.btn-preset-img').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        if (preset) {
          state.editorPhotos.push({
            secure_url: preset,
            public_id: ''
          });
          renderEditorThumbnails();
        }
      });
    });

    // Editor Form Submit (Create or Update Product)
    if (dom.productEditorForm) {
      dom.productEditorForm.addEventListener('submit', handleSaveProduct);
    }

    if (dom.closeEditorBtn) dom.closeEditorBtn.addEventListener('click', closeProductEditor);
    if (dom.cancelEditorBtn) dom.cancelEditorBtn.addEventListener('click', closeProductEditor);
    if (dom.productEditorBackdrop) {
      dom.productEditorBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.productEditorBackdrop) closeProductEditor();
      });
    }

    // Delegated Event Handlers for Product List (Whole Card Clickable to Edit)
    // Ensures clicking any card or edit button works 100% reliably even during polling re-renders
    if (dom.adminProductList) {
      dom.adminProductList.addEventListener('click', async (e) => {
        // 1. Delete button
        const delBtn = e.target.closest('.btn-del-prod');
        if (delBtn) {
          e.stopPropagation();
          const id = delBtn.getAttribute('data-id');
          const prod = state.products.find(p => String(p.id) === String(id));
          if (!prod) return;
          if (confirm(`Are you sure you want to delete "${getLocString(prod.name, state.lang)}"?`)) {
            showToast('Deleting product from cloud...', '⏳');
            try {
              const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
              const data = await res.json();
              if (data.success && Array.isArray(data.products)) {
                state.products = data.products;
                state.lastUpdatedAt = data.updatedAt || Date.now();
              } else {
                state.products = state.products.filter(p => String(p.id) !== String(id));
              }
              try { localStorage.setItem('hom_products', JSON.stringify(state.products)); } catch (e) {}
              broadcastProductSync(state.products, state.lastUpdatedAt);
              renderCategories();
              renderProducts();
              renderAdminProducts();
              showToast('Product permanently deleted! ✓');
            } catch (err) {
              state.products = state.products.filter(p => String(p.id) !== String(id));
              try { localStorage.setItem('hom_products', JSON.stringify(state.products)); } catch (e) {}
              broadcastProductSync(state.products);
              renderCategories();
              renderProducts();
              renderAdminProducts();
              showToast('Product removed locally', 'ℹ️');
            }
          }
          return;
        }

        // 2. Ignore clicks on the stock toggle switch or its children
        if (e.target.closest('.switch') || e.target.closest('.stock-toggle') || e.target.closest('.slider')) {
          return;
        }

        // 3. Edit product: Clicking "✏️ Edit" button OR clicking anywhere on the product card
        const editBtn = e.target.closest('.btn-edit-prod');
        const card = e.target.closest('.admin-prod-card');
        const prodId = editBtn ? editBtn.getAttribute('data-id') : (card ? card.getAttribute('data-id') : null);
        if (prodId) {
          e.stopPropagation();
          const prod = state.products.find(p => String(p.id) === String(prodId));
          if (prod) {
            openProductEditor(prod);
          }
        }
      });

      // Stock toggle switch change listener (INSTANT < 3s SYNC with optimistic lock)
      dom.adminProductList.addEventListener('change', async (e) => {
        const chk = e.target.closest('.stock-toggle');
        if (!chk) return;
        const id = chk.getAttribute('data-id');
        const prod = state.products.find(p => String(p.id) === String(id));
        if (prod) {
          const targetInStock = Boolean(chk.checked);
          prod.inStock = targetInStock;
          const now = Date.now();
          state.lastUpdatedAt = now;
          state.isSavingProduct = true;
          chk.disabled = true;

          try {
            localStorage.setItem('hom_products', JSON.stringify(state.products));
          } catch (err) {}

          broadcastProductSync(state.products, now);
          renderCategories();
          renderProducts();
          renderAdminProducts();
          showToast(`${getLocString(prod.name, state.lang)} is now ${targetInStock ? 'In Stock' : 'Out of Stock'}`);

          try {
            const res = await fetch(`/api/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inStock: targetInStock })
            });
            const data = await res.json();
            if (data.success) {
              state.lastUpdatedAt = data.updatedAt || Date.now();
              if (Array.isArray(data.products)) {
                state.products = data.products;
              } else {
                prod.inStock = targetInStock;
              }
              try {
                localStorage.setItem('hom_products', JSON.stringify(state.products));
              } catch (err) {}
              broadcastProductSync(state.products, state.lastUpdatedAt);
              renderCategories();
              renderProducts();
              renderAdminProducts();
            } else {
              throw new Error(data.error || 'Server error updating stock');
            }
          } catch (err) {
            console.error('[STOCK SYNC ERROR]', err);
            showToast('Stock update failed: ' + err.message, '⚠️');
            // Revert state on failure
            prod.inStock = !targetInStock;
            renderAdminProducts();
          } finally {
            state.isSavingProduct = false;
            chk.disabled = false;
          }
        }
      });
    }
  }

  function renderAdminProducts() {
    if (!dom.adminProductList) return;
    if (dom.adminProductsCount) dom.adminProductsCount.textContent = state.products.length;
    if (dom.adminProductsBadge) dom.adminProductsBadge.textContent = state.products.length;

    const q = (state.adminProdSearch || '').trim().toLowerCase();
    const filter = state.adminStockFilter || 'all';

    const filtered = state.products.filter(p => {
      if (filter === 'in' && p.inStock === false) return false;
      if (filter === 'out' && p.inStock !== false) return false;
      if (q) {
        const titleEn = getLocString(p.name, 'en').toLowerCase();
        const titleAm = getLocString(p.name, 'am').toLowerCase();
        const titleOm = getLocString(p.name, 'om').toLowerCase();
        const cat = (p.category || '').toLowerCase();
        if (!titleEn.includes(q) && !titleAm.includes(q) && !titleOm.includes(q) && !cat.includes(q)) {
          return false;
        }
      }
      return true;
    });

    if (filtered.length === 0) {
      dom.adminProductList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
          No matching products found. Try a different search or filter.
        </div>
      `;
      return;
    }

    dom.adminProductList.innerHTML = filtered.map(p => {
      const name = getLocString(p.name, state.lang);
      const img = p.images && p.images[0] ? getImgSrc(p.images[0]) : 'public/images/storage1.jpg';
      const inStock = p.inStock !== false;

      return `
        <div class="admin-prod-card" data-id="${p.id}" role="button" tabindex="0" title="Click to edit ${name}">
          <img src="${img}" alt="${name}" class="admin-prod-thumb" onerror="window.handleImgError(this);">
          
          <div class="admin-prod-details">
            <div class="admin-prod-header">
              <strong class="admin-prod-title">${name}</strong>
              <span class="admin-stock-badge ${inStock ? 'in' : 'out'}">
                ${inStock ? '✓ In Stock' : '✕ Out of Stock'}
              </span>
            </div>
            
            <div class="admin-prod-meta">
              <span class="meta-price">${formatETB(p.price)}</span>
              <span class="meta-cat">• ${p.category}</span>
              <span class="meta-photos">• ${p.images ? p.images.length : 1} photo(s)</span>
            </div>
          </div>

          <div class="admin-prod-actions">
            <label class="switch" title="Toggle In-Stock">
              <input type="checkbox" class="stock-toggle" data-id="${p.id}" ${inStock ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
            <button type="button" class="btn-admin-action btn-edit-prod" data-id="${p.id}" title="Edit Product">✏️ Edit</button>
            <button type="button" class="btn-admin-action btn-del-prod" data-id="${p.id}" title="Delete Product">🗑️</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function openProductEditor(productToEdit) {
    state.editorPhotos = [];
    state.failedUploads = [];
    hideUploadErrorBanner();
    updateProgressUI([]);

    updateCategorySuggestions();

    if (productToEdit) {
      // EDIT MODE
      if (dom.editorModalTitle) dom.editorModalTitle.textContent = 'Edit Product';
      if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = 'Save Changes';
      if (dom.editProductId) dom.editProductId.value = productToEdit.id;
      if (dom.editorProdName) dom.editorProdName.value = getLocString(productToEdit.name, 'en');
      if (dom.editorProdCategory) dom.editorProdCategory.value = productToEdit.category || '';
      
      if (productToEdit.categoryTranslations) {
        if (dom.editorCatAm) dom.editorCatAm.value = productToEdit.categoryTranslations.am || '';
        if (dom.editorCatOm) dom.editorCatOm.value = productToEdit.categoryTranslations.om || '';
        if (dom.editorCatEn) dom.editorCatEn.value = productToEdit.categoryTranslations.en || '';
        if (dom.catTranslationsCard) dom.catTranslationsCard.style.display = 'block';
        if (dom.btnToggleCatTrans) dom.btnToggleCatTrans.textContent = '− Hide Category Translations';
      } else {
        if (dom.editorCatAm) dom.editorCatAm.value = '';
        if (dom.editorCatOm) dom.editorCatOm.value = '';
        if (dom.editorCatEn) dom.editorCatEn.value = '';
        if (dom.catTranslationsCard) dom.catTranslationsCard.style.display = 'none';
        if (dom.btnToggleCatTrans) dom.btnToggleCatTrans.textContent = '+ Add Category Translations (Optional)';
      }

      if (dom.editorProdPrice) dom.editorProdPrice.value = productToEdit.price;
      if (dom.editorProdDesc) dom.editorProdDesc.value = getLocString(productToEdit.fullDesc || productToEdit.spec, 'en');
      if (dom.editorProdInStock) dom.editorProdInStock.checked = productToEdit.inStock !== false;
      state.editorPhotos = Array.isArray(productToEdit.images) ? [...productToEdit.images] : ['public/images/storage1.jpg'];
    } else {
      // ADD NEW MODE
      if (dom.editorModalTitle) dom.editorModalTitle.textContent = 'Add New Product';
      if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = 'Publish Product';
      if (dom.editProductId) dom.editProductId.value = '';
      if (dom.productEditorForm) dom.productEditorForm.reset();
      if (dom.editorCatAm) dom.editorCatAm.value = '';
      if (dom.editorCatOm) dom.editorCatOm.value = '';
      if (dom.editorCatEn) dom.editorCatEn.value = '';
      if (dom.catTranslationsCard) dom.catTranslationsCard.style.display = 'none';
      if (dom.btnToggleCatTrans) dom.btnToggleCatTrans.textContent = '+ Add Category Translations (Optional)';
      if (dom.editorProdInStock) dom.editorProdInStock.checked = true;
      state.editorPhotos = [];
    }

    if (dom.saveProductBtn) dom.saveProductBtn.disabled = false;
    renderEditorThumbnails();
    if (dom.productEditorForm) dom.productEditorForm.scrollTop = 0;
    openElement(dom.productEditorBackdrop);
    setTimeout(() => {
      if (dom.editorProdName) {
        dom.editorProdName.focus();
        if (typeof dom.editorProdName.select === 'function') dom.editorProdName.select();
      }
    }, 150);
  }

  function closeProductEditor() {
    closeElement(dom.productEditorBackdrop);
  }

  function renderEditorThumbnails() {
    if (!dom.editorThumbnailsGrid) return;
    if (state.editorPhotos.length === 0) {
      dom.editorThumbnailsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 12px;">
          No photos selected. Click "📁 Upload Photos from Device" to pick images.
        </div>
      `;
      return;
    }

    dom.editorThumbnailsGrid.innerHTML = state.editorPhotos.map((photo, i) => {
      const url = getImgSrc(photo);
      const isCover = i === 0;

      return `
        <div class="thumb-preview-card ${isCover ? 'is-cover' : ''}" data-idx="${i}">
          ${isCover ? '<span class="thumb-cover-badge">★ Cover</span>' : ''}
          <img src="${url}" alt="Preview ${i + 1}" class="thumb-preview-img" onerror="window.handleImgError(this);">
          <div class="thumb-actions-bar">
            <div style="display:flex; gap:2px;">
              ${i > 0 ? `<button type="button" class="thumb-btn-mini btn-move-left" data-idx="${i}" title="Move Left">◀</button>` : ''}
              ${i < state.editorPhotos.length - 1 ? `<button type="button" class="thumb-btn-mini btn-move-right" data-idx="${i}" title="Move Right">▶</button>` : ''}
              ${!isCover ? `<button type="button" class="thumb-btn-mini thumb-btn-cover btn-set-cover" data-idx="${i}" title="Set as Main Cover">★ Cover</button>` : ''}
            </div>
            <button type="button" class="thumb-btn-mini thumb-btn-delete btn-delete-photo" data-idx="${i}" title="Remove Photo">✕</button>
          </div>
        </div>
      `;
    }).join('');

    // Reorder Left
    dom.editorThumbnailsGrid.querySelectorAll('.btn-move-left').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx > 0) {
          const temp = state.editorPhotos[idx];
          state.editorPhotos[idx] = state.editorPhotos[idx - 1];
          state.editorPhotos[idx - 1] = temp;
          renderEditorThumbnails();
        }
      });
    });

    // Reorder Right
    dom.editorThumbnailsGrid.querySelectorAll('.btn-move-right').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx < state.editorPhotos.length - 1) {
          const temp = state.editorPhotos[idx];
          state.editorPhotos[idx] = state.editorPhotos[idx + 1];
          state.editorPhotos[idx + 1] = temp;
          renderEditorThumbnails();
        }
      });
    });

    // Set as Cover (Moves to position 0)
    dom.editorThumbnailsGrid.querySelectorAll('.btn-set-cover').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        if (idx > 0) {
          const item = state.editorPhotos.splice(idx, 1)[0];
          state.editorPhotos.unshift(item);
          renderEditorThumbnails();
          showToast('Cover photo updated! (First photo is the main storefront cover)');
        }
      });
    });

    // Delete Photo
    dom.editorThumbnailsGrid.querySelectorAll('.btn-delete-photo').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'), 10);
        state.editorPhotos.splice(idx, 1);
        renderEditorThumbnails();
      });
    });
  }

  async function handleSaveProduct(e) {
    e.preventDefault();

    if (state.isUploadingPhotos) {
      showToast('Please wait for photos to finish uploading...', '⏳');
      return;
    }

    if (state.failedUploads.length > 0) {
      showToast('Please resolve or retry failed photo uploads before saving', '⚠️');
      return;
    }

    const id = dom.editProductId ? dom.editProductId.value : '';
    const name = (dom.editorProdName ? dom.editorProdName.value : '').trim();
    const categoryRaw = (dom.editorProdCategory ? dom.editorProdCategory.value : '').trim();
    const price = dom.editorProdPrice ? parseFloat(dom.editorProdPrice.value) : 0;
    const desc = (dom.editorProdDesc ? dom.editorProdDesc.value : '').trim();
    const inStock = dom.editorProdInStock ? dom.editorProdInStock.checked : true;

    if (!name) {
      showToast('Product name is required', '⚠️');
      if (dom.editorProdName) dom.editorProdName.focus();
      return;
    }

    if (!categoryRaw) {
      showToast('Category is required. Please type a category name.', '⚠️');
      if (dom.editorProdCategory) dom.editorProdCategory.focus();
      return;
    }

    if (isNaN(price) || price <= 0) {
      showToast('Please provide a valid price in ETB', '⚠️');
      if (dom.editorProdPrice) dom.editorProdPrice.focus();
      return;
    }

    const catAm = (dom.editorCatAm ? dom.editorCatAm.value : '').trim();
    const catOm = (dom.editorCatOm ? dom.editorCatOm.value : '').trim();
    const catEn = (dom.editorCatEn ? dom.editorCatEn.value : '').trim();

    const categoryTranslations = (catAm || catOm || catEn) ? {
      en: catEn || categoryRaw,
      am: catAm || categoryRaw,
      om: catOm || categoryRaw
    } : null;

    // Reject temporary blob: or data: URLs before saving
    const hasUnfinished = state.editorPhotos.some(p => {
      const u = typeof p === 'object' ? (p.secure_url || p.url || '') : (p || '');
      return u.startsWith('blob:') || u.startsWith('data:');
    });

    if (hasUnfinished) {
      showToast('Photos are still uploading to Cloudinary. Please wait...', '⏳');
      return;
    }

    // Preserve pure secure_url string values in exact order
    const cleanPhotos = state.editorPhotos.map(p => {
      if (typeof p === 'object' && p) return p.secure_url || p.url;
      return typeof p === 'string' ? p : '';
    }).filter(u => u && !u.startsWith('blob:') && !u.startsWith('data:'));

    const photos = cleanPhotos.length > 0 ? cleanPhotos : ['public/images/storage1.jpg'];
    const photoIds = state.editorPhotos.map(p => (typeof p === 'object' && p) ? (p.public_id || '') : '').filter(Boolean);

    state.isSavingProduct = true;
    if (dom.saveProductBtn) dom.saveProductBtn.disabled = true;
    if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = id ? 'Saving Changes...' : 'Publishing to Cloud...';
    showToast(id ? 'Saving product changes...' : 'Publishing to cloud...', '⏳');

    let productToSave = null;

    if (id) {
      // Update existing
      const existing = state.products.find(p => String(p.id) === String(id));
      if (existing) {
        existing.category = categoryRaw;
        existing.categoryTranslations = categoryTranslations;
        existing.price = price;
        existing.inStock = inStock;
        existing.images = photos;
        existing.imagePublicIds = photoIds;
        const prevName = (typeof existing.name === 'object' && existing.name) ? existing.name : {};
        const prevSpec = (typeof existing.spec === 'object' && existing.spec) ? existing.spec : {};
        const prevFull = (typeof existing.fullDesc === 'object' && existing.fullDesc) ? existing.fullDesc : {};
        existing.name = {
          ...prevName,
          en: name,
          am: (prevName.am && prevName.am !== prevName.en) ? prevName.am : name,
          om: (prevName.om && prevName.om !== prevName.en) ? prevName.om : name
        };
        existing.spec = {
          ...prevSpec,
          en: desc,
          am: (prevSpec.am && prevSpec.am !== prevSpec.en) ? prevSpec.am : desc,
          om: (prevSpec.om && prevSpec.om !== prevSpec.en) ? prevSpec.om : desc
        };
        existing.fullDesc = {
          ...prevFull,
          en: desc,
          am: (prevFull.am && prevFull.am !== prevFull.en) ? prevFull.am : desc,
          om: (prevFull.om && prevFull.om !== prevFull.en) ? prevFull.om : desc
        };
        productToSave = existing;
      }
    } else {
      // Create new
      const newProd = {
        id: 'prod-' + Date.now(),
        category: categoryRaw,
        categoryTranslations: categoryTranslations,
        price: price,
        inStock: inStock,
        images: photos,
        imagePublicIds: photoIds,
        name: { en: name, am: name, om: name },
        spec: { en: desc, am: desc, om: desc },
        fullDesc: { en: desc, am: desc, om: desc },
        badge: { en: 'New', am: 'አዲስ', om: 'Haaraa' }
      };
      state.products.unshift(newProd);
      productToSave = newProd;
    }

    // Instantly update views optimistically
    renderCategories();
    renderProducts();
    renderAdminProducts();
    updateCategorySuggestions();

    const optNow = Date.now();
    state.lastUpdatedAt = optNow;
    try {
      localStorage.setItem('hom_products', JSON.stringify(state.products));
    } catch (storageErr) {
      console.warn('[STORAGE NOTICE] LocalStorage cache limit:', storageErr);
    }
    broadcastProductSync(state.products, optNow);

    // Push to shared cloud database
    try {
      let res;
      if (id) {
        res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSave)
        });
      } else {
        res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productToSave)
        });
      }

      if (res && res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products)) {
          state.products = data.products;
          state.lastUpdatedAt = data.updatedAt || Date.now();
          try {
            localStorage.setItem('hom_products', JSON.stringify(state.products));
          } catch (e) {}
          broadcastProductSync(state.products, state.lastUpdatedAt);
          renderCategories();
          renderProducts();
          renderAdminProducts();
        }
        showToast(id ? 'Product updated successfully across all devices! ✓' : 'Product published permanently across all devices! ✓');
      } else {
        showToast(id ? 'Product updated locally ✓' : 'Product published locally ✓');
      }
    } catch (err) {
      console.warn('[CLOUD PUSH NOTICE]', err.message);
      showToast(id ? 'Product updated locally ✓' : 'Product published locally ✓');
    } finally {
      state.isSavingProduct = false;
      if (dom.saveProductBtn) dom.saveProductBtn.disabled = false;
      if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = id ? 'Save Changes' : 'Publish Product';
      closeProductEditor();
    }
  }

  async function fetchAdminOrders() {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) {
          state.orders = data.orders;
          renderAdminOrders();
        }
      }
    } catch (e) {
      renderAdminOrders();
    }
  }

  function renderAdminOrders() {
    if (!dom.adminOrdersList) return;
    if (dom.adminOrderCount) dom.adminOrderCount.textContent = state.orders.length;
    if (dom.adminOrdersBadge) dom.adminOrdersBadge.textContent = state.orders.length;

    const rev = state.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    if (dom.adminTotalRevenue) dom.adminTotalRevenue.textContent = formatETB(rev);

    if (state.orders.length === 0) {
      dom.adminOrdersList.innerHTML = `<p style="padding:16px; color:var(--text-muted); text-align:center;">No orders recorded yet.</p>`;
      return;
    }

    dom.adminOrdersList.innerHTML = state.orders.map(o => `
      <div class="admin-order-card">
        <div class="order-header-row">
          <strong>${o.id}</strong>
          <span class="status-pill">${o.status}</span>
        </div>
        <div class="order-meta-grid">
          <div><small>Customer:</small> <span>${o.customer}</span></div>
          <div><small>Phone:</small> <span>${o.phone}</span></div>
          <div><small>Location:</small> <span>${o.location}</span></div>
          <div><small>Method:</small> <span>${o.method}</span></div>
          <div><small>Total:</small> <strong>${formatETB(o.total)}</strong></div>
          <div><small>Items:</small> <span>${o.itemsSummary}</span></div>
        </div>
      </div>
    `).join('');
  }

  // Activity Logs Audit Trail
  async function fetchAndRenderActivityLogs() {
    if (!dom.adminActivityList) return;
    dom.adminActivityList.innerHTML = `
      <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
        Loading activity audit trail...
      </div>
    `;

    try {
      const res = await fetch('/api/admin/activity-logs');
      if (res.ok) {
        const data = await res.json();
        const logs = data.logs || [];
        if (logs.length === 0) {
          dom.adminActivityList.innerHTML = `
            <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 0.85rem;">
              No activity logs recorded yet.
            </div>
          `;
          return;
        }

        dom.adminActivityList.innerHTML = logs.map(l => {
          const dateStr = l.created_at ? new Date(l.created_at).toLocaleString() : 'Just now';
          const actorBadge = l.actor === 'owner' ? '👑 Owner' : (l.actor === 'staff' ? '👤 Staff' : '⚙️ System');
          let actionLabel = l.action;
          let actionColor = '#10b981';
          if (l.action === 'STOCK_OUT') { actionLabel = 'Marked Out of Stock'; actionColor = '#ef4444'; }
          else if (l.action === 'STOCK_IN') { actionLabel = 'Marked In Stock'; actionColor = '#10b981'; }
          else if (l.action === 'CREATE_PRODUCT') { actionLabel = 'Created Product'; actionColor = '#3b82f6'; }
          else if (l.action === 'UPDATE_PRODUCT') { actionLabel = 'Updated Product'; actionColor = '#f59e0b'; }
          else if (l.action === 'DELETE_PRODUCT') { actionLabel = 'Deleted Product'; actionColor = '#dc2626'; }
          else if (l.action === 'CHANGE_PASSWORD') { actionLabel = 'Changed Password'; actionColor = '#8b5cf6'; }

          return `
            <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 4px; font-size: 0.82rem;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: ${actionColor};">${actionLabel}</span>
                <span style="color: var(--text-muted); font-size: 0.72rem;">${dateStr}</span>
              </div>
              <div style="display: flex; gap: 8px; align-items: center; color: var(--text-secondary);">
                <span>${actorBadge}</span>
                <span>• Target: <strong>${l.target || 'Catalog'}</strong></span>
              </div>
            </div>
          `;
        }).join('');
      } else {
        dom.adminActivityList.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--danger); font-size: 0.85rem;">
            Failed to load activity logs.
          </div>
        `;
      }
    } catch (e) {
      dom.adminActivityList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: var(--danger); font-size: 0.85rem;">
          Error connecting to activity service: ${e.message}
        </div>
      `;
    }
  }

  // Export Product Catalog Backup (CSV or JSON)
  function triggerExport(format) {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.products, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `husen_products_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported product catalog backup (JSON) ✓');
    } else {
      const headers = ['ID', 'Category', 'Price (ETB)', 'In Stock', 'Name (EN)', 'Name (AM)', 'Name (OM)', 'Images'];
      const rows = state.products.map(p => {
        const id = p.id || '';
        const cat = (p.category || '').replace(/"/g, '""');
        const price = p.price || 0;
        const stock = p.inStock ? 'Yes' : 'No';
        const nameEn = (typeof p.name === 'object' ? p.name.en || '' : p.name || '').replace(/"/g, '""');
        const nameAm = (typeof p.name === 'object' ? p.name.am || '' : p.name || '').replace(/"/g, '""');
        const nameOm = (typeof p.name === 'object' ? p.name.om || '' : p.name || '').replace(/"/g, '""');
        const imgs = (Array.isArray(p.images) ? p.images.map(getImgSrc).join(' | ') : '').replace(/"/g, '""');
        return `"${id}","${cat}",${price},"${stock}","${nameEn}","${nameAm}","${nameOm}","${imgs}"`;
      });
      const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(','), ...rows].join('\r\n'));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", csvContent);
      downloadAnchor.setAttribute("download", `husen_products_${Date.now()}.csv`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showToast('Exported product catalog (CSV) ✓');
    }
  }

  // ==========================================================================
  // 14B. PWA INSTALL SYSTEM & BROWSER DETECTION
  // ==========================================================================
  function initPWAInstallSystem() {
    // 1. Service Worker Registration & Live Auto-Update
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', { scope: '/' })
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
            try { reg.update(); } catch (e) {}

            reg.addEventListener('updatefound', () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.addEventListener('statechange', () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('[PWA] New update installed! Refreshing page to apply fixes...');
                    window.location.reload();
                  }
                });
              }
            });
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });

      let swRefreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!swRefreshing) {
          swRefreshing = true;
          window.location.reload();
        }
      });
    }

    // 2. Standalone & Platform Detection
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone === true ||
                         document.referrer.includes('android-app://');

    function isDismissedRecently() {
      try {
        const ts = localStorage.getItem('hom_install_dismissed_time');
        if (!ts) return false;
        const diff = Date.now() - parseInt(ts, 10);
        return diff < (7 * 24 * 60 * 60 * 1000); // 7 days in ms
      } catch (e) {
        return false;
      }
    }

    function setDismissed() {
      state.installBannerDismissed = true;
      try {
        localStorage.setItem('hom_install_dismissed_time', Date.now().toString());
      } catch (e) {}
    }

    function isAppInstalled() {
      if (isStandalone) return true;
      try {
        return localStorage.getItem('hom_app_installed') === 'true';
      } catch (e) {
        return false;
      }
    }

    function detectInAppBrowser() {
      const ua = navigator.userAgent || navigator.vendor || window.opera || '';
      const isTelegram = /Telegram/i.test(ua) || (window.TelegramWebviewProxy !== undefined) || (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
      const isTikTok = /musical_ly|ByteLocale|ByteFullLocale|TikTok|musical\.ly/i.test(ua);
      const isFB = /FBAN|FBAV|FB_IAB|FB4A|FBIOS/i.test(ua);
      const isInstagram = /Instagram/i.test(ua);
      const isOtherInApp = /Line|Twitter|MicroMessenger/i.test(ua);
      return Boolean(isTelegram || isTikTok || isFB || isInstagram || isOtherInApp);
    }

    function detectIOSSafari() {
      const ua = navigator.userAgent || '';
      const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
      if (!isIOS) return false;
      if (detectInAppBrowser()) return false;
      const isWebkit = /WebKit/i.test(ua);
      const isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|OPT/i.test(ua);
      return isWebkit && !isOtherIOSBrowser;
    }

    function hideAllInstallUI() {
      if (dom.headerInstallBtn) dom.headerInstallBtn.style.display = 'none';
      if (dom.installBanner) dom.installBanner.style.display = 'none';
      if (dom.iosInstallSheet) closeElement(dom.iosInstallSheet);
      if (dom.inAppBrowserModal) closeElement(dom.inAppBrowserModal);
    }

    // Never show install UI if running as standalone installed app or if permanently installed
    if (isStandalone || isAppInstalled()) {
      console.log('[PWA] Running standalone or already installed. Install UI hidden.');
      return;
    }

    // Show header button if iOS Safari or In-App Browser (Chrome will show when beforeinstallprompt fires)
    const isInApp = detectInAppBrowser();
    const isIOS = detectIOSSafari();

    if (isInApp || isIOS) {
      if (dom.headerInstallBtn && !isDismissedRecently()) {
        dom.headerInstallBtn.style.display = 'inline-flex';
      }
    }

    // 3. Android / Chrome / Edge / Samsung Internet beforeinstallprompt Event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      state.deferredInstallPrompt = e;
      console.log('[PWA] beforeinstallprompt event captured and stored.');

      if (!isAppInstalled() && !isDismissedRecently() && dom.headerInstallBtn) {
        dom.headerInstallBtn.style.display = 'inline-flex';
      }
    });

    // 4. appinstalled Event (Hide permanently)
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App successfully installed on device!');
      try {
        localStorage.setItem('hom_app_installed', 'true');
      } catch (e) {}
      hideAllInstallUI();
      showToast(t().orderSuccessTitle || 'App Installed!', '🎉');
    });

    // 5. Trigger Bottom Install Banner after 10s or product view
    window.triggerInstallBanner = function() {
      if (isStandalone || isAppInstalled() || isDismissedRecently() || state.installBannerDismissed) {
        return;
      }
      // Never show banner in admin area or when admin modal is open
      if (window.location.pathname.startsWith('/admin')) return;
      if (dom.adminBackdrop && (dom.adminBackdrop.classList.contains('open') || dom.adminBackdrop.style.display === 'flex')) return;

      if (dom.installBanner) {
        dom.installBanner.style.display = 'block';
      }
    };

    // Auto-trigger banner after 10 seconds of browsing
    setTimeout(() => {
      if (typeof window.triggerInstallBanner === 'function') {
        window.triggerInstallBanner();
      }
    }, 10000);

    // 6. Handle Install Tap
    async function handleInstallAction() {
      // Case 1: Android Chrome / Edge beforeinstallprompt
      if (state.deferredInstallPrompt) {
        try {
          state.deferredInstallPrompt.prompt();
          const choice = await state.deferredInstallPrompt.userChoice;
          console.log('[PWA] User response to install prompt:', choice.outcome);
          if (choice.outcome === 'accepted') {
            try { localStorage.setItem('hom_app_installed', 'true'); } catch (e) {}
          } else {
            setDismissed();
          }
        } catch (err) {
          console.warn('[PWA] Error launching install prompt:', err);
        } finally {
          state.deferredInstallPrompt = null;
          hideAllInstallUI();
        }
        return;
      }

      // Case 2: In-App Browser (TikTok, Telegram, Facebook, Instagram)
      if (detectInAppBrowser()) {
        if (dom.installBanner) dom.installBanner.style.display = 'none';
        if (dom.inAppBrowserModal) openElement(dom.inAppBrowserModal);
        return;
      }

      // Case 3: iOS Safari
      if (detectIOSSafari()) {
        if (dom.installBanner) dom.installBanner.style.display = 'none';
        if (dom.iosInstallSheet) openElement(dom.iosInstallSheet);
        return;
      }

      // Fallback: Other browser / Desktop Chrome
      showToast(t().installBannerSub || 'Add Husen to your home screen from your browser menu', '📱');
    }

    if (dom.headerInstallBtn) {
      dom.headerInstallBtn.addEventListener('click', handleInstallAction);
    }
    if (dom.bannerInstallBtn) {
      dom.bannerInstallBtn.addEventListener('click', handleInstallAction);
    }

    // Close banner button
    if (dom.closeInstallBannerBtn) {
      dom.closeInstallBannerBtn.addEventListener('click', () => {
        if (dom.installBanner) dom.installBanner.style.display = 'none';
        setDismissed();
      });
    }

    // Close iOS sheet buttons
    if (dom.closeIosSheetBtn) {
      dom.closeIosSheetBtn.addEventListener('click', () => closeElement(dom.iosInstallSheet));
    }
    if (dom.iosGotItBtn) {
      dom.iosGotItBtn.addEventListener('click', () => closeElement(dom.iosInstallSheet));
    }
    if (dom.iosInstallSheet) {
      dom.iosInstallSheet.addEventListener('click', (e) => {
        if (e.target === dom.iosInstallSheet) closeElement(dom.iosInstallSheet);
      });
    }

    // In-App Browser modal controls
    if (dom.closeInAppModalBtn) {
      dom.closeInAppModalBtn.addEventListener('click', () => closeElement(dom.inAppBrowserModal));
    }
    if (dom.inAppBrowserModal) {
      dom.inAppBrowserModal.addEventListener('click', (e) => {
        if (e.target === dom.inAppBrowserModal) closeElement(dom.inAppBrowserModal);
      });
    }

    // Copy store link in in-app modal
    if (dom.btnCopyStoreLink) {
      dom.btnCopyStoreLink.addEventListener('click', async () => {
        const storeUrl = window.location.origin || window.location.href;
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(storeUrl);
          } else {
            const tempInput = document.createElement('input');
            tempInput.value = storeUrl;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
          }
          if (dom.btnCopyStoreLinkText) {
            dom.btnCopyStoreLinkText.textContent = t().copiedLinkToast || 'Link copied!';
            setTimeout(() => {
              if (dom.btnCopyStoreLinkText) dom.btnCopyStoreLinkText.textContent = t().copyLinkBtn || 'Copy link';
            }, 3000);
          }
          showToast(t().copiedLinkToast || 'Link copied to clipboard!', '✓');
        } catch (err) {
          console.warn('[PWA] Failed to copy URL:', err);
          showToast(storeUrl, '🔗');
        }
      });
    }

    // Open in browser button
    if (dom.btnOpenInBrowser) {
      dom.btnOpenInBrowser.href = window.location.href;
      dom.btnOpenInBrowser.addEventListener('click', (e) => {
        const isAndroid = /Android/i.test(navigator.userAgent || '');
        if (isAndroid) {
          e.preventDefault();
          const cleanUrl = window.location.href.replace(/^https?:\/\//, '');
          const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
          window.location.href = intentUrl;
          setTimeout(() => {
            window.location.href = window.location.href;
          }, 1500);
        }
      });
    }
  }

  // ==========================================================================
  // 15. INITIALIZATION
  // ==========================================================================
  function init() {
    initLanguageSystem();
    initSearchBar();
    initCheckoutForm();
    initAdminPortal();
    initChapaModal();
    initPWAInstallSystem();

    // Clear cart button
    if (dom.clearCartBtn) {
      dom.clearCartBtn.addEventListener('click', clearEntireCart);
    }

    // Telegram detail view actions
    if (dom.closeTgViewBtn) dom.closeTgViewBtn.addEventListener('click', closeTelegramProductView);
    if (dom.tgHeaderCartBtn) {
      dom.tgHeaderCartBtn.addEventListener('click', () => {
        closeTelegramProductView();
        openCart();
      });
    }

    if (dom.tgQtyMinus) {
      dom.tgQtyMinus.addEventListener('click', () => {
        if (state.tgProductQty > 1) {
          state.tgProductQty--;
          updateTgTotals();
        }
      });
    }
    if (dom.tgQtyPlus) {
      dom.tgQtyPlus.addEventListener('click', () => {
        state.tgProductQty++;
        updateTgTotals();
      });
    }

    if (dom.tgAddToCartBtn) {
      dom.tgAddToCartBtn.addEventListener('click', () => {
        if (state.tgProduct) {
          addToCart(state.tgProduct, state.tgProductQty);
          closeTelegramProductView();
        }
      });
    }

    if (dom.tgBuyNowBtn) {
      dom.tgBuyNowBtn.addEventListener('click', () => {
        if (state.tgProduct) {
          state.cart = [{
            id: state.tgProduct.id,
            name: state.tgProduct.name,
            price: state.tgProduct.price,
            image: state.tgProduct.images && state.tgProduct.images[0] ? state.tgProduct.images[0] : 'public/images/storage1.jpg',
            qty: state.tgProductQty
          }];
          renderCart();
          openCheckout();
        }
      });
    }

    // Cart actions
    if (dom.openCartBtn) dom.openCartBtn.addEventListener('click', openCart);
    if (dom.closeCartBtn) dom.closeCartBtn.addEventListener('click', closeCart);
    if (dom.cartBackdrop) {
      dom.cartBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.cartBackdrop) closeCart();
      });
    }
    if (dom.proceedToCheckoutBtn) dom.proceedToCheckoutBtn.addEventListener('click', openCheckout);

    // Checkout modal backdrop close
    if (dom.closeCheckoutBtn) dom.closeCheckoutBtn.addEventListener('click', closeCheckout);
    if (dom.checkoutBackdrop) {
      dom.checkoutBackdrop.addEventListener('click', (e) => {
        if (e.target === dom.checkoutBackdrop) closeCheckout();
      });
    }

    // Success screen continue shopping
    if (dom.continueShoppingBtn) {
      dom.continueShoppingBtn.addEventListener('click', () => {
        closeElement(dom.successBackdrop);
      });
    }

    // Check Chapa return callback
    checkUrlPaymentCallback();

    // Sync cloud state from backend
    syncProductsFromBackend();
    syncSettingsFromBackend();

    // Real-Time Global Cloud Sync: Polling every 2 seconds (< 3 seconds requirement)
    setInterval(() => {
      syncProductsFromBackend();
    }, 2000);

    // Refresh instantly when user tabs back or focuses app
    window.addEventListener('focus', () => {
      syncProductsFromBackend(true);
    });

    // Refresh when app becomes visible again on mobile/desktop
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        syncProductsFromBackend(true);
      }
    });
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
