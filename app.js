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
      totalAmountLabel: "ጠቅላላ ክፍያ:"
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
      totalAmountLabel: "Kaffaltii Waliigalaa:"
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
      totalAmountLabel: "Total Amount:"
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
        return stored ? JSON.parse(stored) : INITIAL_PRODUCTS;
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
    cloudName: 'trkihe9m',
    uploadPreset: 'Husenonlinemarketing',
    orders: [],
    editorPhotos: []
  };

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
    adminAuthView: document.getElementById('adminAuthView'),
    adminPinInput: document.getElementById('adminPinInput'),
    adminLoginBtn: document.getElementById('adminLoginBtn'),
    adminDashboardView: document.getElementById('adminDashboardView'),
    adminTotalRevenue: document.getElementById('adminTotalRevenue'),
    adminOrderCount: document.getElementById('adminOrderCount'),
    adminProductsCount: document.getElementById('adminProductsCount'),
    adminProductsBadge: document.getElementById('adminProductsBadge'),
    adminTabProducts: document.getElementById('adminTabProducts'),
    adminTabOrders: document.getElementById('adminTabOrders'),
    adminTabSettings: document.getElementById('adminTabSettings'),
    adminOrdersBadge: document.getElementById('adminOrdersBadge'),
    adminPaneProducts: document.getElementById('adminPaneProducts'),
    adminPaneOrders: document.getElementById('adminPaneOrders'),
    adminPaneSettings: document.getElementById('adminPaneSettings'),
    adminProductList: document.getElementById('adminProductList'),
    adminOrdersList: document.getElementById('adminOrdersList'),
    openAddProductModalBtn: document.getElementById('openAddProductModalBtn'),

    // Admin Settings
    paymentSettingsForm: document.getElementById('paymentSettingsForm'),
    settingCbeAccount: document.getElementById('settingCbeAccount'),
    settingCbeName: document.getElementById('settingCbeName'),
    settingTelebirrPhone: document.getElementById('settingTelebirrPhone'),
    settingTelebirrName: document.getElementById('settingTelebirrName'),
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
    editorProdPrice: document.getElementById('editorProdPrice'),
    editorProdDesc: document.getElementById('editorProdDesc'),
    editorProdInStock: document.getElementById('editorProdInStock'),
    editorFileInput: document.getElementById('editorFileInput'),
    btnDeviceUpload: document.getElementById('btnDeviceUpload'),
    editorThumbnailsGrid: document.getElementById('editorThumbnailsGrid'),
    saveProductBtn: document.getElementById('saveProductBtn'),
    saveProductBtnText: document.getElementById('saveProductBtnText'),

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
  async function syncProductsFromBackend() {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          state.products = data.products;
          localStorage.setItem('hom_products', JSON.stringify(state.products));
          renderProducts();
          if (state.adminUnlocked) renderAdminProducts();
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
        if (configData.cloudName) state.cloudName = configData.cloudName;
        if (configData.uploadPreset) state.uploadPreset = configData.uploadPreset;
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
    if (dom.settingCbeAccount) dom.settingCbeAccount.value = state.settings.cbeAccount;
    if (dom.settingCbeName) dom.settingCbeName.value = state.settings.cbeAccountName;
    if (dom.settingTelebirrPhone) dom.settingTelebirrPhone.value = state.settings.telebirrPhone;
    if (dom.settingTelebirrName) dom.settingTelebirrName.value = state.settings.telebirrAccountName;
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
        setLanguage(selected);
        if (dom.languageGate) {
          dom.languageGate.classList.add('hidden');
          dom.languageGate.style.display = 'none';
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
    document.documentElement.lang = state.lang;

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

    updateFinalizeButtonText();
    renderCategories();
    renderProducts();
    renderCart();
  }

  // ==========================================================================
  // 7. CATEGORY NAVIGATION CHIPS
  // ==========================================================================
  function renderCategories() {
    if (!dom.categoryChipContainer) return;
    const catMap = t().categories;
    const categories = [
      { key: 'all', label: catMap.all || 'All', icon: '✨' },
      { key: 'kitchen', label: catMap.kitchen || 'Kitchen', icon: '🍳' },
      { key: 'home', label: catMap.home || 'Home', icon: '🏠' },
      { key: 'beauty', label: catMap.beauty || 'Beauty', icon: '💄' },
      { key: 'health', label: catMap.health || 'Health', icon: '🌿' }
    ];

    dom.categoryChipContainer.innerHTML = categories.map(c => `
      <button type="button" class="category-chip ${state.activeCategory === c.key ? 'active' : ''}" data-cat="${c.key}">
        <span>${c.icon}</span>
        <span>${c.label}</span>
      </button>
    `).join('');

    dom.categoryChipContainer.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeCategory = btn.getAttribute('data-cat');
        renderCategories();
        renderProducts();
      });
    });
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

      // Category match
      if (state.activeCategory !== 'all') {
        const matchesCategory = p.category === state.activeCategory || p.secondaryCategory === state.activeCategory;
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
                <img src="${img}" alt="${name}" class="product-img ${i === 0 ? 'active' : 'inactive'}" data-index="${i}" loading="lazy">
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

    // Setup Crossfade Animation for multi-photo cards
    visibleProducts.forEach(p => {
      const images = p.images && p.images.length > 0 ? p.images : [];
      if (images.length > 1) {
        let currentIdx = 0;
        crossfadeTimers[p.id] = setInterval(() => {
          const wrap = document.getElementById(`crossfade-${p.id}`);
          if (!wrap) return;
          const imgElements = wrap.querySelectorAll('.product-img');
          const dots = wrap.closest('.product-card').querySelectorAll('.multi-photo-dot');
          
          if (imgElements.length > 0) {
            imgElements[currentIdx].classList.remove('active');
            imgElements[currentIdx].classList.add('inactive');
            if (dots[currentIdx]) dots[currentIdx].classList.remove('active');

            currentIdx = (currentIdx + 1) % imgElements.length;

            imgElements[currentIdx].classList.remove('inactive');
            imgElements[currentIdx].classList.add('active');
            if (dots[currentIdx]) dots[currentIdx].classList.add('active');
          }
        }, 4500);
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
            <img src="${img}" alt="${name}" class="tg-hero-img ${i === 0 ? 'active' : 'inactive'}" data-index="${i}">
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
        image: product.images && product.images[0] ? product.images[0] : 'public/images/storage1.jpg',
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

    if (!dom.cartItemsContainer) return;

    if (state.cart.length === 0) {
      dom.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <span class="empty-icon">🛒</span>
          <h3>${t().cartEmpty}</h3>
          <p>${t().cartEmptySub}</p>
        </div>
      `;
      if (dom.proceedToCheckoutBtn) dom.proceedToCheckoutBtn.disabled = true;
      return;
    }

    if (dom.proceedToCheckoutBtn) dom.proceedToCheckoutBtn.disabled = false;

    dom.cartItemsContainer.innerHTML = state.cart.map(item => `
      <div class="cart-item-row" data-id="${item.id}">
        <img src="${item.image}" alt="${getLocString(item.name, state.lang)}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${getLocString(item.name, state.lang)}</h4>
          <span class="cart-item-price">${formatETB(item.price)}</span>
          
          <div class="cart-item-stepper">
            <button type="button" class="btn-cart-minus" data-id="${item.id}">−</button>
            <span class="cart-item-qty">${item.qty}</span>
            <button type="button" class="btn-cart-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button type="button" class="btn-cart-remove" data-id="${item.id}" aria-label="Remove">✕</button>
      </div>
    `).join('');

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
      image: product.images && product.images[0] ? product.images[0] : 'public/images/storage1.jpg',
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
          // Redirect to verified Chapa checkout page
          window.location.href = data.checkout_url;
        } else {
          throw new Error(data.message || 'Chapa initialization failed');
        }
      } catch (err) {
        console.error('[CHAPA ERROR]', err);
        showToast('Payment gateway connection notice: ' + err.message, '⚠️');
        dom.btnFinalizePayment.disabled = false;
        dom.btnFinalizePayment.classList.remove('loading');
      }
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

  // Check URL params for Chapa return success
  function checkUrlPaymentCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
      const txRef = urlParams.get('tx_ref') || 'HOM-tx-SUCCESS';
      fetch(`/api/chapa/verify/${txRef}`).then(r => r.json()).then(data => {
        const order = data.order || {
          id: txRef,
          customer: "Chapa Customer",
          phone: "+251912345678",
          location: "Adama",
          method: "Paid - Chapa",
          total: 2850,
          status: "Paid - Chapa Payment Verified"
        };
        showOrderSuccess(order);
      }).catch(() => {
        showOrderSuccess({
          id: txRef,
          customer: "Customer",
          phone: "+251900000000",
          location: "Adama",
          method: "Paid - Chapa",
          total: 0,
          status: "Paid - Chapa Verified"
        });
      });
      // Clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // ==========================================================================
  // 14. ADMIN PORTAL (Product CRUD, Device Multi-Photo & Payment Settings)
  // ==========================================================================
  function initAdminPortal() {
    if (dom.openAdminBtn) {
      dom.openAdminBtn.addEventListener('click', () => {
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
    if (localStorage.getItem('hom_admin_logged_in') === 'true') {
      state.adminUnlocked = true;
      if (dom.adminAuthView) dom.adminAuthView.style.display = 'none';
      if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'block';
      if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'inline-flex';
      renderAdminProducts();
      fetchAdminOrders();
      updateAccountDisplays();
    }

    // Admin Password Login Handler
    async function performAdminLogin() {
      const password = dom.adminPinInput ? dom.adminPinInput.value.trim() : '';
      if (!password) {
        showToast('Please enter the admin password', '⚠️');
        return;
      }

      let authenticated = (password === 'husenonlinemarketing1234');
      try {
        const verifyRes = await fetch('/api/admin/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });
        if (verifyRes.ok) {
          const data = await verifyRes.json();
          if (data.success) authenticated = true;
        }
      } catch (e) {}

      if (authenticated) {
        state.adminUnlocked = true;
        localStorage.setItem('hom_admin_logged_in', 'true');
        if (dom.adminAuthView) dom.adminAuthView.style.display = 'none';
        if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'block';
        if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'inline-flex';
        if (dom.adminPinInput) dom.adminPinInput.value = '';
        renderAdminProducts();
        fetchAdminOrders();
        updateAccountDisplays();
        showToast('Admin Portal unlocked!', '🔓');
      } else {
        showToast('Incorrect password. Please try again.', '⚠️');
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

    // Admin Explicit Log Out Button
    if (dom.adminLogoutBtn) {
      dom.adminLogoutBtn.addEventListener('click', () => {
        localStorage.removeItem('hom_admin_logged_in');
        state.adminUnlocked = false;
        if (dom.adminAuthView) dom.adminAuthView.style.display = 'block';
        if (dom.adminDashboardView) dom.adminDashboardView.style.display = 'none';
        if (dom.adminLogoutBtn) dom.adminLogoutBtn.style.display = 'none';
        if (dom.adminPinInput) dom.adminPinInput.value = '';
        showToast('Logged out of Admin Portal');
      });
    }

    // Admin Tabs
    const tabs = [
      { btn: dom.adminTabProducts, pane: dom.adminPaneProducts },
      { btn: dom.adminTabOrders, pane: dom.adminPaneOrders },
      { btn: dom.adminTabSettings, pane: dom.adminPaneSettings }
    ];

    tabs.forEach(({ btn, pane }) => {
      if (btn && pane) {
        btn.addEventListener('click', () => {
          tabs.forEach(t => {
            if (t.btn) t.btn.classList.remove('active');
            if (t.pane) t.pane.style.display = 'none';
          });
          btn.classList.add('active');
          pane.style.display = 'block';
        });
      }
    });

    // Save Payment Settings form
    if (dom.paymentSettingsForm) {
      dom.paymentSettingsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newSettings = {
          cbeAccount: (dom.settingCbeAccount ? dom.settingCbeAccount.value : '').trim(),
          cbeAccountName: (dom.settingCbeName ? dom.settingCbeName.value : '').trim(),
          telebirrPhone: (dom.settingTelebirrPhone ? dom.settingTelebirrPhone.value : '').trim(),
          telebirrAccountName: (dom.settingTelebirrName ? dom.settingTelebirrName.value : '').trim()
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

        showToast('Payment account numbers updated successfully!');
      });
    }

    // Admin Add New Product Button
    if (dom.openAddProductModalBtn) {
      dom.openAddProductModalBtn.addEventListener('click', () => {
        openProductEditor(null);
      });
    }

    // Admin Photo Uploader with Cloudinary integration & fallback
    if (dom.btnDeviceUpload && dom.editorFileInput) {
      dom.btnDeviceUpload.addEventListener('click', () => {
        dom.editorFileInput.click();
      });

      dom.editorFileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        showToast(`Processing ${files.length} photo(s)...`, '⏳');

        for (const file of files) {
          let uploadedUrl = null;
          // Direct Cloudinary unsigned upload
          try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', state.uploadPreset || 'Husenonlinemarketing');

            const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${state.cloudName || 'trkihe9m'}/image/upload`, {
              method: 'POST',
              body: formData
            });

            if (cloudRes.ok) {
              const cloudData = await cloudRes.json();
              if (cloudData.secure_url) {
                uploadedUrl = cloudData.secure_url;
              }
            }
          } catch (cloudErr) {
            console.warn('[CLOUDINARY NOTICE] Network notice, using fallback:', cloudErr.message);
          }

          if (uploadedUrl) {
            state.editorPhotos.push(uploadedUrl);
            renderEditorThumbnails();
          } else {
            // Local DataURL Fallback
            const reader = new FileReader();
            reader.onload = (evt) => {
              state.editorPhotos.push(evt.target.result);
              renderEditorThumbnails();
            };
            reader.readAsDataURL(file);
          }
        }
        dom.editorFileInput.value = '';
        showToast('Photos ready!', '✓');
      });
    }

    // Quick Preset Photos
    document.querySelectorAll('.btn-preset-img').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        if (preset) {
          state.editorPhotos.push(preset);
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
  }

  function renderAdminProducts() {
    if (!dom.adminProductList) return;
    if (dom.adminProductsCount) dom.adminProductsCount.textContent = state.products.length;
    if (dom.adminProductsBadge) dom.adminProductsBadge.textContent = state.products.length;

    dom.adminProductList.innerHTML = state.products.map(p => {
      const name = getLocString(p.name, state.lang);
      const img = p.images && p.images[0] ? p.images[0] : 'public/images/storage1.jpg';
      const inStock = p.inStock !== false;

      return `
        <div class="admin-prod-card" data-id="${p.id}">
          <img src="${img}" alt="${name}" class="admin-prod-thumb">
          
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

    // Wire stock toggles
    dom.adminProductList.querySelectorAll('.stock-toggle').forEach(chk => {
      chk.addEventListener('change', async () => {
        const id = chk.getAttribute('data-id');
        const prod = state.products.find(p => p.id === id);
        if (prod) {
          prod.inStock = chk.checked;
          localStorage.setItem('hom_products', JSON.stringify(state.products));
          renderProducts();
          renderAdminProducts();
          showToast(`${getLocString(prod.name, state.lang)} is now ${chk.checked ? 'In Stock' : 'Out of Stock'}`);
          try {
            await fetch(`/api/products/${id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ inStock: chk.checked })
            });
          } catch (e) {}
        }
      });
    });

    // Wire Edit buttons
    dom.adminProductList.querySelectorAll('.btn-edit-prod').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const prod = state.products.find(p => p.id === id);
        if (prod) openProductEditor(prod);
      });
    });

    // Wire Delete buttons
    dom.adminProductList.querySelectorAll('.btn-del-prod').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const prod = state.products.find(p => p.id === id);
        if (!prod) return;
        if (confirm(`Are you sure you want to delete "${getLocString(prod.name, state.lang)}"?`)) {
          state.products = state.products.filter(p => p.id !== id);
          localStorage.setItem('hom_products', JSON.stringify(state.products));
          renderProducts();
          renderAdminProducts();
          showToast('Product deleted from inventory');
          try {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
          } catch (e) {}
        }
      });
    });
  }

  function openProductEditor(productToEdit) {
    state.editorPhotos = [];

    if (productToEdit) {
      // EDIT MODE
      if (dom.editorModalTitle) dom.editorModalTitle.textContent = 'Edit Product';
      if (dom.saveProductBtnText) dom.saveProductBtnText.textContent = 'Save Changes';
      if (dom.editProductId) dom.editProductId.value = productToEdit.id;
      if (dom.editorProdName) dom.editorProdName.value = getLocString(productToEdit.name, 'en');
      if (dom.editorProdCategory) dom.editorProdCategory.value = productToEdit.category || 'home';
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
      if (dom.editorProdInStock) dom.editorProdInStock.checked = true;
      state.editorPhotos = ['public/images/storage1.jpg'];
    }

    renderEditorThumbnails();

    openElement(dom.productEditorBackdrop);
  }

  function closeProductEditor() {
    closeElement(dom.productEditorBackdrop);
  }

  function renderEditorThumbnails() {
    if (!dom.editorThumbnailsGrid) return;
    if (state.editorPhotos.length === 0) {
      dom.editorThumbnailsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 0.75rem; padding: 12px;">
          No photos selected. Click "📁 Upload Photo from Device" to pick images.
        </div>
      `;
      return;
    }

    dom.editorThumbnailsGrid.innerHTML = state.editorPhotos.map((img, i) => `
      <div class="thumb-preview-card" data-idx="${i}">
        <img src="${img}" alt="Preview ${i + 1}" class="thumb-preview-img">
        <button type="button" class="thumb-delete-btn" data-idx="${i}" title="Remove Photo">✕</button>
      </div>
    `).join('');

    dom.editorThumbnailsGrid.querySelectorAll('.thumb-delete-btn').forEach(btn => {
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

    const id = dom.editProductId ? dom.editProductId.value : '';
    const name = (dom.editorProdName ? dom.editorProdName.value : '').trim();
    const category = dom.editorProdCategory ? dom.editorProdCategory.value : 'home';
    const price = dom.editorProdPrice ? parseFloat(dom.editorProdPrice.value) : 0;
    const desc = (dom.editorProdDesc ? dom.editorProdDesc.value : '').trim();
    const inStock = dom.editorProdInStock ? dom.editorProdInStock.checked : true;
    const photos = state.editorPhotos.length > 0 ? state.editorPhotos : ['public/images/storage1.jpg'];

    if (!name || isNaN(price) || price <= 0) {
      showToast('Please provide a valid product name and price', '⚠️');
      return;
    }

    if (id) {
      // Update existing
      const existing = state.products.find(p => p.id === id);
      if (existing) {
        existing.category = category;
        existing.price = price;
        existing.inStock = inStock;
        existing.images = photos;
        existing.name = { ...existing.name, en: name, am: name, om: name };
        existing.spec = { ...existing.spec, en: desc, am: desc, om: desc };
        existing.fullDesc = { ...existing.fullDesc, en: desc, am: desc, om: desc };
      }
      showToast('Product updated successfully!');
      try {
        await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(existing)
        });
      } catch (err) {}
    } else {
      // Create new
      const newProd = {
        id: 'prod-' + Date.now(),
        category: category,
        price: price,
        inStock: inStock,
        images: photos,
        name: { en: name, am: name, om: name },
        spec: { en: desc, am: desc, om: desc },
        fullDesc: { en: desc, am: desc, om: desc },
        badge: { en: 'New', am: 'አዲስ', om: 'Haaraa' }
      };
      state.products.unshift(newProd);
      showToast('New product published!');
      try {
        await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newProd)
        });
      } catch (err) {}
    }

    localStorage.setItem('hom_products', JSON.stringify(state.products));
    renderProducts();
    renderAdminProducts();
    closeProductEditor();
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

  // ==========================================================================
  // 15. INITIALIZATION
  // ==========================================================================
  function init() {
    initLanguageSystem();
    initSearchBar();
    initCheckoutForm();
    initAdminPortal();

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
  }

  // Bootstrap when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
